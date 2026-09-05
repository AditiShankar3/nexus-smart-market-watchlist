import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Check, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Sparkles, 
  Layers,
  Activity
} from 'lucide-react';
import { browseStocks, addTickerToWatchlist } from '../api';

export default function StockCatalogView({
  watchlists,
  activeWatchlistId,
  onSelectTicker,
  onOpenManageModal,
  onRefreshAll,
  theme = 'light'
}) {
  const [stocks, setStocks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [loading, setLoading] = useState(true);
  const [addedMap, setAddedMap] = useState({});

  const isLight = theme === 'light';
  const activeWl = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];

  useEffect(() => {
    setLoading(true);
    browseStocks(selectedSector, searchQuery, sortBy)
      .then(res => {
        setStocks(res.stocks || []);
        setSectors(['ALL', ...(res.sectors || [])]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load stock catalog", err);
        setLoading(false);
      });
  }, [selectedSector, searchQuery, sortBy]);

  const handleAdd = async (ticker) => {
    if (!activeWl) {
      onOpenManageModal();
      return;
    }
    try {
      await addTickerToWatchlist(activeWl.id, ticker);
      setAddedMap(prev => ({ ...prev, [ticker]: true }));
      setTimeout(() => {
        setAddedMap(prev => ({ ...prev, [ticker]: false }));
      }, 2500);
      onRefreshAll();
    } catch (err) {
      alert("Failed to add stock to watchlist.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Description */}
      <div className={`border rounded-3xl p-6 shadow-xl transition-all ${
        isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-semibold uppercase tracking-wider border ${
                isLight 
                  ? 'bg-[#D2DCE4]/60 text-blue-950 border-[#DEC3B3]' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Indian Stock Catalog
              </span>
            </div>
            <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Explore 150+ NSE Stocks & Create Custom Watchlists
            </h2>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Filter Indian equities, discover supply chain relationships, and add them to your custom watchlists.
            </p>
          </div>

          <button
            onClick={onOpenManageModal}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Watchlist</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className={`grid grid-cols-1 sm:grid-cols-12 gap-3 mt-5 pt-5 border-t ${
          isLight ? 'border-[#E5D6CE]' : 'border-slate-800'
        }`}>
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across 150+ stocks (e.g. Tata Motors, Bharti Airtel, Infosys, Zomato)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isLight 
                  ? 'bg-[#F8F2EF] border-[#DEC3B3] text-slate-900 placeholder-slate-400' 
                  : 'bg-slate-900 border-slate-700/80 text-white placeholder-slate-500'
              }`}
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <span className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full text-xs font-medium rounded-2xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isLight 
                  ? 'bg-[#F8F2EF] border-[#DEC3B3] text-slate-800' 
                  : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            >
              <option value="market_cap">Market Cap (Highest First)</option>
              <option value="name">Company Name (A-Z)</option>
              <option value="price">Share Price (Highest First)</option>
            </select>
          </div>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 max-w-full pb-1">
          {sectors.map(sec => {
            const isActive = selectedSector === sec;
            return (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : isLight
                    ? 'bg-[#E7EBEE] text-slate-700 hover:bg-[#D2DCE4] border-[#D2DCE4]'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-800'
                }`}
              >
                {sec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stocks Grid */}
      {loading ? (
        <div className={`border rounded-3xl p-12 text-center ${
          isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
        }`}>
          <Activity className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className={`text-sm font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Filtering Indian stock universe...</p>
        </div>
      ) : stocks.length === 0 ? (
        <div className={`border rounded-3xl p-12 text-center ${
          isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
        }`}>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>No Indian stocks match your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map(s => {
            const inActiveWl = activeWl?.tickers?.includes(s.ticker);
            const isJustAdded = addedMap[s.ticker];
            const isPositive = s.change_pct >= 0;

            return (
              <div
                key={s.ticker}
                className={`border rounded-3xl p-5 shadow-xs transition flex flex-col justify-between group ${
                  isLight 
                    ? 'bg-[#FFFFFF] hover:bg-[#F8F2EF] border-[#E5D6CE]' 
                    : 'bg-[#121826] hover:bg-[#151D2E] border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <button
                        onClick={() => onSelectTicker(s.ticker)}
                        className={`font-bold font-mono text-sm tracking-tight transition flex items-center gap-1 text-left hover:underline ${
                          isLight ? 'text-slate-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
                        }`}
                      >
                        {s.display_ticker}
                        <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>NSE</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition" />
                      </button>
                      <h4 className={`text-xs font-semibold truncate max-w-[200px] mt-0.5 ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`} title={s.name}>
                        {s.name}
                      </h4>
                    </div>

                    <div className="text-right font-mono">
                      <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        ₹{s.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                        isPositive 
                          ? isLight ? 'text-emerald-700' : 'text-emerald-400' 
                          : isLight ? 'text-rose-700' : 'text-rose-400'
                      }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPositive ? '+' : ''}{s.change_pct.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] mt-2">
                    <span className={`px-2 py-0.5 rounded-lg border ${
                      isLight ? 'bg-[#E7EBEE] text-slate-700 border-[#D2DCE4]' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {s.sector}
                    </span>
                    <span className={`font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      ₹{(s.market_cap / 100000).toFixed(1)}L Cr
                    </span>
                  </div>
                </div>

                <div className={`pt-3.5 mt-3.5 border-t flex items-center justify-between gap-2 ${
                  isLight ? 'border-[#E5D6CE]' : 'border-slate-800/80'
                }`}>
                  <button
                    onClick={() => onSelectTicker(s.ticker)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 transition hover:underline"
                  >
                    View Supply Chain →
                  </button>

                  <button
                    onClick={() => handleAdd(s.ticker)}
                    disabled={inActiveWl || isJustAdded}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : inActiveWl
                        ? isLight ? 'bg-[#E7EBEE] text-slate-400 border border-[#D2DCE4] cursor-not-allowed' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : isLight
                        ? 'bg-[#D2DCE4] hover:bg-[#DEC3B3] text-slate-800 border border-[#DEC3B3]'
                        : 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                      </>
                    ) : inActiveWl ? (
                      <span>In Watchlist</span>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
