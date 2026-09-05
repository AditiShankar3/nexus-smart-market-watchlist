"""
FastAPI Application Entrypoint for Smart Market Watchlist (Nexus Graph).
Exposes REST endpoints for User Authentication, Session Price Tracking,
Delta Analysis, Knowledge Graph, and Live Simulation.
"""
from fastapi import FastAPI, HTTPException, Query, Body, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
import uuid
import json
import sqlite3
import asyncio

from database import get_db_connection, init_db
from graph_engine import market_graph, DEFAULT_STOCKS
from delta_engine import delta_engine
from data_service import data_service

from contextlib import asynccontextmanager


async def market_data_scheduler():
    """Background task periodically refreshing live NSE quotes and logging snapshots."""
    while True:
        try:
            await asyncio.sleep(60)
            await asyncio.to_thread(data_service.refresh_live_quotes)
        except asyncio.CancelledError:
            break
        except Exception:
            await asyncio.sleep(10)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    scheduler_task = asyncio.create_task(market_data_scheduler())
    yield
    scheduler_task.cancel()
    try:
        await scheduler_task
    except asyncio.CancelledError:
        pass


app = FastAPI(
    title="Nexus Market Graph API",
    description="Smart Context-Aware & Temporal Delta Market Watchlist Engine",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS with explicit origins per Fetch/CORS spec
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://nexus-smart-market-watchlist.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_current_user_id(authorization: Optional[str] = None) -> Optional[str]:
    """Verify session token from Authorization: Bearer <token> or direct user id."""
    if not authorization:
        return None
    token = authorization.replace("Bearer ", "").strip()
    if not token:
        return None
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE session_token = ? OR id = ?", (token, token))
    row = cursor.fetchone()
    conn.close()
    return row["id"] if row else None


# Pydantic Request/Response Models
class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = ""


class SessionLeaveRequest(BaseModel):
    user_id: str
    exit_prices: Optional[Dict[str, float]] = None


class CreateWatchlistRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = ""
    initial_tickers: Optional[List[str]] = []
    user_id: Optional[str] = None


class AddWatchlistItemRequest(BaseModel):
    ticker: str = Field(..., min_length=1, max_length=30)
    notes: Optional[str] = ""


class SaveCheckpointRequest(BaseModel):
    checkpoint_name: str = "Last User Visit"
    notes: Optional[str] = ""
    user_id: Optional[str] = None


class UpdateSettingsRequest(BaseModel):
    settings: Dict[str, Any]


class InjectShockRequest(BaseModel):
    shock_type: str = "TSM_FOUNDRY_DISRUPTION"


@app.get("/api/health")
def get_health():
    """Returns system status, data freshness, and graph node count."""
    return {
        "status": "healthy",
        "data_status": data_service.data_status,
        "graph_node_count": market_graph.graph.number_of_nodes(),
        "graph_edge_count": market_graph.graph.number_of_edges(),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ==========================================
# Authentication & User Session Management
# ==========================================

@app.post("/api/auth/login")
def login_user(req: LoginRequest):
    """
    Log in a user.
    Returns user profile, session token, previous logout timestamp, and exact stored closing prices.
    Rejects unknown usernames to prevent silent accidental registrations.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username.strip(),))
    row = cursor.fetchone()

    now_iso = datetime.now(timezone.utc).isoformat()

    if not row:
        if req.username.strip().lower() == "demo_user":
            user_id = "usr_demo_01"
            name = "Aditi Shankar"
            past_2h_iso = (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()
            default_prices = {
                "RELIANCE.NS": 2940.00, "TCS.NS": 4180.00, "INFY.NS": 1755.00,
                "HDFCBANK.NS": 1665.00, "TATAMOTORS.NS": 945.00, "BHARTIARTL.NS": 1810.00
            }
            token = "tok_demo_user"
            cursor.execute("""
            INSERT INTO users (id, username, name, email, created_at, last_login_at, last_logout_at, last_exit_prices_json, session_token)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (user_id, "demo_user", name, "aditi@example.com", now_iso, now_iso, past_2h_iso, json.dumps(default_prices), token))
            conn.commit()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
        else:
            conn.close()
            raise HTTPException(status_code=404, detail="User not found. Please check your username or create an account.")

    # Issue or refresh session token
    session_token = row["session_token"] or f"tok_{uuid.uuid4().hex}"
    cursor.execute("UPDATE users SET last_login_at = ?, session_token = ? WHERE id = ?", (now_iso, session_token, row["id"]))
    conn.commit()

    prev_logout = row["last_logout_at"] or row["created_at"]
    exit_prices = json.loads(row["last_exit_prices_json"]) if row["last_exit_prices_json"] else {}
    conn.close()

    return {
        "id": row["id"],
        "username": row["username"],
        "name": row["name"],
        "email": row["email"],
        "session_token": session_token,
        "last_login_at": now_iso,
        "previous_logout_at": prev_logout,
        "stored_exit_prices": exit_prices,
        "is_new_user": row["created_at"] == now_iso
    }


@app.post("/api/auth/register")
def register_user(req: RegisterRequest):
    """Register a new user account with secure session token."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE username = ?", (req.username.strip(),))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")

    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    session_token = f"tok_{uuid.uuid4().hex}"

    cursor.execute("""
    INSERT INTO users (id, username, name, email, created_at, last_login_at, last_logout_at, last_exit_prices_json, session_token)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, req.username.strip(), req.name.strip(), req.email or "", now_iso, now_iso, None, "{}", session_token))

    conn.commit()
    conn.close()

    return {
        "id": user_id,
        "username": req.username,
        "name": req.name,
        "email": req.email,
        "session_token": session_token,
        "created_at": now_iso,
        "is_new_user": True
    }


