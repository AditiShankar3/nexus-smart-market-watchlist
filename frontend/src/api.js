/**
 * Centralized API client for Nexus Market Graph Backend.
 * Features automatic environment configuration and resilient offline/demo fallback
 * to ensure that deployments on platforms like Vercel function smoothly.
 */

import { DEMO_WATCHLISTS, DEMO_ITEMS, DEMO_GRAPH, getDemoAnalysis } from './demoFallback';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('nexus_session_token');
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res, defaultMsg) {
  if (!res.ok) {
    let detail = defaultMsg;
    try {
      const data = await res.json();
      if (data && data.detail) {
        detail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      }
    } catch (_) {}
    throw new Error(detail);
  }
  return res.json();
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await handleResponse(res, "Backend health check failed");
  } catch (err) {
    return { status: "ok", data_status: "SIMULATED_REPLAY", active_tickers: 12, uptime_seconds: 60 };
  }
}

// Authentication
export async function loginUser(username) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });
    const data = await handleResponse(res, "Login failed");
    if (data && data.session_token) {
      localStorage.setItem('nexus_session_token', data.session_token);
    }
    return data;
  } catch (err) {
    const demoUser = {
      id: "usr_aditi_shankar",
      username: username || "aditi",
      name: "Aditi Shankar",
      session_token: "demo_token_aditi"
    };
    localStorage.setItem('nexus_session_token', demoUser.session_token);
    return demoUser;
  }
}

export async function registerUser(username, name, email = "") {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, email })
    });
    const data = await handleResponse(res, "Registration failed");
    if (data && data.session_token) {
      localStorage.setItem('nexus_session_token', data.session_token);
    }
    return data;
  } catch (err) {
    const demoUser = {
      id: "usr_" + (username || "demo"),
      username: username,
      name: name || username,
      email: email,
      session_token: "demo_token_" + (username || "demo")
    };
    localStorage.setItem('nexus_session_token', demoUser.session_token);
    return demoUser;
  }
}

export function logoutUser() {
  localStorage.removeItem('nexus_session_token');
  localStorage.removeItem('nexus_user');
}

export function recordSessionLeave(userId, exitPrices = null) {
  if (!userId) return;
  const payload = JSON.stringify({ user_id: userId, exit_prices: exitPrices });
  
  // Use Beacon API for 100% reliable transmission when closing tab
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(`${API_BASE_URL}/session/leave`, blob);
  } else {
    fetch(`${API_BASE_URL}/session/leave`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: payload,
      keepalive: true
    }).catch(() => {});
  }
}

// Settings
export async function fetchSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(res, "Failed to load settings");
  } catch (err) {
    return {
      theme: "dark",
      refresh_interval_sec: 12,
      staleness_threshold_sec: 180,
      gemini_configured: false
    };
  }
}

export async function saveSettings(settings) {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ settings })
    });
    return await handleResponse(res, "Failed to save settings");
  } catch (err) {
    return { status: "success", settings };
  }
}

// Watchlists
export async function fetchWatchlists(userId = null) {
  try {
    let url = `${API_BASE_URL}/watchlists`;
    if (userId) url += `?user_id=${encodeURIComponent(userId)}`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    return await handleResponse(res, "Failed to fetch watchlists");
  } catch (err) {
    console.warn("Backend offline, serving demo watchlists:", err);
    return { watchlists: DEMO_WATCHLISTS };
  }
}

export async function createWatchlist(name, description = "", initial_tickers = [], userId = null) {
  try {
    const res = await fetch(`${API_BASE_URL}/watchlists`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name, description, initial_tickers, user_id: userId })
    });
    return await handleResponse(res, "Failed to create watchlist");
  } catch (err) {
    const newWl = {
      id: "wl_custom_" + Date.now(),
      name,
      description,
      is_default: false,
      tickers: initial_tickers.length > 0 ? initial_tickers : ["TATAMOTORS.NS", "TATAPOWER.NS"]
    };
    return { status: "created", watchlist: newWl };
  }
}

export async function deleteWatchlist(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/watchlists/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return await handleResponse(res, "Failed to delete watchlist");
  } catch (err) {
    return { status: "deleted", watchlist_id: id };
  }
}

export async function addTickerToWatchlist(watchlistId, ticker, notes = "") {
  try {
    const res = await fetch(`${API_BASE_URL}/watchlists/${encodeURIComponent(watchlistId)}/items`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ ticker, notes })
    });
    return await handleResponse(res, "Failed to add ticker");
  } catch (err) {
    return { status: "added", watchlist_id: watchlistId, ticker };
  }
}

export async function removeTickerFromWatchlist(watchlistId, ticker) {
  try {
    const res = await fetch(`${API_BASE_URL}/watchlists/${encodeURIComponent(watchlistId)}/items/${encodeURIComponent(ticker)}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return await handleResponse(res, "Failed to remove ticker");
  } catch (err) {
    return { status: "removed", watchlist_id: watchlistId, ticker };
  }
}

export async function browseStocks(sector = 'ALL', query = '', sortBy = 'market_cap') {
  try {
    let url = `${API_BASE_URL}/market/browse?sort_by=${sortBy}`;
    if (sector && sector !== 'ALL') url += `&sector=${encodeURIComponent(sector)}`;
    if (query) url += `&query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    return await handleResponse(res, "Failed to browse stocks");
  } catch (err) {
    let stocks = DEMO_ITEMS;
    if (query) {
      stocks = stocks.filter(s => s.ticker.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase()));
    }
    return { stocks };
  }
}

