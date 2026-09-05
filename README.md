# 🌐 Nexus Market Graph: Smart Relational Watchlist Terminal

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![NetworkX](https://img.shields.io/badge/NetworkX-3.2-blue.svg?style=flat)](https://networkx.org)
[![SQLite WAL](https://img.shields.io/badge/SQLite-WAL_Mode-003B57.svg?style=flat&logo=sqlite)](https://sqlite.org)
[![Pytest](https://img.shields.io/badge/Pytest-11%2F11%20Passing-success.svg?style=flat&logo=pytest)](https://pytest.org)
[![Market](https://img.shields.io/badge/Market-NSE%20%2F%20BSE%20India%20(%E2%82%B9)-FF9933.svg?style=flat)](https://www.nseindia.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Submission for the Advanced Coding Hackathon**  
> *"Build a Smart Market Watchlist that helps users not just track stocks, but quickly understand what has **meaningfully changed** since they last checked, and what deserves their attention now."*

---

## 📑 Table of Contents

- [Executive Overview](#-executive-overview)
- [The Core Problem & Philosophy](#-the-core-problem--philosophy)
- [Hackathon Rubric: The 6 Judgment Calls](#-hackathon-rubric-the-6-judgment-calls)
- [Key Architectural Innovations](#-key-architectural-innovations)
  - [1. Meaningful Change Score (MCS) Math](#1-multi-factor-meaningful-change-score-mcs-0100)
  - [2. Relational Knowledge Graph & Contagion](#2-relational-market-knowledge-graph--shockwave-contagion)
  - [3. Zero-Hallucination Session Persistence (`sendBeacon`)](#3-zero-hallucination-session-persistence-via-w3c-beacon-api)
  - [4. Resilient 3-Tier Data Pipeline & Staleness Monitor](#4-resilient-3-tier-data-pipeline--staleness-monitor)
  - [5. Multi-User Workspace Isolation](#5-multi-user-workspace-isolation--tamper-proof-benchmarks)
- [System Architecture](#-system-architecture)
- [Indian Equities Universe](#-indian-equities-universe--graph-topology)
- [Interactive Presentation Deck](#-interactive-presentation-deck)
- [Quickstart & Installation](#-quickstart--installation)
- [API Reference](#-api-reference)
- [Automated Test Suite](#-automated-test-suite)
- [Production Scaling Roadmap](#-production-scaling-roadmap)

---

## ⚡ Executive Overview

Traditional stock watchlists (Apple Stocks, TradingView, Yahoo Finance) present flat, isolated tickers sorted alphabetically with simple 24-hour red and green percentage changes.

**Nexus Market Graph** re-engineers the market watchlist from first principles:
1. **Separates Alpha from Noise**: Evaluates price movements against sector benchmarks and historical volatility using a formal **Meaningful Change Score (MCS: 0–100)**.
2. **Models Supply Chains & Corporate Ecosystems**: Uses a **NetworkX directed knowledge graph** to calculate 2nd-order shockwave ripples across suppliers, clients, and competitors in Indian industry (Tata Group, Reliance, Adani, Zomato vs. Swiggy).
3. **True Session-to-Session Intelligence**: Uses the browser's native **W3C Beacon API (`navigator.sendBeacon`)** to capture exact exit prices into an indexed SQLite store. When users return, Nexus instantly delivers an automated **Executive Catch-Up Briefing** explaining what shifted *while they were away*.
4. **Radical Data Transparency**: Displays a live freshness counter (`"Updated 4s ago"`), enforces a 3-tier fallback pipeline (Live NSE $\rightarrow$ 30s TTL Cache $\rightarrow$ Micro-Drift Simulator), and provides an interactive **Data Pipeline Diagnostics Inspector**.

---

## 🎯 The Core Problem & Philosophy

| The Flawed Status Quo | Why It Breaks | How Nexus Market Graph Solves It |
|---|---|---|
| **1. The "Red/Green Noise Trap"** | A +2.0% jump on a high-beta quick-commerce stock is ordinary noise, while a +2.0% jump on a defensive FMCG giant while its sector is down -1.5% is a massive institutional signal. Flat lists treat them identically. | **Mathematical MCS Engine**: Calculates Idiosyncratic Sector Divergence ($|\Delta P_{\text{stock}} - \Delta P_{\text{sector}}|$), abnormal relative volume (RVOL), and dynamic volatility Z-scores. Routine noise is filtered automatically. |
| **2. The Missing Temporal Baseline** | Calendar-day percentage change (% from 9:15 AM open) is irrelevant if an investor checks their watchlist at 2:00 PM after a 2-hour meeting. They need to know what moved *during their absence*. | **W3C `sendBeacon` Exit Checkpointing**: Automatically commits user exit prices to SQLite WAL on tab close. On return, deltas are computed from verified database records with an interactive Time-Machine Scrubber. |
| **3. Isolated Ticker Silos** | Stocks do not exist in vacuums. When Tata Motors wins an EV contract, traditional tools fail to show that Tata Power (EV chargers) will surge, while Maruti Suzuki faces market share pressure. | **NetworkX Directed Knowledge Graph**: Models supplier dependencies, joint ventures, and duopolies with hop-decay contagion algorithms. Generates plain-English narrative briefings with zero hallucination. |

---

## 🏆 Hackathon Rubric: The 6 Judgment Calls

The hackathon prompt explicitly challenged teams to make 6 core architectural decisions. Here is our engineered defense:

### 1. What counts as a "meaningful change"?
* **Decision**: We rejected simplistic percentage thresholds (e.g. `> 3%`). A move is only meaningful if it deviates from broad market beta and exhibits institutional conviction.
* **Implementation**: We formulated the **Meaningful Change Score (MCS, 0–100)**:
  * **Sector Divergence (40% weight)**: Strips out macro drift using sector benchmarks (Nifty Auto, Nifty IT, Nifty Bank, Nifty FMCG).
  * **Relative Volume Multiplier (25% weight)**: Detects institutional block accumulation ($\text{RVOL} \ge 2.0\times$).
  * **Volatility Z-Score (20% weight)**: Normalizes move size against 30-day historical standard deviation and beta.
  * **Graph Ripple Contagion (15% weight)**: Incorporates 2nd-order momentum from direct upstream and downstream partners.
* **Output Tiers**: `0–44`: Routine Noise (Muted) • `45–69`: Notable Move • `70–100`: **Critical Anomaly (Urgent Attention)**.

### 2. What information to surface?
* **Decision**: Prevent cognitive fatigue through a strict **4-Tier Cognitive Hierarchy**:
  1. **Executive Catch-Up Headline**: Summarizes the entire watchlist's state in one punchy sentence (e.g., *"3 meaningful shifts since your last visit 2 hours ago"*).
  2. **Direct Drivers**: Why did it move? Earnings catalysts, regulatory orders, or commodity shifts.
  3. **Relational Ripple Impact**: Cascading effects on upstream suppliers and downstream customers.
  4. **Actionable Takeaway**: Specific portfolio risk implications.

### 3. How state persists across sessions/devices?
* **Decision**: Standard `window.fetch()` or `axios` calls fail when a user closes a laptop lid or kills a mobile browser tab.
* **Implementation**: We implemented the **W3C Beacon API (`navigator.sendBeacon`)** which transfers the exit payload directly to the operating system's background network process. Exact prices and timestamps are written to SQLite in WAL mode (`PRAGMA journal_mode=WAL`). On return, the user's Bearer token authenticates against `/api/session/return` to calculate verified mathematical deltas.

### 4. How to handle stale, delayed, or conflicting data?
* **Decision**: Financial applications must be radically honest about data provenance.
* **Implementation**:
  * **30-Second In-Memory TTL Cache**: Bounds upstream API latency and eliminates rate-limiting.
  * **Live Staleness Counter**: Displays ticking seconds (`"Updated 4s ago"`). If feed age exceeds 180 seconds, the UI automatically flags it with an amber `[Delayed Feed]` badge.
  * **Realistic Micro-Drift Fallback**: When markets are closed or offline, a deterministic drift engine engages so the system remains fully interactive with an explicit `[SIMULATED_REPLAY]` badge.
  * **Interactive Diagnostics Modal**: A single click on the header badge opens complete cache, latency, and ticker health statistics.

### 5. How the system scales for larger watchlists and more users?
* **Decision**: Decouple hot-path client reads from backend ingestion.
* **Implementation**:
  * **Pre-computed Ego Graphs**: NetworkX pre-computes 1-hop and 2-hop subgraphs into memory, providing $O(1)$ lookups without traversing the full 150-node graph on every request.
  * **Compound Database Indexing**: SQLite table `snapshots` uses a composite B-Tree index `idx_snapshots_ticker_time(ticker, timestamp)` for logarithmic $O(\log N)$ historical range scans.
  * **Production Path**: Clean interface boundaries allow seamless migration to PostgreSQL + TimescaleDB and Redis Pub/Sub for WebSockets.

### 6. Where to keep things simple vs. add complexity?
* **Decision**: Add complexity where it produces algorithmic alpha; keep it simple where simplicity improves reliability.
  * **Where we added complexity (High ROI)**: NetworkX graph contagion propagation, mathematical sector divergence, and W3C beacon persistence.
  * **Where we kept things simple (Low Risk, Zero Hallucination)**: Native `asyncio` task loop instead of heavy distributed Celery/RabbitMQ clusters; deterministic rule-based narrative engine for sub-5ms response times, with optional Gemini 1.5 Flash enrichment.

---

## 🔬 Key Architectural Innovations

### 1. Multi-Factor Meaningful Change Score (MCS: 0–100)

$$\mathbf{MCS} = \min\left(100, \; w_1 \cdot S_{\text{divergence}} + w_2 \cdot S_{\text{rvol}} + w_3 \cdot S_{\text{zscore}} + w_4 \cdot S_{\text{ripple}}\right)$$

```python
# Core Algorithm (backend/insight_service.py)
s_divergence = min(25.0, (abs(delta_pct - sector_delta_pct) / 2.0) * 25.0)
s_rvol = min(25.0, (rvol / 2.5) * 25.0)
s_zscore = min(25.0, (abs(delta_pct) / (volatility_30d * beta * 1.5)) * 25.0)
s_ripple = min(25.0, ripple_score * 2.5)

mcs_raw = s_divergence * 0.40 + s_rvol * 0.25 + s_zscore * 0.20 + s_ripple * 0.15
mcs = round(min(100.0, max(0.0, mcs_raw * (100.0 / 25.0))), 1)
```

---

### 2. Relational Market Knowledge Graph & Shockwave Contagion

The Indian market is modeled as a directed graph $\mathcal{G} = (\mathcal{V}, \mathcal{E})$, where vertices $\mathcal{V}$ are equities/indices and edges $\mathcal{E}$ represent corporate relationships:

$$\text{Contagion}(v_{\text{target}}) = \sum_{e = (u, v) \in \mathcal{E}} \Delta P_u \times \text{Weight}_e \times \lambda^{\text{hop}}$$

* **Relationship Types**:
  * `[SUPPLIER_TO]` / `[CUSTOMER_OF]` (Positive correlation, weight $+0.75$ to $+0.90$)
  * `[COMPETITOR_OF]` / `[RIVAL]` (Negative / divergent correlation, weight $-0.60$ to $-0.75$)
  * `[SUBSIDIARY_OF]` / `[CONGLOMERATE_PEER]` (Sympathetic momentum, weight $+0.65$ to $+0.85$)
  * `[JOINT_VENTURE]` (Co-dependent momentum, weight $+0.70$)

---

### 3. Zero-Hallucination Session Persistence via W3C Beacon API

```javascript
// Dispatched on tab unload/hide to the OS network daemon
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && currentUserRef.current) {
    const payload = JSON.stringify({
      user_id: currentUserRef.current.id,
      active_watchlist: currentWatchlistId,
      timestamp: Date.now()
    });
    navigator.sendBeacon('/api/session/leave', payload);
  }
});
```

---

### 4. Resilient 3-Tier Data Pipeline & Staleness Monitor

```
┌─────────────────────────────────────────────────────────┐
│              Tier 1: Live Yahoo Finance NSE             │
│        Asynchronous background poller fetching .NS       │
└───────────────────────────┬─────────────────────────────┘
                            │ On Rate-Limit or Network Lag
┌───────────────────────────▼─────────────────────────────┐
│          Tier 2: In-Memory 30s TTL Cache + SQLite       │
│        Serves timestamped snapshot with freshness age   │
└───────────────────────────┬─────────────────────────────┘
                            │ On Market Close / Weekend
┌───────────────────────────▼─────────────────────────────┐
│        Tier 3: Realistic Geometric Micro-Drift          │
│  Continuous volatility replay with [SIMULATED] badge   │
└─────────────────────────────────────────────────────────┘
```

---

### 5. Multi-User Workspace Isolation & Tamper-Proof Benchmarks

* **User Privacy**: Each user session generates a unique bearer token. Custom watchlists and checkpoints are strictly isolated by foreign key constraints.
* **Tamper-Proof Benchmarks**: System default watchlists (`Nifty 50 Titans`, `Tata EV Mobility`, `Indian Tech Duopolies`) are protected. Any attempt to delete or alter them returns an explicit `403 Forbidden` response.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REACT 19 + VITE FRONTEND                          │
│  ┌──────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐ │
│  │ Catch-Up Delta   │  │ Interactive D3 Force  │  │ Attention-Sorted      │ │
│  │ Executive Brief  │  │ Knowledge Graph View  │  │ Watchlist & Sparklines│ │
│  └──────────────────┘  └───────────────────────┘  └───────────────────────┘ │
│  ┌──────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐ │
│  │ Time-Machine     │  │ Staleness Diagnostics │  │ Market Shock          │ │
│  │ Slider (15m-24h) │  │ Inspector Modal       │  │ Scenario Simulator    │ │
│  └──────────────────┘  └───────────────────────┘  └───────────────────────┘ │
└───────────────────────┬──────────────────────────────────┬──────────────────┘
                        │ HTTP / Bearer Auth               │ W3C sendBeacon
┌───────────────────────▼──────────────────────────────────▼──────────────────┐
│                         FASTAPI ASYNCHRONOUS BACKEND                        │
│  ┌─────────────────────────┐  ┌───────────────────────┐  ┌────────────────┐ │
│  │ Knowledge Graph Engine  │  │ Temporal Delta &      │  │ Resilient Data │ │
│  │ (NetworkX Graph Model)  │  │ Attention Index (MCS) │  │ Ingestion & Sim│ │
│  └─────────────────────────┘  └───────────────────────┘  └────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Native asyncio Ingestion Scheduler (30s TTL Cache, NSE Quotes)         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────┐  ┌───────────────────────────────────────────┐ │
│  │ Rule-Based Synthesis    │  │ Optional Google Gemini 1.5 Flash          │ │
│  │ (Deterministic, <5ms)   │  │ Narrative Catalyst Enrichment             │ │
│  └─────────────────────────┘  └───────────────────────────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Indexed SQL
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    SQLITE WAL-MODE / PRODUCTION POSTGRES                    │
│  • Compound Index: idx_snapshots_ticker_time(ticker, timestamp)             │
│  • Tables: users, watchlists, watchlist_items, snapshots, checkpoints,      │
│            user_settings                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🇮🇳 Indian Equities Universe & Graph Topology

| Sector / Ecosystem | Core Equities | Relational Dynamics Modeled |
|---|---|---|
| **Tata Ecosystem** | `TATAMOTORS.NS`, `TATAPOWER.NS`, `TCS.NS`, `TATASTEEL.NS` | EV fleet orders propagate driveline demand to Tata Power and steel demand to Tata Steel. |
| **Quick Commerce & Tech** | `ZOMATO.NS`, `SWIGGY.NS` | Direct duopoly rivalry. Market share gains in quick commerce cause inverse competitive pressure. |
| **IT Services Giants** | `TCS.NS`, `INFY.NS`, `WIPRO.NS` | Global tech spending catalysts propagate across peers with currency delta sensitivities. |
| **Energy & Conglomerate** | `RELIANCE.NS`, `ADANIENT.NS` | Macro refining margins, telecom tariff hikes, and infrastructure capital allocation. |
| **Automotive Peers** | `TATAMOTORS.NS`, `MARUTI.NS`, `M&M.NS` | EV market share displacement and raw material commodity shockwaves. |

---

## 🖥️ Interactive Presentation Deck

A self-contained, interactive presentation deck is built right into the repository:

* **Presentation File**: `presentation.html`
* **Features**:
  * 10 beautifully styled dark-theme slides matching the hackathon rubric.
  * Keyboard navigation (`→` / `Space` for next slide, `←` for previous slide).
  * Fullscreen mode (`F`).
  * **Verbatim Speaker Notes Drawer (`N`)**: Displays word-for-word pitch scripts for each slide.
* **To View**: Simply double-click `presentation.html` in your file explorer or open it in Google Chrome / Safari!
* **Markdown Slide Plan**: See [`presentation_deck.md`](presentation_deck.md).

---

## 🚀 Quickstart & Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 18.0 or higher & npm

### 1. Clone & Set Up Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000`.  
Interactive Swagger docs are available at `http://localhost:8000/docs`.

### 2. Set Up & Run Frontend
```bash
cd frontend
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Automated Tests
```bash
python3 -m pytest backend/tests/ -v
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck, uptime, active ticker count, and pipeline status. |
| `POST` | `/api/auth/session` | Sign in or initialize user workspace session; returns Bearer token. |
| `GET` | `/api/watchlists` | Get all watchlists accessible to current user (including defaults). |
| `POST` | `/api/watchlists` | Create a new private custom watchlist. |
| `DELETE`| `/api/watchlists/{id}` | Delete custom watchlist (returns `403` if system default). |
| `POST` | `/api/watchlists/{id}/items` | Add stock ticker to watchlist. |
| `DELETE`| `/api/watchlists/{id}/items/{ticker}` | Remove ticker from watchlist. |
| `GET` | `/api/market/graph` | Fetch NetworkX nodes and directed edges with ripple weights. |
| `POST` | `/api/session/leave` | W3C `sendBeacon` endpoint to record atomic exit snapshot. |
| `GET` | `/api/session/return` | Diffs current prices against exit snapshot; generates Catch-Up Brief. |
| `POST` | `/api/shock` | Simulates macro or corporate shock and propagates ripple contagion. |
| `GET` | `/api/settings` | Get user preferences and Gemini API configuration. |
| `POST` | `/api/settings` | Update user preferences and Gemini API key. |

---

## 🧪 Automated Test Suite

The backend includes a comprehensive `pytest` test suite verifying all mathematical models, user isolation, and security guards:

```bash
$ python3 -m pytest backend/tests/ -v
============================== test session starts ==============================
backend/tests/test_engine.py::test_health_endpoint PASSED                 [  9%]
backend/tests/test_engine.py::test_auth_and_session_leave_snapshot_inr PASSED  [ 18%]
backend/tests/test_engine.py::test_indian_graph_ripple_propagation PASSED  [ 27%]
backend/tests/test_engine.py::test_meaningful_change_score_calculation PASSED  [ 36%]
backend/tests/test_engine.py::test_guest_general_summaries PASSED         [ 45%]
backend/tests/test_engine.py::test_add_long_nse_ticker_to_watchlist PASSED  [ 54%]
backend/tests/test_engine.py::test_user_isolation_and_auth_tokens PASSED  [ 63%]
backend/tests/test_engine.py::test_protected_default_watchlists PASSED    [ 72%]
backend/tests/test_engine.py::test_settings_persistence PASSED            [ 81%]
backend/tests/test_engine.py::test_swiggy_and_zomato_graph_edge PASSED    [ 90%]
backend/tests/test_engine.py::test_indian_fallback_tickers PASSED         [100%]

============================== 11 passed in 1.01s ==============================
```

---

## 🗺️ Production Scaling Roadmap

```
Phase 1 (Completed)      Phase 2 (Next 60 Days)       Phase 3 (Enterprise)
───────────────────      ──────────────────────       ────────────────────
• SQLite WAL mode        • PostgreSQL + TimescaleDB   • Kafka event streaming
• In-memory 30s TTL      • Redis Pub/Sub WebSockets   • Zero-latency FIX protocol
• NetworkX directed graph• Zerodha Kite Connect API   • Neo4j distributed graph
• W3C Beacon persistence • Multi-device push alerts   • Real-time institutional order flow
```

---

## 👥 Team & Acknowledgments

* **Lead Architect & Developer**: Aditi Shankar
* **Built For**: Advanced Coding Hackathon — "Build a Smart Market Watchlist"
* **License**: MIT Open Source

*"Don't build the obvious watchlist. Build the version you believe should exist."*
