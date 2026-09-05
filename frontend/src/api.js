/**
 * Centralized API client for Nexus Market Graph Backend.
 */
const API_BASE_URL = "http://localhost:8000/api";

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
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(res, "Backend health check failed");
}

// Authentication
export async function loginUser(username) {
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
}

export async function registerUser(username, name, email = "") {
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
  const res = await fetch(`${API_BASE_URL}/settings`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res, "Failed to load settings");
}

export async function saveSettings(settings) {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ settings })
  });
  return handleResponse(res, "Failed to save settings");
}

// Watchlists
export async function fetchWatchlists(userId = null) {
  let url = `${API_BASE_URL}/watchlists`;
  if (userId) url += `?user_id=${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse(res, "Failed to fetch watchlists");
}

export async function createWatchlist(name, description = "", initial_tickers = [], userId = null) {
  const res = await fetch(`${API_BASE_URL}/watchlists`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ name, description, initial_tickers, user_id: userId })
  });
  return handleResponse(res, "Failed to create watchlist");
}

export async function deleteWatchlist(id) {
  const res = await fetch(`${API_BASE_URL}/watchlists/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return handleResponse(res, "Failed to delete watchlist");
}

export async function addTickerToWatchlist(watchlistId, ticker, notes = "") {
  const res = await fetch(`${API_BASE_URL}/watchlists/${encodeURIComponent(watchlistId)}/items`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ ticker, notes })
  });
  return handleResponse(res, "Failed to add ticker");
}

export async function removeTickerFromWatchlist(watchlistId, ticker) {
  const res = await fetch(`${API_BASE_URL}/watchlists/${encodeURIComponent(watchlistId)}/items/${encodeURIComponent(ticker)}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return handleResponse(res, "Failed to remove ticker");
}

export async function searchTickers(query) {
  if (!query) return { results: [] };
  const res = await fetch(`${API_BASE_URL}/market/search?q=${encodeURIComponent(query)}`);
  return handleResponse(res, "Search failed");
}

export async function browseStocks(sector = 'ALL', query = '', sortBy = 'market_cap') {
  let url = `${API_BASE_URL}/market/browse?sort_by=${sortBy}`;
  if (sector && sector !== 'ALL') url += `&sector=${encodeURIComponent(sector)}`;
  if (query) url += `&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  return handleResponse(res, "Failed to browse stocks");
}

export async function fetchMacroGraph() {
  const res = await fetch(`${API_BASE_URL}/graph/macro`);
  return handleResponse(res, "Failed to fetch macro graph");
}

// Intelligence & Delta Engine
export async function fetchDeltaAnalysis(watchlistId, baselineMode = "last_visit", userId = null, customTimestamp = null) {
  let url = `${API_BASE_URL}/delta/analyze?baseline_mode=${encodeURIComponent(baselineMode)}`;
  if (watchlistId) url += `&watchlist_id=${encodeURIComponent(watchlistId)}`;
  if (userId) url += `&user_id=${encodeURIComponent(userId)}`;
  if (customTimestamp) url += `&custom_timestamp=${encodeURIComponent(customTimestamp)}`;
  
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse(res, "Failed to analyze deltas");
}

export async function fetchWatchlistGraph(watchlistId) {
  const res = await fetch(`${API_BASE_URL}/graph/watchlist/${encodeURIComponent(watchlistId)}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res, "Failed to fetch graph data");
}

export async function fetchTickerDeepDive(ticker) {
  const res = await fetch(`${API_BASE_URL}/graph/ticker/${encodeURIComponent(ticker)}`);
  return handleResponse(res, "Failed to fetch ticker deep dive");
}

export async function fetchMarketEvents() {
  const res = await fetch(`${API_BASE_URL}/market/events`);
  return handleResponse(res, "Failed to fetch market events");
}

export async function fetchMarketTopMovers(limit = 6) {
  const res = await fetch(`${API_BASE_URL}/market/top-movers?limit=${limit}`);
  return handleResponse(res, "Failed to fetch top movers");
}

export async function saveUserCheckpoint(checkpointName = "Last User Visit", userId = null, notes = "") {
  const res = await fetch(`${API_BASE_URL}/checkpoints/save`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ checkpoint_name: checkpointName, user_id: userId, notes })
  });
  return handleResponse(res, "Failed to save checkpoint");
}

export async function injectMarketShock(shockType) {
  const res = await fetch(`${API_BASE_URL}/simulation/inject-shock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shock_type: shockType })
  });
  return handleResponse(res, "Failed to inject market shock");
}

export async function fetchDbTables() {
  const res = await fetch(`${API_BASE_URL}/db/tables`);
  return handleResponse(res, "Failed to fetch database tables");
}

export async function fetchDbTableData(tableName, limit = 50) {
  const res = await fetch(`${API_BASE_URL}/db/table/${encodeURIComponent(tableName)}?limit=${limit}`);
  return handleResponse(res, `Failed to fetch data for ${tableName}`);
}