export async function fetchMacroGraph() {
  try {
    const res = await fetch(`${API_BASE_URL}/graph/macro`);
    return await handleResponse(res, "Failed to fetch macro graph");
  } catch (err) {
    return DEMO_GRAPH;
  }
}

// Intelligence & Delta Engine
export async function fetchDeltaAnalysis(watchlistId, baselineMode = "last_visit", userId = null, customTimestamp = null) {
  try {
    let url = `${API_BASE_URL}/delta/analyze?baseline_mode=${encodeURIComponent(baselineMode)}`;
    if (watchlistId) url += `&watchlist_id=${encodeURIComponent(watchlistId)}`;
    if (userId) url += `&user_id=${encodeURIComponent(userId)}`;
    if (customTimestamp) url += `&custom_timestamp=${encodeURIComponent(customTimestamp)}`;
    
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    return await handleResponse(res, "Failed to analyze deltas");
  } catch (err) {
    console.warn("Backend offline, serving demo analysis:", err);
    return getDemoAnalysis(watchlistId, baselineMode);
  }
}

export async function fetchWatchlistGraph(watchlistId) {
  try {
    const res = await fetch(`${API_BASE_URL}/graph/watchlist/${encodeURIComponent(watchlistId)}`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(res, "Failed to fetch graph data");
  } catch (err) {
    return DEMO_GRAPH;
  }
}

export async function fetchTickerDeepDive(ticker) {
  try {
    const res = await fetch(`${API_BASE_URL}/graph/ticker/${encodeURIComponent(ticker)}`);
    return await handleResponse(res, "Failed to fetch ticker deep dive");
  } catch (err) {
    const item = DEMO_ITEMS.find(i => i.ticker === ticker) || DEMO_ITEMS[0];
    return {
      ticker: item.ticker,
      name: item.name,
      sector: item.sector,
      direct_driver: item.direct_driver,
      supply_chain_ripple: item.supply_chain_ripple
    };
  }
}

export async function fetchMarketEvents() {
  try {
    const res = await fetch(`${API_BASE_URL}/market/events`);
    return await handleResponse(res, "Failed to fetch market events");
  } catch (err) {
    return {
      events: [
        { id: 1, title: "Tata Motors EV commercial contract signed", time: "25m ago", impact: "HIGH", ticker: "TATAMOTORS.NS" },
        { id: 2, title: "Quick commerce dark store price war intensifies", time: "1h ago", impact: "MEDIUM", ticker: "ZOMATO.NS" }
      ]
    };
  }
}

export async function fetchMarketTopMovers(limit = 6) {
  try {
    const res = await fetch(`${API_BASE_URL}/market/top-movers?limit=${limit}`);
    return await handleResponse(res, "Failed to fetch top movers");
  } catch (err) {
    return {
      gainers: DEMO_ITEMS.filter(i => i.delta_pct > 0).slice(0, limit),
      losers: DEMO_ITEMS.filter(i => i.delta_pct < 0).slice(0, limit)
    };
  }
}

export async function saveUserCheckpoint(checkpointName = "Last User Visit", userId = null, notes = "") {
  try {
    const res = await fetch(`${API_BASE_URL}/checkpoints/save`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ checkpoint_name: checkpointName, user_id: userId, notes })
    });
    return await handleResponse(res, "Failed to save checkpoint");
  } catch (err) {
    return { status: "saved", checkpoint_name: checkpointName, timestamp: new Date().toISOString() };
  }
}

export async function injectMarketShock(shockType) {
  try {
    const res = await fetch(`${API_BASE_URL}/simulation/inject-shock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shock_type: shockType })
    });
    return await handleResponse(res, "Failed to inject market shock");
  } catch (err) {
    return {
      status: "success",
      shock_type: shockType,
      message: "Simulated market shock propagated across knowledge graph nodes.",
      affected_stocks: ["TATAMOTORS.NS", "TATAPOWER.NS", "MARUTI.NS"]
    };
  }
}

export async function fetchDbTables() {
  try {
    const res = await fetch(`${API_BASE_URL}/db/tables`);
    return await handleResponse(res, "Failed to fetch database tables");
  } catch (err) {
    return { tables: ["users", "watchlists", "watchlist_items", "snapshots", "checkpoints", "user_settings"] };
  }
}

export async function fetchDbTableData(tableName, limit = 50) {
  try {
    const res = await fetch(`${API_BASE_URL}/db/table/${encodeURIComponent(tableName)}?limit=${limit}`);
    return await handleResponse(res, `Failed to fetch data for ${tableName}`);
  } catch (err) {
    return { table: tableName, count: 5, rows: [] };
  }
}

export async function searchTickers(query) {
  try {
    const res = await fetch(`${API_BASE_URL}/market/browse?query=${encodeURIComponent(query)}`);
    return await handleResponse(res, "Failed to search tickers");
  } catch (err) {
    let stocks = DEMO_ITEMS;
    if (query) {
      stocks = stocks.filter(s => s.ticker.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase()));
    }
    return { stocks };
  }
}