@app.post("/api/session/leave")
def record_session_exit(req: SessionLeaveRequest):
    """
    Called automatically when the user closes or leaves the tab.
    Stores the exact second of exit and the exact closing prices with 0 hallucination.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    now_iso = datetime.now(timezone.utc).isoformat()

    if not req.exit_prices:
        quotes = data_service.get_current_market_quotes()
        prices = {k: v["price"] for k, v in quotes.items()}
    else:
        prices = req.exit_prices

    prices_json = json.dumps(prices)

    cursor.execute("""
    UPDATE users 
    SET last_logout_at = ?, last_exit_prices_json = ?
    WHERE id = ?
    """, (now_iso, prices_json, req.user_id))

    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()

    return {"success": rows_affected > 0, "rows_updated": rows_affected, "exit_time": now_iso, "prices_recorded": len(prices)}


# ==========================================
# Settings & Configuration Endpoints
# ==========================================

@app.get("/api/settings")
def get_settings():
    """Retrieve persisted application and market provider settings."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT key, value FROM settings")
    rows = cursor.fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}


@app.post("/api/settings")
def save_settings(req: UpdateSettingsRequest):
    """Persist system preferences, provider keys, and refresh rates."""
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

    for k, v in req.settings.items():
        cursor.execute("""
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at
        """, (k, str(v) if v is not None else "", now_iso))

    conn.commit()
    conn.close()
    return {"success": True, "message": "Settings saved successfully"}


# ==========================================
# Watchlist Management Endpoints (User-Isolated)
# ==========================================

@app.get("/api/watchlists")
def list_watchlists(user_id: Optional[str] = None, authorization: Optional[str] = Header(None)):
    """
    Retrieve user watchlists with item counts.
    Guarantees user isolation: logged-in users see default watchlists plus their own private watchlists.
    Guests see only default watchlists.
    """
    auth_user = get_current_user_id(authorization) or user_id

    conn = get_db_connection()
    cursor = conn.cursor()

    if auth_user:
        cursor.execute("""
        SELECT w.*, COUNT(i.id) as item_count
        FROM watchlists w
        LEFT JOIN watchlist_items i ON w.id = i.watchlist_id
        WHERE w.user_id = ? OR w.user_id IS NULL
        GROUP BY w.id
        ORDER BY w.is_default DESC, w.created_at ASC
        """, (auth_user,))
    else:
        cursor.execute("""
        SELECT w.*, COUNT(i.id) as item_count
        FROM watchlists w
        LEFT JOIN watchlist_items i ON w.id = i.watchlist_id
        WHERE w.user_id IS NULL
        GROUP BY w.id
        ORDER BY w.is_default DESC, w.created_at ASC
        """)
    rows = cursor.fetchall()

    watchlists = []
    for r in rows:
        cursor.execute("SELECT ticker FROM watchlist_items WHERE watchlist_id = ? ORDER BY order_index ASC", (r["id"],))
        tickers = [item["ticker"] for item in cursor.fetchall()]

        watchlists.append({
            "id": r["id"],
            "name": r["name"],
            "description": r["description"],
            "is_default": bool(r["is_default"]),
            "is_owner": r["user_id"] == auth_user if auth_user else False,
            "user_id": r["user_id"],
            "item_count": r["item_count"],
            "tickers": tickers,
            "created_at": r["created_at"],
            "updated_at": r["updated_at"]
        })

    conn.close()
    return {"watchlists": watchlists}


