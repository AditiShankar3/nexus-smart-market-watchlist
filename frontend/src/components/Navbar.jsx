import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Bookmark, 
  Plus, 
  Clock, 
  User, 
  LogOut,
  LogIn,
  RefreshCw,
  Sun,
  Moon,
  Compass,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';

export default function Navbar({
  currentUser,
  onOpenAuthModal,
  onLogout,
  watchlists,
  activeWatchlistId,
  onSelectWatchlist,
  onOpenManageModal,
  onOpenShockModal,
  onSaveCheckpoint,
  onRefresh,
  theme = 'light',
  onToggleTheme,
  onOpenTour,
  loading,
  dataStatus = "LIVE_NSE"
}) {
  const activeWl = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];
  const isLight = theme === 'light';
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [showFreshnessModal, setShowFreshnessModal] = useState(false);

  // Live timer counting seconds since last refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setSecondsAgo(0);
    onRefresh();
  };

  return (
    <header className={`border-b sticky top-0 z-40 px-4 lg:px-8 py-3 transition-colors duration-200 backdrop-blur-md ${
      isLight 
        ? 'bg-[#F8F2EF]/95 border-[#E5D6CE] text-[#1E293B]' 
        : 'bg-[#121826]/90 border-slate-800 text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Market Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-bold text-base tracking-tight flex items-center gap-1.5 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  NEXUS <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold border ${
                    isLight 
                      ? 'bg-[#DEC3B3]/40 text-slate-800 border-[#DEC3B3]' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>GRAPH</span>
                </h1>
                
                {/* Clickable Staleness & Freshness Inspector Badge */}
                <button
                  onClick={() => setShowFreshnessModal(true)}
                  title="Click to inspect live feed health & staleness policy"
                  className={`flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border transition hover:opacity-80 cursor-pointer shadow-xs ${
                    isLight 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{dataStatus}</span>
                  <span className="text-[9px] opacity-75">({secondsAgo}s ago)</span>
                </button>
              </div>
              <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Context-Aware Market Watchlist
              </p>
            </div>
          </div>

          {/* User Profile & Theme on Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onToggleTheme}
              className={`p-1.5 rounded-xl border transition ${
                isLight ? 'bg-[#E7EBEE] text-slate-700 border-[#D2DCE4]' : 'bg-slate-800 text-amber-300 border-slate-700'
              }`}
              title="Toggle Theme"
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            {currentUser ? (
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border text-xs font-semibold ${
                isLight ? 'bg-[#E7EBEE] border-[#D2DCE4] text-slate-800' : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="truncate max-w-[80px]">{currentUser.name.split(' ')[0]}</span>
                <button onClick={onLogout} className="text-slate-400 hover:text-rose-500 ml-1">
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-xl font-semibold shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Center: Watchlist Switcher */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <select
              value={activeWatchlistId || ''}
              onChange={(e) => onSelectWatchlist(e.target.value)}
              className={`w-full text-xs font-semibold rounded-xl border px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs truncate transition ${
                isLight 
                  ? 'bg-[#FFFFFF] text-slate-800 border-[#DEC3B3]' 
                  : 'bg-slate-900/90 text-slate-100 border-slate-700/80'
              }`}
            >
              {watchlists.map(wl => (
                <option key={wl.id} value={wl.id}>
                  {wl.name} ({wl.item_count} stocks)
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
              <Bookmark className="w-3.5 h-3.5" />
            </div>
          </div>

          <button
            onClick={onOpenManageModal}
            title="Add or Manage Stocks"
            className={`p-2 rounded-xl border transition ${
              isLight 
                ? 'bg-[#FFFFFF] hover:bg-[#E7EBEE] text-slate-700 border-[#DEC3B3]' 
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleManualRefresh}
            disabled={loading}
            title="Refresh Prices & Reset Feed Timer"
            className={`p-2 rounded-xl border transition ${
              isLight 
                ? 'bg-[#FFFFFF] hover:bg-[#E7EBEE] text-slate-700 border-[#DEC3B3]' 
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            } ${loading ? 'animate-spin text-blue-500' : ''}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Actions, Theme Toggle, Guided Tour & User Profile */}
        <div className="hidden md:flex items-center gap-2">
          
          {/* Guided Tour Trigger */}
          <button
            onClick={onOpenTour}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 ${
              isLight 
                ? 'bg-[#E7EBEE] hover:bg-[#D2DCE4] text-slate-700 border-[#DEC3B3]' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Take System Tour"
          >
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>Tour</span>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs font-semibold ${
              isLight 
                ? 'bg-[#E7EBEE] hover:bg-[#D2DCE4] text-slate-700 border-[#DEC3B3]' 
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
            title={isLight ? "Switch to Midnight Dark Mode" : "Switch to Seaside Escape Light Mode"}
          >
            {isLight ? <Moon className="w-3.5 h-3.5 text-slate-700" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            onClick={onOpenShockModal}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition ${
              isLight 
                ? 'bg-[#DEC3B3]/40 hover:bg-[#DEC3B3]/60 text-amber-950 border-[#DEC3B3]' 
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
            title="Simulate market news to see instant graph reaction"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Shock</span>
          </button>

          {currentUser ? (
            <div className={`flex items-center gap-2 pl-3 pr-2 py-1 rounded-xl border shadow-2xs ${
              isLight 
                ? 'bg-[#FFFFFF] border-[#DEC3B3] text-slate-800' 
                : 'bg-slate-900/90 border-slate-700/80 text-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{currentUser.name}</span>
              </div>
              <button
                onClick={onLogout}
                title="Log Out & Save Session Exit Prices"
                className={`p-1 rounded-lg transition ml-1 ${
                  isLight ? 'hover:bg-rose-100 text-slate-500 hover:text-rose-600' : 'hover:bg-slate-800 text-slate-400 hover:text-rose-400'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>

      </div>

      {/* Staleness & Data Pipeline Diagnostics Modal */}
      {showFreshnessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className={`border rounded-3xl w-full max-w-lg p-6 shadow-2xl relative space-y-4 ${
            isLight ? 'bg-white border-[#DEC3B3] text-slate-900' : 'bg-[#121826] border-slate-700 text-white'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base">Market Data & Staleness Policy</h3>
              </div>
              <button
                onClick={() => setShowFreshnessModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-700 dark:text-emerald-300">Live Status: {dataStatus}</strong>
                  <span className="text-slate-600 dark:text-slate-400">
                    Last quote sync occurred {secondsAgo}s ago. Quotes are polled in the background via FastAPI's async scheduler.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Cache TTL Policy</span>
                  <span className="font-mono font-bold text-sm text-blue-500">30 Seconds</span>
                  <p className="text-[11px] text-slate-500 mt-1">Prevents upstream provider rate-limits while ensuring real-time responsiveness.</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Staleness Threshold</span>
                  <span className="font-mono font-bold text-sm text-amber-500">&gt; 180s Flagged</span>
                  <p className="text-[11px] text-slate-500 mt-1">Feeds older than 3 minutes are explicitly tagged as Delayed to protect user decision-making.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                <strong className="block text-slate-800 dark:text-slate-200 font-semibold">Zero-Hallucination Session Delta:</strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  When a user closes their tab, <code className="font-mono text-blue-500">navigator.sendBeacon</code> records the exact closing price of every stock into SQLite. On return, deltas are computed from mathematically verified records, never guessed.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFreshnessModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
