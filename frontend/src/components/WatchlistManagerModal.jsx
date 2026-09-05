import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Search, 
  Bookmark, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { createWatchlist, deleteWatchlist, addTickerToWatchlist, removeTickerFromWatchlist, searchTickers } from '../api';

export default function WatchlistManagerModal({
  currentUser,
  watchlists,
  activeWatchlistId,
  onClose,
  onRefreshAll,
  onSelectWatchlist
}) {
  const [activeTab, setActiveTab] = useState('add_tickers'); // 'add_tickers' | 'new_watchlist'
  const [newWlName, setNewWlName] = useState('');
  const [newWlDesc, setNewWlDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const activeWl = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q || q.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await searchTickers(q);
      setSearchResults(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddTicker = async (ticker) => {
    if (!activeWl) return;
    try {
      await addTickerToWatchlist(activeWl.id, ticker);
      setStatusMsg(`Added ${ticker} to ${activeWl.name}`);
      setTimeout(() => setStatusMsg(''), 3000);
      onRefreshAll();
    } catch (err) {
      alert("Failed to add ticker");
    }
  };

  const handleRemoveTicker = async (ticker) => {
    if (!activeWl) return;
    try {
      await removeTickerFromWatchlist(activeWl.id, ticker);
      onRefreshAll();
    } catch (err) {
      alert("Failed to remove ticker");
    }
  };

  const handleCreateWatchlist = async (e) => {
    e.preventDefault();
    if (!newWlName.trim()) return;
    try {
      const res = await createWatchlist(newWlName, newWlDesc, [], currentUser?.id);
      setNewWlName('');
      setNewWlDesc('');
      setStatusMsg(`Created watchlist: ${res.name}`);
      setTimeout(() => setStatusMsg(''), 3000);
      onSelectWatchlist(res.id);
      if (res.id) {
        localStorage.setItem('nexus_active_watchlist_id', res.id);
      }
      await onRefreshAll();
      setActiveTab('add_tickers');
    } catch (err) {
      alert("Failed to create watchlist");
    }
  };

  const handleDeleteWatchlist = async (wlId) => {
    if (!confirm("Are you sure you want to delete this watchlist?")) return;
    try {
      await deleteWatchlist(wlId);
      if (activeWatchlistId === wlId) {
        const remaining = watchlists.filter(w => w.id !== wlId);
        const nextId = remaining.length > 0 ? (remaining.find(w => w.is_default)?.id || remaining[0].id) : null;
        onSelectWatchlist(nextId);
        if (nextId) {
          localStorage.setItem('nexus_active_watchlist_id', nextId);
        } else {
          localStorage.removeItem('nexus_active_watchlist_id');
        }
      }
      await onRefreshAll();
    } catch (err) {
      alert("Failed to delete watchlist: " + (err.message || ''));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#121826] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Manage Market Watchlists</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6">
          <button
            onClick={() => setActiveTab('add_tickers')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === 'add_tickers'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Manage Tickers in "{activeWl?.name}"
          </button>
          <button
            onClick={() => setActiveTab('new_watchlist')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === 'new_watchlist'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            + Create New Watchlist
          </button>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            {statusMsg}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'add_tickers' && (
            <>
              {/* Instant Search Bar */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Search & Add Tickers
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by ticker (e.g. RELIANCE, TATAMOTORS, INFY) or company name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Autocomplete Results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-slate-900 border border-slate-700 rounded-xl divide-y divide-slate-800 max-h-48 overflow-y-auto">
                    {searchResults.map(res => {
                      const alreadyInWl = activeWl?.tickers?.includes(res.ticker);
                      return (
                        <div
                          key={res.ticker}
                          className="p-2.5 flex items-center justify-between hover:bg-slate-800/60 transition"
                        >
                          <div>
                            <span className="font-mono font-bold text-white text-sm mr-2">{res.ticker}</span>
                            <span className="text-xs text-slate-400">{res.name} ({res.sector})</span>
                          </div>
                          <button
                            onClick={() => handleAddTicker(res.ticker)}
                            disabled={alreadyInWl}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                              alreadyInWl
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                          >
                            {alreadyInWl ? 'Added' : '+ Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Current Watchlist Tickers */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Current Tickers ({activeWl?.tickers?.length || 0})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activeWl?.tickers?.map(t => (
                    <div
                      key={t}
                      className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="font-mono font-bold text-sm text-slate-200">{t}</span>
                      <button
                        onClick={() => handleRemoveTicker(t)}
                        title="Remove ticker"
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'new_watchlist' && (
            <form onSubmit={handleCreateWatchlist} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Watchlist Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Energy & Autonomous Mobility"
                  value={newWlName}
                  onChange={(e) => setNewWlName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Description / Thesis
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Tracking supply constraints and battery raw materials."
                  value={newWlDesc}
                  onChange={(e) => setNewWlDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white transition shadow-md shadow-blue-500/20"
              >
                Create Watchlist
              </button>
            </form>
          )}

          {/* All Watchlists Overview */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              All Watchlists
            </h4>
            <div className="space-y-2">
              {watchlists.map(wl => (
                <div
                  key={wl.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sm text-white flex items-center gap-2">
                      {wl.name}
                      {wl.is_default && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">Default</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{wl.item_count} tickers</div>
                  </div>
                  {!wl.is_default && (wl.is_owner || !currentUser) ? (
                    <button
                      onClick={() => handleDeleteWatchlist(wl.id)}
                      title="Delete Watchlist"
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : wl.is_default ? (
                    <span className="text-[11px] text-slate-500 italic px-2">Protected System Watchlist</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