@app.post("/api/watchlists")
def create_watchlist(req: CreateWatchlistRequest, authorization: Optional[str] = Header(None)):
    """Create a new user watchlist with ownership bound to requesting user."""
    auth_user = get_current_user_id(authorization) or req.user_id

    conn = get_db_connection()
    cursor = conn.cursor()

    # Validate user_id exists in users table
    valid_user_id = None
    if auth_user:
        cursor.execute("SELECT id FROM users WHERE id = ?", (auth_user,))
        row = cursor.fetchone()
        if row:
            valid_user_id = auth_user

    wl_id = f"wl-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    try:
        cursor.execute("""
        INSERT INTO watchlists (id, user_id, name, description, is_default, created_at, updated_at)
        VALUES (?, ?, ?, ?, 0, ?, ?)
        """, (wl_id, valid_user_id, req.name.strip(), req.description or "", now_iso, now_iso))

        for idx, ticker in enumerate(req.initial_tickers or []):
            t_clean = ticker.upper().strip()
            cursor.execute("""
            INSERT OR IGNORE INTO watchlist_items (id, watchlist_id, ticker, notes, order_index, added_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (f"{wl_id}-{t_clean}", wl_id, t_clean, "", idx, now_iso))

        conn.commit()
        cursor.execute("PRAGMA wal_checkpoint(PASSIVE);")
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to create watchlist: {str(e)}")

    conn.close()
    return {"id": wl_id, "name": req.name, "user_id": valid_user_id, "message": "Watchlist created successfully"}


@app.delete("/api/watchlists/{watchlist_id}")
def delete_watchlist(watchlist_id: str, authorization: Optional[str] = Header(None), user_id: Optional[str] = None):
    """Delete a user watchlist. System default watchlists are protected and cannot be deleted."""
    auth_user = get_current_user_id(authorization) or user_id

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, user_id, is_default FROM watchlists WHERE id = ?", (watchlist_id,))
    wl = cursor.fetchone()

    if not wl:
        conn.close()
        raise HTTPException(status_code=404, detail="Watchlist not found")

    if bool(wl["is_default"]):
        conn.close()
        raise HTTPException(status_code=403, detail="Cannot delete system default watchlist")

    if wl["user_id"] and auth_user and wl["user_id"] != auth_user:
        conn.close()
        raise HTTPException(status_code=403, detail="Unauthorized: you cannot delete another user's watchlist")

    cursor.execute("DELETE FROM watchlists WHERE id = ?", (watchlist_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()

    if deleted == 0:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    return {"success": True, "message": "Watchlist deleted"}


@app.post("/api/watchlists/{watchlist_id}/items")
def add_item_to_watchlist(watchlist_id: str, req: AddWatchlistItemRequest, authorization: Optional[str] = Header(None), user_id: Optional[str] = None):
    """Add a stock ticker to a watchlist with ownership checks."""
    auth_user = get_current_user_id(authorization) or user_id
    t_clean = req.ticker.upper().strip()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, user_id, is_default FROM watchlists WHERE id = ?", (watchlist_id,))
    wl = cursor.fetchone()
    if not wl:
        conn.close()
        raise HTTPException(status_code=404, detail="Watchlist not found")

    if wl["user_id"] and auth_user and wl["user_id"] != auth_user:
        conn.close()
        raise HTTPException(status_code=403, detail="Unauthorized to modify another user's watchlist")

    item_id = f"{watchlist_id}-{t_clean}"
    now_iso = datetime.now(timezone.utc).isoformat()

    cursor.execute("""
    INSERT OR REPLACE INTO watchlist_items (id, watchlist_id, ticker, notes, order_index, added_at)
    VALUES (?, ?, ?, ?, (SELECT COALESCE(MAX(order_index), 0) + 1 FROM watchlist_items WHERE watchlist_id = ?), ?)
    """, (item_id, watchlist_id, t_clean, req.notes, watchlist_id, now_iso))

    conn.commit()
    conn.close()
    return {"success": True, "ticker": t_clean, "message": f"{t_clean} added to watchlist"}


@app.delete("/api/watchlists/{watchlist_id}/items/{ticker}")
def remove_item_from_watchlist(watchlist_id: str, ticker: str, authorization: Optional[str] = Header(None), user_id: Optional[str] = None):
    """Remove a stock ticker from a watchlist."""
    auth_user = get_current_user_id(authorization) or user_id
    t_clean = ticker.upper().strip()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, user_id FROM watchlists WHERE id = ?", (watchlist_id,))
    wl = cursor.fetchone()
    if not wl:
        conn.close()
        raise HTTPException(status_code=404, detail="Watchlist not found")

    if wl["user_id"] and auth_user and wl["user_id"] != auth_user:
        conn.close()
        raise HTTPException(status_code=403, detail="Unauthorized to modify another user's watchlist")

    cursor.execute("DELETE FROM watchlist_items WHERE watchlist_id = ? AND ticker = ?", (watchlist_id, t_clean))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()

    if deleted == 0:
        raise HTTPException(status_code=404, detail="Ticker not found in watchlist")
    return {"success": True, "message": f"{t_clean} removed from watchlist"}


# Market Search, Catalog Browse & Autocomplete
@app.get("/api/market/browse")
def browse_stock_universe(
    sector: Optional[str] = None,
    query: Optional[str] = None,
    sort_by: str = "market_cap"  # 'market_cap', 'name', 'price'
):
    """
    Browse and filter all 150+ Indian stocks.
    Allows new users to discover stocks, filter by sector, and build custom watchlists.
    """
    all_stocks = market_graph.get_all_tickers()
    quotes = data_service.get_current_market_quotes()

    results = []
    for s in all_stocks:
        if s.get("node_type") == "ETF":
            continue

        q = quotes.get(s["ticker"], {})
        stock_obj = {
            "ticker": s["ticker"],
            "display_ticker": s["ticker"].replace(".NS", ""),
            "name": s.get("name", s["ticker"]),
            "sector": s.get("sector", "Other"),
            "industry": s.get("industry", ""),
            "market_cap": s.get("market_cap", 10000.0),
            "price": q.get("price", s.get("base_price", 1000.0)),
            "change_pct": q.get("change_pct", 0.0),
            "rvol": q.get("rvol", 1.0)
        }

        # Apply Filters
        if sector and sector.upper() != "ALL" and s.get("sector", "").upper() != sector.upper():
            continue

        if query:
            q_clean = query.upper().strip()
            if q_clean not in s["ticker"] and q_clean not in s.get("name", "").upper() and q_clean not in s.get("industry", "").upper():
                continue

        results.append(stock_obj)

    # Sort
    if sort_by == "market_cap":
        results.sort(key=lambda x: x["market_cap"], reverse=True)
    elif sort_by == "name":
        results.sort(key=lambda x: x["name"])
    elif sort_by == "price":
        results.sort(key=lambda x: x["price"], reverse=True)

    sectors = sorted(list(set(s.get("sector", "Other") for s in all_stocks if s.get("node_type") != "ETF")))

    return {
        "total": len(results),
        "sectors": sectors,
        "stocks": results
    }


@app.get("/api/market/search")
def search_tickers(q: str = Query("", min_length=1)):
    """Search for tickers in the ontology."""
    query = q.upper().strip()
    all_tickers = market_graph.get_all_tickers()
    matches = []
    for t in all_tickers:
        if query in t["ticker"] or query in t["name"].upper() or query in t.get("sector", "").upper():
            matches.append(t)
    return {"results": matches[:15]}


@app.get("/api/graph/macro")
def get_macro_knowledge_graph():
    """Retrieve the general macro knowledge graph for new users with 0 watchlists."""
    return market_graph.get_general_macro_graph()



# =======================================================
# Main Delta & Meaningful Change Analysis Engine
# Supports Logged-In User exact exit time & General Presets
# =======================================================

@app.get("/api/delta/analyze")
def analyze_watchlist_delta(
    watchlist_id: Optional[str] = None,
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    baseline_mode: str = "last_visit",  # "last_visit", "1h", "3h", "5h", "market_open", "yesterday", "custom"
    custom_timestamp: Optional[str] = None
):
    """
    Core Intelligence Engine:
    1. If logged-in user: Retrieves exact last exit timestamp and exact exit prices recorded in DB.
    2. If guest / new user: Provides general 1h, 3h, 5h, Market Open presets.
    3. Calculates exact cent-by-cent price deltas (zero hallucinations).
    4. Computes graph ripples and generates explainable, plain-English reasons.
    """
    auth_user = get_current_user_id(authorization) or user_id
    now = datetime.now(timezone.utc)
    conn = get_db_connection()
    cursor = conn.cursor()

    stored_user_exit_prices: Dict[str, float] = {}
    is_user_logged_in = False
    user_name = ""
    user_row = None

    if auth_user:
        cursor.execute("SELECT * FROM users WHERE id = ?", (auth_user,))
        user_row = cursor.fetchone()
        if user_row:
            is_user_logged_in = True
            user_name = user_row["name"]
            if user_row["last_exit_prices_json"]:
                try:
                    stored_user_exit_prices = json.loads(user_row["last_exit_prices_json"])
                except Exception:
                    stored_user_exit_prices = {}

    is_new_user = False
    if is_user_logged_in and user_row:
        if not user_row["last_logout_at"]:
            is_new_user = True

    # Determine baseline timestamp & label
    baseline_time_str = "your last visit"

    if baseline_mode == "1h":
        baseline_dt = now - timedelta(hours=1)
        baseline_time_str = "1 hour ago"
    elif baseline_mode == "3h":
        baseline_dt = now - timedelta(hours=3)
        baseline_time_str = "3 hours ago"
    elif baseline_mode == "5h":
        baseline_dt = now - timedelta(hours=5)
        baseline_time_str = "5 hours ago"
    elif baseline_mode == "market_open":
        baseline_dt = now - timedelta(hours=6, minutes=30)
        baseline_time_str = "Market Open (9:30 AM)"
    elif baseline_mode == "yesterday":
        baseline_dt = now - timedelta(days=1)
        baseline_time_str = "Yesterday's Market Close"
    elif baseline_mode == "custom" and custom_timestamp:
        try:
            baseline_dt = datetime.fromisoformat(custom_timestamp.replace("Z", "+00:00"))
            baseline_time_str = f"custom time ({baseline_dt.strftime('%H:%M:%S')})"
        except Exception:
            baseline_dt = now - timedelta(hours=2)
            baseline_time_str = "2 hours ago"
    else:
        # Default: Last user visit
        if is_user_logged_in and user_row and user_row["last_logout_at"]:
            try:
                baseline_dt = datetime.fromisoformat(user_row["last_logout_at"].replace("Z", "+00:00"))
                time_diff = now - baseline_dt
                mins = max(1, int(time_diff.total_seconds() / 60))
                if mins < 60:
                    baseline_time_str = f"{mins}m ago (when you closed the tab)"
                else:
                    baseline_time_str = f"{int(mins/60)}h {mins%60}m ago ({baseline_dt.strftime('%I:%M %p')})"
            except Exception:
                baseline_dt = now - timedelta(hours=2)
                baseline_time_str = "2 hours ago"
        elif is_new_user:
            baseline_dt = now - timedelta(hours=3)
            baseline_time_str = "Past 3 Hours (First Visit Overview)"
        else:
            # Guest default: 3 hours ago general summary
            baseline_dt = now - timedelta(hours=3)
            baseline_time_str = "3 hours ago"

    baseline_iso = baseline_dt.isoformat()

    # Get Watchlist Tickers with authorization check
    target_wl_id = watchlist_id
    if target_wl_id:
        # Check that watchlist is accessible to user (owned or system default)
        cursor.execute("SELECT id, user_id FROM watchlists WHERE id = ?", (target_wl_id,))
        wl_row = cursor.fetchone()
        if not wl_row or (wl_row["user_id"] and wl_row["user_id"] != auth_user):
            target_wl_id = None

    if target_wl_id:
        cursor.execute("SELECT ticker, notes FROM watchlist_items WHERE watchlist_id = ? ORDER BY order_index ASC", (target_wl_id,))
        rows = cursor.fetchall()
        watched_tickers = [r["ticker"] for r in rows]
    else:
        # Pick first accessible watchlist
        if auth_user:
            cursor.execute("SELECT id FROM watchlists WHERE user_id = ? OR user_id IS NULL ORDER BY is_default DESC, created_at ASC LIMIT 1", (auth_user,))
        else:
            cursor.execute("SELECT id FROM watchlists WHERE user_id IS NULL ORDER BY is_default DESC, created_at ASC LIMIT 1")
        first_wl = cursor.fetchone()
        if first_wl:
            cursor.execute("SELECT ticker, notes FROM watchlist_items WHERE watchlist_id = ?", (first_wl["id"],))
            watched_tickers = [r["ticker"] for r in cursor.fetchall()]
        else:
            watched_tickers = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "BHARTIARTL.NS", "TATAMOTORS.NS"]

    if not watched_tickers:
        watched_tickers = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "BHARTIARTL.NS", "TATAMOTORS.NS"]

    conn.close()

    # Retrieve current quotes and historical baseline snapshots
    current_quotes = data_service.get_current_market_quotes()
    baseline_snapshots = data_service.get_snapshot_at_time(baseline_iso)

    # Detect primary shock anomalies in the market
    primary_anomalies = []
    for ticker, quote in current_quotes.items():
        if abs(quote.get("change_pct", 0.0)) >= 2.5 or quote.get("rvol", 1.0) >= 2.0 or quote.get("catalyst_severity", 0.0) >= 0.6:
            primary_anomalies.append({
                "ticker": ticker,
                "change_pct": quote.get("change_pct", 0.0),
                "rvol": quote.get("rvol", 1.0),
                "reason": quote.get("news_event") or "Abnormal volume / price breakout"
            })

    # Propagate ripple shockwaves through the Knowledge Graph
    ripple_map = market_graph.calculate_ripple_effects(primary_anomalies, watched_tickers)

    # Evaluate each watched stock with EXACT cent-level arithmetic
    evaluated_items = []
    for ticker in watched_tickers:
        meta = market_graph.get_ticker_metadata(ticker) or {
            "name": ticker, "sector": "Other", "sector_etf": "NIFTYBEES.NS", "beta": 1.0
        }

        stock_curr = current_quotes.get(ticker, {
            "ticker": ticker, "price": 1000.0, "change_pct": 0.0, "volume": 1000000,
            "rvol": 1.0, "news_event": None, "catalyst_severity": 0.0,
            "name": meta.get("name", ticker), "sector": meta.get("sector", "Other"),
            "sector_etf": meta.get("sector_etf", "NIFTYBEES.NS"), "beta": meta.get("beta", 1.0)
        })
        stock_curr.update(meta)

        # Exact baseline price:
        # If logged-in user and baseline_mode is 'last_visit' and ticker in stored_user_exit_prices -> use exact exit price!
        if is_user_logged_in and not is_new_user and baseline_mode == "last_visit" and ticker in stored_user_exit_prices:
            stock_base = {"price": stored_user_exit_prices[ticker]}
        else:
            stock_base = baseline_snapshots.get(ticker)

        sector_etf = meta.get("sector_etf", "NIFTYBEES.NS")
        sec_curr = current_quotes.get(sector_etf, {"price": 265.0, "change_pct": 0.0})
        sec_base = baseline_snapshots.get(sector_etf)

        ripple_info = ripple_map.get(ticker)

        delta_res = delta_engine.calculate_stock_delta(
            current_data=stock_curr,
            baseline_data=stock_base,
            sector_current=sec_curr,
            sector_baseline=sec_base,
            ripple_info=ripple_info,
            time_elapsed_desc=baseline_time_str
        )

        delta_res["sparkline"] = data_service.get_sparkline_history(ticker, limit=12)
        evaluated_items.append(delta_res)

    evaluated_items.sort(key=lambda x: x["meaningful_change_score"], reverse=True)

    # Generate Plain-English Executive Briefing (supports rule-based + optional Gemini AI)
    briefing = delta_engine.generate_executive_briefing(evaluated_items, baseline_time_desc=baseline_time_str)

    # Attach personalized greeting if logged in
    if is_user_logged_in and user_name:
        if is_new_user:
            briefing["personalized_greeting"] = f"Welcome, {user_name}!"
            briefing["headline"] = f"First Visit Market Setup ({len([x for x in evaluated_items if x['meaningful_change_score'] >= 45])} notable shifts in past 3 hours)"
        else:
            briefing["personalized_greeting"] = f"Welcome back, {user_name}!"

    return {
        "is_user_logged_in": is_user_logged_in,
        "is_new_user": is_new_user,
        "user_name": user_name,
        "baseline_mode": baseline_mode,
        "baseline_timestamp": baseline_iso,
        "baseline_time_description": baseline_time_str,
        "current_timestamp": now.isoformat(),
        "briefing": briefing,
        "items": evaluated_items,
        "total_tracked": len(evaluated_items)
    }


# ==========================================
# Knowledge Graph & Market Events Endpoints
# ==========================================

@app.get("/api/graph/watchlist/{watchlist_id}")
def get_watchlist_knowledge_graph(watchlist_id: str):
    """Retrieve the interactive subgraph for a specific watchlist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT ticker FROM watchlist_items WHERE watchlist_id = ?", (watchlist_id,))
    tickers = [r["ticker"] for r in cursor.fetchall()]
    conn.close()

    if not tickers:
        tickers = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "BHARTIARTL.NS"]

    subgraph = market_graph.get_subgraph_for_watchlist(tickers, include_1hop_neighbors=True)

    quotes = data_service.get_current_market_quotes()
    for node in subgraph["nodes"]:
        q = quotes.get(node["id"])
        if q:
            node["price"] = q["price"]
            node["change_pct"] = q["change_pct"]
            node["rvol"] = q["rvol"]
            node["news"] = q.get("news_event")

    return subgraph


