# Nexus Market Graph: Smart Relational Market Watchlist

> **Built for the Advanced Coding Hackathon**  
> An intelligent, graph-augmented market watchlist terminal that surfaces **meaningful market changes**, explains **why they happened** (using supply-chain and sector knowledge graphs), and highlights **what deserves your attention since you last checked**.

---

## 🎯 The Core Problem & Philosophy

Traditional stock watchlists (Apple Stocks, Yahoo Finance, TradingView) present isolated tickers with red/green percentage changes sorted alphabetically. This fails in three fundamental ways:
1. **The "Red/Green Noise Trap"**: A 1.5% drop on a steady dividend utility is a massive anomaly, while a 2% drop on a high-beta crypto stock is everyday noise. Flat watchlists treat them identically.
2. **Absence of Temporal Baseline ("Since I Last Looked")**: Users check their watchlist after 2 hours or 2 days and have no way of knowing what moved *while they were away* vs. what was already priced in.
3. **Isolated Silos (No Relational Context)**: Stocks do not move in isolation. When TSMC faces a wafer packaging constraint in Taiwan, retail investors don't realize why AMD, Nvidia, and Apple are dropping hours later.

### Our Solution:
* **Relational Market Knowledge Graph**: Models supply chains, competitive peers, and macro factors as a directed graph to calculate **2nd-order shockwave contagion**.
* **Temporal Delta Engine & Time-Machine Slider**: Computes exact state diffs between any two points in time ($T_{\text{baseline}} \rightarrow T_{\text{now}}$) with an automated **Catch-Up Executive Briefing**.
* **Multi-Factor Meaningful Change Score (MCS: 0–100)**: Combines dynamic Volatility Z-scores, Sector Divergence, Abnormal RVOL, and Graph Ripple into an Attention Index.

---

## 🏆 Alignment with Hackathon Judging Rubric

| Rubric Dimension | How Nexus Graph Excels |
| :--- | :--- |
| **1. Engineering Depth** | • **Knowledge Graph Engine**: NetworkX directed graph modeling upstream suppliers, downstream customers, and competitor clusters with ripple decay algorithms.<br>• **Statistical Math**: Dynamic Z-score volatility estimation, Relative Volume (RVOL) multiplier, Sector ETF divergence tracking.<br>• **Persistent SQLite Store**: High-performance SQLite database in WAL mode storing watchlists, snapshots, and visit checkpoints. |
| **2. Product & Problem Interpretation** | • **Executive Catch-Up Briefing**: Automated 30-second bulleted summary generated on return visits.<br>• **Time-Machine Scrubber**: Interactive timeline slider allowing users and judges to test delta computations across 15m, 1h, 4h, Market Open, or Yesterday Close.<br>• **Attention Ranking**: Watchlists sorted by Meaningful Change Score rather than alphabetical order. |
| **3. Edge Cases & Resilience** | • **3-Tier Data Fallback Pipeline**: Live yfinance ingestion $\rightarrow$ TTL-cached local store $\rightarrow$ Deterministic Geometric Brownian Motion tick simulator so the app **never crashes or renders blank screens** offline or when markets are closed.<br>• **Data Health Badges**: Explicit freshness indicator (`LIVE`, `DELAYED`, `SIMULATED_REPLAY`). |
| **4. Code Quality & Simplicity** | • Clean, layered architecture (`/backend` FastAPI + `/frontend` React/Vite/Tailwind).<br>• Automated test suite (`pytest backend/tests/`) verifying graph propagation and delta math.<br>• Zero bloated unnecessary microservices or heavy database clusters. |
| **5. Originality & Thoughtfulness** | • **Interactive D3 Force-Directed Network**: Nodes pulse and shockwave links light up to visually show contagion flow.<br>• **Interactive Market Shock Simulator**: Click-to-inject scenarios (TSMC fab outage, Nvidia earnings beat, Fed rate shock) to watch the graph and watchlist react live! |

---

## 🏗️ System Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REACT 19 + VITE FRONTEND                          │
│  ┌──────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐ │
│  │ Catch-Up Delta   │  │ Interactive D3 Force  │  │ Attention-Sorted      │ │
│  │ Executive Brief  │  │ Knowledge Graph View  │  │ Watchlist & Sparklines│ │
│  └──────────────────┘  └───────────────────────┘  └───────────────────────┘ │
│  ┌──────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐ │
│  │ Time-Travel Scrubber│ Stock Ripple Inspector │ Market Shock Simulator│ │
│  └──────────────────┘  └───────────────────────┘  └───────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (JSON)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                           FASTAPI PYTHON BACKEND                            │
│  ┌─────────────────────────┐  ┌───────────────────────┐  ┌────────────────┐ │
│  │ Market Graph Engine     │  │ Temporal Delta &      │  │ Resilient Data │ │
│  │ (NetworkX Graph Model)  │  │ Attention Index (MCS) │  │ Ingestion & Sim│ │
│  └─────────────────────────┘  └───────────────────────┘  └────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ SQLite Database (Watchlists, Tickers, Historical Snapshots, Checkpoints)│ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Setup Guide

### 1. Start the Backend API
```bash
cd backend
python3 -m pip install -r requirements.txt # (fastapi, uvicorn, networkx, pandas, pytest)
uvicorn main:app --reload --port 8000
```
Backend API will be live at `http://localhost:8000`. Test docs available at `http://localhost:8000/docs`.

### 2. Run the Backend Test Suite
```bash
python3 -m pytest backend/tests/
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📊 Meaningful Change Score (MCS) Formula

$$\text{MCS} = \min\left(100, S_{\text{volatility}} + S_{\text{divergence}} + S_{\text{volume}} + S_{\text{catalyst}} + S_{\text{ripple}}\right)$$

Where:
1. **$S_{\text{volatility}}$ (0–25 pts)**: Dynamic Volatility Deviation $Z = \frac{|\Delta P|}{\sigma_{30D} \cdot \beta}$
2. **$S_{\text{divergence}}$ (0–25 pts)**: Idiosyncratic Sector Divergence $|\Delta P_{\text{stock}} - \Delta P_{\text{sector\_etf}}|$
3. **$S_{\text{volume}}$ (0–20 pts)**: Relative Volume Multiplier ($\text{RVOL} \ge 2.0x$)
4. **$S_{\text{catalyst}}$ (0–15 pts)**: Breaking earnings, filings, and analyst revisions
5. **$S_{\text{ripple}}$ (0–15 pts)**: 2nd-order contagion score from upstream suppliers / peers
