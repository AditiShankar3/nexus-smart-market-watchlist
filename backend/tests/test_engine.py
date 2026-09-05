"""
Unit and integration tests for Indian Equities Nexus Market Graph backend.
Verifies Indian Graph Contagion, Rupee Delta Mathematics, Auth, and Session Snapshotting.
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os
import uuid

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from graph_engine import market_graph
from delta_engine import delta_engine

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["graph_node_count"] > 0
    assert data["graph_edge_count"] > 0


def test_auth_and_session_leave_snapshot_inr():
    """Verify user login, session exit price recording, and Indian Rupee delta recall."""
    login_resp = client.post("/api/auth/login", json={"username": "aditi_trader"})
    assert login_resp.status_code == 200
    user = login_resp.json()
    user_id = user["id"]

    # Record exact exit prices in Rupees
    leave_resp = client.post("/api/session/leave", json={
        "user_id": user_id,
        "exit_prices": {"TATAMOTORS.NS": 950.00, "TATAPOWER.NS": 415.00}
    })
    assert leave_resp.status_code == 200

    # Analyze delta for this logged-in user
    analyze_resp = client.get(f"/api/delta/analyze?user_id={user_id}&baseline_mode=last_visit")
    assert analyze_resp.status_code == 200
    data = analyze_resp.json()
    assert data["is_user_logged_in"] is True
    assert len(data["items"]) > 0


def test_indian_graph_ripple_propagation():
    """Verify that a shock in Tata Power propagates a supply chain ripple to Tata Motors."""
    primary_shock = [{
        "ticker": "TATAPOWER.NS",
        "change_pct": 5.0,
        "rvol": 3.0,
        "reason": "Mega EV charging deployment contract"
    }]
    ripples = market_graph.calculate_ripple_effects(primary_shock, ["TATAMOTORS.NS", "MARUTI.NS"])

    assert "TATAMOTORS.NS" in ripples
    assert ripples["TATAMOTORS.NS"]["ripple_score"] > 20.0
    assert ripples["TATAMOTORS.NS"]["propagated_from"] == "TATAPOWER.NS"


def test_meaningful_change_score_calculation():
    """Verify Meaningful Change Score for an Indian bluechip."""
    current_stock = {
        "ticker": "RELIANCE.NS",
        "name": "Reliance Industries",
        "price": 2980.0,
        "change_pct": 3.5,
        "volume": 6000000,
        "rvol": 2.5,
        "beta": 1.05,
        "sector": "Energy & Telecom",
        "sector_etf": "NIFTYBEES.NS",
        "news_event": "Jio 5G tariff revision",
        "catalyst_severity": 0.8
    }
    baseline_stock = {"price": 2880.0}

    sector_current = {"price": 265.0, "change_pct": 0.5}
    sector_baseline = {"price": 263.7}

    delta = delta_engine.calculate_stock_delta(
        current_data=current_stock,
        baseline_data=baseline_stock,
        sector_current=sector_current,
        sector_baseline=sector_baseline
    )

    assert delta["meaningful_change_score"] >= 50.0
    assert delta["urgency_level"] in ["MEANINGFUL_CHANGE", "CRITICAL_ANOMALY"]
    assert delta["divergence_pct"] > 2.0


def test_guest_general_summaries():
    """Verify general summaries (1h, 3h, 5h) for guests and new users."""
    for mode in ["1h", "3h", "5h", "market_open"]:
        resp = client.get(f"/api/delta/analyze?baseline_mode={mode}")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) > 0


def test_add_long_nse_ticker_to_watchlist():
    """Verify adding longer NSE symbols (e.g. TATAMOTORS.NS, BHARTIARTL.NS) to a watchlist."""
    # 1. Create a test watchlist
    wl_resp = client.post("/api/watchlists", json={"name": "Auto & Telecom Watch"})
    assert wl_resp.status_code == 200
    wl_id = wl_resp.json()["id"]

    # 2. Add long NSE ticker symbols
    add_resp1 = client.post(f"/api/watchlists/{wl_id}/items", json={"ticker": "TATAMOTORS.NS"})
    assert add_resp1.status_code == 200

    add_resp2 = client.post(f"/api/watchlists/{wl_id}/items", json={"ticker": "BHARTIARTL.NS"})
    assert add_resp2.status_code == 200

    add_resp3 = client.post(f"/api/watchlists/{wl_id}/items", json={"ticker": "HINDUNILVR.NS"})
    assert add_resp3.status_code == 200

    # 3. Clean up
    del_resp = client.delete(f"/api/watchlists/{wl_id}")
    assert del_resp.status_code == 200


def test_user_isolation_and_auth_tokens():
    """Verify that User A cannot see or delete User B's watchlists and session tokens work."""
    # 1. Register User A
    user_a_resp = client.post("/api/auth/register", json={
        "username": f"alice_{uuid.uuid4().hex[:6]}",
        "name": "Alice Sharma",
        "email": "alice@example.com"
    })
    assert user_a_resp.status_code == 200
    user_a = user_a_resp.json()
    token_a = user_a["session_token"]
    assert token_a.startswith("tok_")

    # 2. Register User B
    user_b_resp = client.post("/api/auth/register", json={
        "username": f"bob_{uuid.uuid4().hex[:6]}",
        "name": "Bob Verma",
        "email": "bob@example.com"
    })
    assert user_b_resp.status_code == 200
    user_b = user_b_resp.json()
    token_b = user_b["session_token"]

    # 3. User A creates a private watchlist
    wl_a_resp = client.post("/api/watchlists", json={
        "name": "Alice Private AI & Cloud",
        "initial_tickers": ["TCS.NS", "INFY.NS"]
    }, headers={"Authorization": f"Bearer {token_a}"})
    assert wl_a_resp.status_code == 200
    wl_a_id = wl_a_resp.json()["id"]

    # 4. User B lists watchlists: MUST NOT see User A's private watchlist
    wl_b_list = client.get("/api/watchlists", headers={"Authorization": f"Bearer {token_b}"}).json()["watchlists"]
    b_ids = [w["id"] for w in wl_b_list]
    assert wl_a_id not in b_ids

    # 5. User A lists watchlists: MUST see User A's private watchlist + defaults
    wl_a_list = client.get("/api/watchlists", headers={"Authorization": f"Bearer {token_a}"}).json()["watchlists"]
    a_ids = [w["id"] for w in wl_a_list]
    assert wl_a_id in a_ids

    # 6. User B tries to delete User A's watchlist -> MUST be 403 Forbidden
    del_unauth = client.delete(f"/api/watchlists/{wl_a_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert del_unauth.status_code == 403

    # 7. User A deletes their own watchlist -> MUST be 200 OK
    del_auth = client.delete(f"/api/watchlists/{wl_a_id}", headers={"Authorization": f"Bearer {token_a}"})
    assert del_auth.status_code == 200


def test_protected_default_watchlists():
    """Verify system default watchlists cannot be deleted."""
    del_default = client.delete("/api/watchlists/wl-nifty-titans")
    assert del_default.status_code == 403


def test_settings_persistence():
    """Verify reading and saving application preferences."""
    save_resp = client.post("/api/settings", json={
        "settings": {
            "data_provider": "hybrid",
            "gemini_api_key": "test_gemini_key_123",
            "refresh_rate": 45
        }
    })
    assert save_resp.status_code == 200

    get_resp = client.get("/api/settings")
    assert get_resp.status_code == 200
    settings = get_resp.json()
    assert settings["data_provider"] == "hybrid"
    assert settings["gemini_api_key"] == "test_gemini_key_123"


def test_swiggy_and_zomato_graph_edge():
    """Verify SWIGGY.NS is in universe and connects to ZOMATO.NS in knowledge graph."""
    meta = market_graph.get_ticker_metadata("SWIGGY.NS")
    assert meta is not None
    assert meta["ticker"] == "SWIGGY.NS"

    neighborhood = market_graph.get_ticker_neighborhood("ZOMATO.NS")
    competitors = neighborhood.get("competitors", [])
    comp_tickers = [c["ticker"] for c in competitors]
    assert "SWIGGY.NS" in comp_tickers


def test_indian_fallback_tickers():
    """Verify empty watchlist fallback provides valid Indian stocks with realistic base prices."""
    resp = client.get("/api/delta/analyze?baseline_mode=3h&watchlist_id=nonexistent_id")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) > 0
    tickers = [i["ticker"] for i in data["items"]]
    assert any("RELIANCE.NS" in t or "TCS.NS" in t for t in tickers)
    assert not any(t in ["NVDA", "TSM", "ASML"] for t in tickers)