@app.get("/api/graph/ticker/{ticker}")
def get_ticker_deepdive(ticker: str):
    """Deep dive into a single stock's supply chain, competitors, and ripple exposure."""
    t_clean = ticker.upper().strip()
    neighborhood = market_graph.get_ticker_neighborhood(t_clean)
    sparkline = data_service.get_sparkline_history(t_clean, limit=20)
    quotes = data_service.get_current_market_quotes()
    quote = quotes.get(t_clean, {})

    return {
        **neighborhood,
        "quote": quote,
        "sparkline": sparkline
    }


@app.get("/api/market/events")
def get_market_events():
    """Retrieve breaking market-wide catalysts, earnings, and ripple triggers."""
    events = data_service.get_market_events(limit=25)
    return {"events": events}


@app.get("/api/market/top-movers")
def get_market_top_movers(limit: int = 6):
    """Retrieve top market-wide movers and anomalies across all 150+ stocks."""
    movers = data_service.get_market_wide_top_movers(limit=limit)
    return {"movers": movers}



@app.post("/api/checkpoints/save")
def save_user_checkpoint(req: SaveCheckpointRequest):
    """Record the current moment as a user checkpoint."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cp_id = f"cp-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    quotes = data_service.get_current_market_quotes()
    prices = {k: v["price"] for k, v in quotes.items()}

    cursor.execute("""
    INSERT INTO user_checkpoints (id, user_id, checkpoint_name, timestamp, prices_json, notes)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (cp_id, req.user_id, req.checkpoint_name, now_iso, json.dumps(prices), req.notes))

    rows_updated = 0
    if req.user_id:
        cursor.execute("""
        UPDATE users SET last_logout_at = ?, last_exit_prices_json = ? WHERE id = ?
        """, (now_iso, json.dumps(prices), req.user_id))
        rows_updated = cursor.rowcount

    conn.commit()
    conn.close()
    return {"id": cp_id, "timestamp": now_iso, "rows_updated": rows_updated, "message": "Visit checkpoint saved successfully"}


@app.post("/api/simulation/inject-shock")
def inject_market_shock(req: InjectShockRequest):
    """Inject a live market shock to demonstrate graph ripples and delta re-scoring."""
    result = data_service.inject_synthetic_shock(req.shock_type)
    return result


# ==========================================
# Live SQLite Database Inspector Endpoints
# ==========================================

@app.get("/api/db/tables")
def get_db_tables():
    """List all SQLite database tables with their row counts."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
    tables = [r["name"] for r in cursor.fetchall()]

    table_summaries = []
    for t in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {t}")
        cnt = cursor.fetchone()[0]
        table_summaries.append({"name": t, "row_count": cnt})

    conn.close()
    return {"tables": table_summaries}


@app.get("/api/db/table/{table_name}")
def get_db_table_data(table_name: str, limit: int = 50):
    """Retrieve column schema and live rows from any SQLite table."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Validate table name to prevent SQL injection
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", (table_name,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Table not found")

    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [col["name"] for col in cursor.fetchall()]

    cursor.execute(f"SELECT * FROM {table_name} LIMIT ?", (limit,))
    rows = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return {
        "table": table_name,
        "columns": columns,
        "rows": rows,
        "count": len(rows)
    }

