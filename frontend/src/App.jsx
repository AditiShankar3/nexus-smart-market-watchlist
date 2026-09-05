import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  TrendingUp, 
  Activity, 
  GitFork, 
  Table, 
  Layers, 
  Clock, 
  Sparkles, 
  Zap, 
  Bookmark, 
  RefreshCw,
  Bell,
  Settings,
  LayoutDashboard,
  Compass
} from 'lucide-react';
import Navbar from './components/Navbar';
import CatchUpHeader from './components/CatchUpHeader';
import WatchlistTable from './components/WatchlistTable';
import MarketGraphView from './components/MarketGraphView';
import MarketEventsView from './components/MarketEventsView';
import MarketTopMoversWidget from './components/MarketTopMoversWidget';
import SettingsView from './components/SettingsView';
import StockCatalogView from './components/StockCatalogView';
import StockDetailModal from './components/StockDetailModal';
import WatchlistManagerModal from './components/WatchlistManagerModal';
import ShockSimulatorModal from './components/ShockSimulatorModal';
import AuthModal from './components/AuthModal';
import WelcomeModal from './components/WelcomeModal';
import SystemTourModal from './components/SystemTourModal';
import DatabaseExplorerModal from './components/DatabaseExplorerModal';
import { 
  fetchWatchlists, 
  fetchDeltaAnalysis, 
  fetchWatchlistGraph, 
  fetchMacroGraph,
  saveUserCheckpoint,
  fetchHealth,
  recordSessionLeave,
  removeTickerFromWatchlist
} from './api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Default Theme: Seaside Escape Light Mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexus_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('nexus_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  // Welcome modal on initial browser visit
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(() => {
    const saved = localStorage.getItem('nexus_user');
    const dismissed = localStorage.getItem('nexus_guest_dismissed');
    return !saved && !dismissed;
  });

  // Guided System Tour
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Live Database Explorer Modal
  const [isDbExplorerOpen, setIsDbExplorerOpen] = useState(false);

  const [navTab, setNavTab] = useState('dashboard'); // 'dashboard' | 'explore' | 'watchlists' | 'events' | 'settings'
  const [watchlists, setWatchlists] = useState([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState(() => {
    return localStorage.getItem('nexus_active_watchlist_id') || null;
  });
  const [baselineMode, setBaselineMode] = useState(() => currentUser ? 'last_visit' : '3h');
  const [deltaData, setDeltaData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState('LIVE_NSE');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'table' | 'graph'

  // Modals
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isShockModalOpen, setIsShockModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const currentPricesRef = useRef({});
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const handleSelectWatchlist = (id) => {
    setActiveWatchlistId(id);
    if (id) {
      localStorage.setItem('nexus_active_watchlist_id', id);
    } else {
      localStorage.removeItem('nexus_active_watchlist_id');
    }
  };

  // Auto-record session exit prices on tab close / unload without leaking listeners
  useEffect(() => {
    const handleExit = () => {
      if (currentUserRef.current?.id) {
        recordSessionLeave(currentUserRef.current.id, currentPricesRef.current);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleExit();
      }
    };

    window.addEventListener('beforeunload', handleExit);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleExit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Load Watchlists
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [wlRes, healthRes] = await Promise.all([
        fetchWatchlists(currentUser?.id),
        fetchHealth().catch(() => ({ data_status: 'LIVE_NSE' }))
      ]);

      setDataStatus(healthRes.data_status || 'LIVE_NSE');
      const loadedWatchlists = wlRes.watchlists || [];
      setWatchlists(loadedWatchlists);

      if (loadedWatchlists.length > 0) {
        const savedId = localStorage.getItem('nexus_active_watchlist_id');
        if (savedId && loadedWatchlists.some(w => w.id === savedId)) {
          setActiveWatchlistId(savedId);
        } else {
          setActiveWatchlistId(prevId => {
            if (prevId && loadedWatchlists.some(w => w.id === prevId)) {
              return prevId;
            }
            const defaultWl = loadedWatchlists.find(w => w.is_default) || loadedWatchlists[0];
            return defaultWl.id;
          });
        }
      } else {
        setActiveWatchlistId(null);
        localStorage.removeItem('nexus_active_watchlist_id');
      }
    } catch (err) {
      console.error("Initial data load failed:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load Delta Analysis & Graph
  const loadWatchlistAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      const [analysis, graph] = await Promise.all([
        fetchDeltaAnalysis(activeWatchlistId, baselineMode, currentUser?.id),
        activeWatchlistId ? fetchWatchlistGraph(activeWatchlistId) : fetchMacroGraph()
      ]);
      setDeltaData(analysis);
      setGraphData(graph);

      if (analysis?.items) {
        const pMap = {};
        analysis.items.forEach(i => { pMap[i.ticker] = i.current_price; });
        currentPricesRef.current = pMap;
      }
    } catch (err) {
      console.error("Failed to fetch watchlist analysis:", err);
    } finally {
      setLoading(false);
    }
  }, [activeWatchlistId, baselineMode, currentUser]);

  useEffect(() => {
    loadWatchlistAnalysis();

    // 12-second live ticking background refresh
    const liveTimer = setInterval(() => {
      fetchDeltaAnalysis(activeWatchlistId, baselineMode, currentUser?.id)
        .then(analysis => {
          if (analysis) {
            setDeltaData(analysis);
            if (analysis.items) {
              const pMap = {};
              analysis.items.forEach(i => { pMap[i.ticker] = i.current_price; });
              currentPricesRef.current = pMap;
            }
          }
        })
        .catch(() => {});
    }, 12000);

    return () => clearInterval(liveTimer);
  }, [loadWatchlistAnalysis, activeWatchlistId, baselineMode, currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('nexus_user', JSON.stringify(user));
    setBaselineMode('last_visit');
    setIsWelcomeModalOpen(false);

    // If first time, prompt guided tour
    if (!localStorage.getItem('nexus_tour_completed')) {
      setTimeout(() => setIsTourOpen(true), 400);
    }
  };

  const handleLogout = () => {
    if (currentUser?.id) {
      recordSessionLeave(currentUser.id, currentPricesRef.current);
    }
    setCurrentUser(null);
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_session_token');
    localStorage.removeItem('nexus_active_watchlist_id');
    setBaselineMode('3h');
  };

  const handleSaveCheckpoint = async () => {
    try {
      await saveUserCheckpoint("Manual Checkpoint", currentUser?.id);
      setBaselineMode('last_visit');
      await loadWatchlistAnalysis();
    } catch (err) {
      console.error("Failed to save checkpoint", err);
    }
  };

  const handleRemoveTicker = async (ticker) => {
    if (!activeWatchlistId) return;
    try {
      await removeTickerFromWatchlist(activeWatchlistId, ticker);
      await loadInitialData();
      await loadWatchlistAnalysis();
    } catch (err) {
      console.error("Failed to remove ticker:", err);
    }
  };

  const activeWl = watchlists.find(w => w.id === activeWatchlistId);
  const activeWatchlistTickers = activeWl?.tickers || [];
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isLight ? 'bg-[#F8F2EF] text-[#1E293B]' : 'bg-[#0B0F17] text-slate-100'
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        watchlists={watchlists}
        activeWatchlistId={activeWatchlistId}
        onSelectWatchlist={handleSelectWatchlist}
        onOpenManageModal={() => setIsManageModalOpen(true)}
        onOpenShockModal={() => setIsShockModalOpen(true)}
        onSaveCheckpoint={handleSaveCheckpoint}
        onRefresh={loadWatchlistAnalysis}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenTour={() => setIsTourOpen(true)}
        loading={loading}
        dataStatus={dataStatus}
      />

      {/* Main Tab Navigation */}
      <div className={`border-b px-4 lg:px-8 transition-colors ${
        isLight ? 'bg-[#FFFFFF]/70 border-[#E5D6CE] backdrop-blur-md' : 'bg-[#121826]/60 border-slate-800 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1.5 py-2.5">
            <button
              onClick={() => setNavTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition border ${
                navTab === 'dashboard'
                  ? isLight ? 'bg-[#D2DCE4] text-slate-900 border-[#DEC3B3] shadow-xs' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-[#E7EBEE] border-transparent' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setNavTab('explore')}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition border ${
                navTab === 'explore'
                  ? isLight ? 'bg-[#D2DCE4] text-slate-900 border-[#DEC3B3] shadow-xs' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-[#E7EBEE] border-transparent' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore 150+ Stocks</span>
            </button>

            <button
              onClick={() => setNavTab('watchlists')}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition border ${
                navTab === 'watchlists'
                  ? isLight ? 'bg-[#D2DCE4] text-slate-900 border-[#DEC3B3] shadow-xs' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-[#E7EBEE] border-transparent' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Watchlists & Graph</span>
            </button>

            <button
              onClick={() => setNavTab('events')}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition border ${
                navTab === 'events'
                  ? isLight ? 'bg-[#D2DCE4] text-slate-900 border-[#DEC3B3] shadow-xs' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-[#E7EBEE] border-transparent' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Market Events</span>
            </button>

            <button
              onClick={() => setNavTab('settings')}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition border ${
                navTab === 'settings'
                  ? isLight ? 'bg-[#D2DCE4] text-slate-900 border-[#DEC3B3] shadow-xs' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-[#E7EBEE] border-transparent' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings & Themes</span>
            </button>
          </div>

          <div className={`hidden md:flex items-center gap-2 text-[11px] font-mono font-semibold ${
            isLight ? 'text-slate-500' : 'text-slate-500'
          }`}>
            <span>NSE/BSE • Indian Equities Engine</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Tab 1: Dashboard View */}
        {navTab === 'dashboard' && (
          <div className="space-y-6">
            <CatchUpHeader
              currentUser={currentUser}
              briefing={deltaData?.briefing}
              baselineMode={baselineMode}
              baselineTimeDescription={deltaData?.baseline_time_description || 'your last visit'}
              isNewUser={deltaData?.is_new_user || false}
              onSelectBaseline={setBaselineMode}
              onSelectTicker={(t) => setSelectedTicker(t)}
              onStartTour={() => setIsTourOpen(true)}
              theme={theme}
              loading={loading}
            />

            {/* Market-Wide Top Movers & Anomalies Widget */}
            <MarketTopMoversWidget
              onSelectTicker={(t) => setSelectedTicker(t)}
              activeWatchlistId={activeWatchlistId}
              activeWatchlistTickers={activeWatchlistTickers}
              theme={theme}
              onRefreshAll={async () => {
                await loadInitialData();
                await loadWatchlistAnalysis();
              }}
            />

            <div className="flex items-center justify-between gap-4 pt-2">
              <h2 className={`text-base font-bold tracking-tight flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <Activity className="w-4 h-4 text-blue-500" />
                <span>Meaningful Watchlist Changes</span>
              </h2>

              <div className={`flex items-center gap-1 p-1 rounded-2xl border text-xs ${
                isLight ? 'bg-[#FFFFFF] border-[#DEC3B3]' : 'bg-[#121826] border-slate-800'
              }`}>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded-xl font-semibold flex items-center gap-1 transition ${
                    viewMode === 'split' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Split</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 rounded-xl font-semibold flex items-center gap-1 transition ${
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  className={`px-2.5 py-1 rounded-xl font-semibold flex items-center gap-1 transition ${
                    viewMode === 'graph' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Graph</span>
                </button>
              </div>
            </div>

            {viewMode === 'split' && (
              <div className="space-y-6">
                <WatchlistTable
                  items={deltaData?.items || []}
                  onSelectTicker={(t) => setSelectedTicker(t)}
                  onRemoveTicker={handleRemoveTicker}
                  baselineTimeDescription={deltaData?.baseline_time_description || 'your last visit'}
                  theme={theme}
                  loading={loading}
                />
                <MarketGraphView
                  graphData={graphData}
                  onSelectTicker={(t) => setSelectedTicker(t)}
                  loading={loading}
                />
              </div>
            )}

            {viewMode === 'table' && (
              <WatchlistTable
                items={deltaData?.items || []}
                onSelectTicker={(t) => setSelectedTicker(t)}
                onRemoveTicker={handleRemoveTicker}
                baselineTimeDescription={deltaData?.baseline_time_description || 'your last visit'}
                theme={theme}
                loading={loading}
              />
            )}

            {viewMode === 'graph' && (
              <MarketGraphView
                graphData={graphData}
                onSelectTicker={(t) => setSelectedTicker(t)}
                loading={loading}
              />
            )}
          </div>
        )}

        {/* Tab 2: Explore & Browse All 150+ Stocks */}
        {navTab === 'explore' && (
          <StockCatalogView
            watchlists={watchlists}
            activeWatchlistId={activeWatchlistId}
            onSelectTicker={(t) => setSelectedTicker(t)}
            onOpenManageModal={() => setIsManageModalOpen(true)}
            theme={theme}
            onRefreshAll={async () => {
              await loadInitialData();
              await loadWatchlistAnalysis();
            }}
          />
        )}

        {/* Tab 3: Dedicated Watchlists View */}
        {navTab === 'watchlists' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Active Watchlist Topology
                </h2>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Manage stocks and view relational supply chain graph.
                </p>
              </div>
              <button
                onClick={() => setIsManageModalOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md transition"
              >
                + Add / Manage Stocks
              </button>
            </div>

            <WatchlistTable
              items={deltaData?.items || []}
              onSelectTicker={(t) => setSelectedTicker(t)}
              onRemoveTicker={handleRemoveTicker}
              baselineTimeDescription={deltaData?.baseline_time_description || 'your last visit'}
              theme={theme}
              loading={loading}
            />

            <MarketGraphView
              graphData={graphData}
              onSelectTicker={(t) => setSelectedTicker(t)}
              loading={loading}
            />
          </div>
        )}

        {/* Tab 4: Market Events View */}
        {navTab === 'events' && (
          <MarketEventsView 
            onSelectTicker={(t) => setSelectedTicker(t)} 
            theme={theme}
          />
        )}

        {/* Tab 5: Settings & APIs View */}
        {navTab === 'settings' && (
          <SettingsView 
            dataStatus={dataStatus} 
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenTour={() => setIsTourOpen(true)}
            onOpenDbExplorer={() => setIsDbExplorerOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className={`border-t py-5 px-4 text-center text-xs font-mono mt-12 transition-colors ${
        isLight ? 'border-[#E5D6CE] text-slate-500 bg-[#FFFFFF]/50' : 'border-slate-800/80 text-slate-500 bg-[#0D121F]/40'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NEXUS GRAPH • Smart Context-Aware Market Watchlist</span>
          <span className={isLight ? 'text-slate-400' : 'text-slate-600'}>Know what changed. Know what matters.</span>
        </div>
      </footer>

      {/* Welcome / Onboarding Modal on First Visit */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Interactive System Tour Modal */}
      <SystemTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        theme={theme}
      />

      {/* SQLite Live Database Explorer Modal */}
      <DatabaseExplorerModal
        isOpen={isDbExplorerOpen}
        onClose={() => setIsDbExplorerOpen(false)}
        theme={theme}
      />

      {/* Stock Detail & Knowledge Graph Neighborhood Modal */}
      {selectedTicker && (
        <StockDetailModal
          ticker={selectedTicker}
          onClose={() => setSelectedTicker(null)}
          onSelectTicker={(t) => setSelectedTicker(t)}
        />
      )}

      {/* Watchlist Manager Modal */}
      {isManageModalOpen && (
        <WatchlistManagerModal
          currentUser={currentUser}
          watchlists={watchlists}
          activeWatchlistId={activeWatchlistId}
          onClose={() => setIsManageModalOpen(false)}
          onRefreshAll={async () => {
            await loadInitialData();
            await loadWatchlistAnalysis();
          }}
          onSelectWatchlist={handleSelectWatchlist}
        />
      )}

      {/* Shock Simulator Modal */}
      {isShockModalOpen && (
        <ShockSimulatorModal
          onClose={() => setIsShockModalOpen(false)}
          onShockInjected={loadWatchlistAnalysis}
        />
      )}

      {/* Auth Modal (Triggered via Navbar) */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

    </div>
  );
}
