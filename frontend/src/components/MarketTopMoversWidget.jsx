import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ExternalLink, 
  Plus, 
  Check, 
  Layers,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Radio
} from 'lucide-react';
import { fetchMarketTopMovers, addTickerToWatchlist } from '../api';

export default function MarketTopMoversWidget({
  onSelectTicker,
  activeWatchlistId,
  activeWatchlistTickers = [],
  theme = 'light',
  onRefreshAll
}) {
  const [moversData, setMoversData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'gainers' | 'losers' | 'volume'
  const [addedMap, setAddedMap] = useState({});

  const isLight = theme === 'light';

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchMarketTopMovers(6);
      setMoversData(res.movers || {});
    } catch (err) {
      console.error("Failed to load top movers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (ticker) => {
    if (!activeWatchlistId) return;
    try {
      await addTickerToWatchlist(activeWatchlistId, ticker);
      setAddedMap(prev => ({ ...prev, [ticker]: true }));
      setTimeout(() => {
        setAddedMap(prev => ({ ...prev, [ticker]: false }));
      }, 2500);
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      console.error("Failed to add mover to watchlist", err);
    }
  };

  const getFilteredList = () => {
    if (!moversData) return [];
    if (filterTab === 'gainers') return moversData.gainers || [];
    if (filterTab === 'losers') return moversData.losers || [];
    if (filterTab === 'volume') return moversData.volume_spikes || [];
    
    // 'all': Combine and deduplicate
    const combined = [
      ...(moversData.gainers || []),
      ...(moversData.losers || []),
      ...(moversData.volume_spikes || [])
    ];
    const seen = new Set();
    return combined.filter(item => {
      if (seen.has(item.ticker)) return false;
      seen.add(item.ticker);
      return true;
    }).slice(0, 6);
  };

  const list = getFilteredList();

  return (
    <section className={`border rounded-3xl p-5 md:p-6 shadow-xl space-y-4 transition-all ${
      isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
    }`}>
      
      {/* Header Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
        isLight ? 'border-[#E5D6CE]/80' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-semibold uppercase tracking-wider border ${
              isLight 
                ? 'bg-[#DEC3B3]/40 text-amber-950 border-[#DEC3B3]' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              150+ Stock Universe Radar
            </span>
          </div>
          <h3 className={`text-base font-bold tracking-tight flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span>Market-Wide Top Movers & Anomalies</span>
          </h3>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Major breakouts and volume anomalies happening across the broader market outside your current watchlist.
          </p>
        </div>

        {/* Filter Pills */}
        <div className={`flex items-center gap-1 p-1 rounded-2xl border text-xs self-start sm:self-auto ${
          isLight ? 'bg-[#E7EBEE] border-[#D2DCE4]' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition ${
              filterTab === 'all' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Outliers
          </button>
          <button
            onClick={() => setFilterTab('gainers')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition flex items-center gap-1 ${
              filterTab === 'gainers' 
                ? isLight ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white shadow-sm' 
                : isLight ? 'text-slate-600 hover:text-emerald-800' : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>Gainers</span>
          </button>
          <button
            onClick={() => setFilterTab('losers')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition flex items-center gap-1 ${
              filterTab === 'losers' 
                ? isLight ? 'bg-rose-600 text-white' : 'bg-rose-600 text-white shadow-sm' 
                : isLight ? 'text-slate-600 hover:text-rose-800' : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <TrendingDown className="w-3 h-3" />
            <span>Decliners</span>
          </button>
          <button
            onClick={() => setFilterTab('volume')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition flex items-center gap-1 ${
              filterTab === 'volume' 
                ? isLight ? 'bg-amber-600 text-white' : 'bg-amber-600 text-white shadow-sm' 
                : isLight ? 'text-slate-600 hover:text-amber-800' : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Volume Spikes</span>
          </button>
        </div>
      </div>

      {/* Grid of Top Movers */}
      {loading ? (
        <div className="py-8 text-center flex items-center justify-center gap-2 font-mono text-xs text-slate-500">
          <Activity className="w-4 h-4 animate-spin text-blue-500" />
          <span>Scanning 150+ Indian Equities for anomalies...</span>
        </div>
      ) : list.length === 0 ? (
        <div className={`py-6 text-center text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          No abnormal market outliers detected right now. All 150+ stocks are trading steadily.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {list.map(stock => {
            const isPositive = stock.change_pct >= 0;
            const inWatchlist = activeWatchlistTickers.includes(stock.ticker);
            const isJustAdded = addedMap[stock.ticker];

            return (
              <div
                key={stock.ticker}
                className={`border rounded-2xl p-4 flex flex-col justify-between transition group shadow-xs ${
                  isLight 
                    ? 'bg-[#FFFFFF] hover:bg-[#F8F2EF] border-[#E5D6CE]' 
                    : 'bg-slate-900/70 hover:bg-slate-900/90 border-slate-800/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectTicker(stock.ticker)}
                          className={`font-bold font-mono text-sm tracking-tight transition flex items-center gap-1 text-left hover:underline ${
                            isLight ? 'text-slate-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
                          }`}
                        >
                          {stock.display_ticker}
                          <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>NSE</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition" />
                        </button>
                        <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono border ${
                          isLight ? 'bg-[#E7EBEE] text-slate-700 border-[#D2DCE4]' : 'bg-slate-800 text-slate-400 border-slate-700/60'
                        }`}>
                          {stock.sector}
                        </span>
                      </div>
                      <h4 className={`text-xs font-semibold truncate max-w-[180px] mt-0.5 ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`} title={stock.name}>
                        {stock.name}
                      </h4>
                    </div>

                    <div className="text-right font-mono">
                      <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                        isPositive 
                          ? isLight ? 'text-emerald-700' : 'text-emerald-400' 
                          : isLight ? 'text-rose-700' : 'text-rose-400'
                      }`}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>{isPositive ? '+' : ''}{stock.change_pct.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Anomaly note / reason */}
                  <div className={`text-[11px] p-2.5 rounded-xl border line-clamp-2 mt-2 leading-relaxed ${
                    isLight 
                      ? 'bg-[#E7EBEE]/70 text-slate-700 border-[#D2DCE4]' 
                      : 'bg-slate-950/50 text-slate-300 border-slate-800/60'
                  }`}>
                    {stock.reason || (stock.rvol >= 1.5 ? `Heavy volume spike (${stock.rvol}x daily average)` : 'Market price momentum')}
                  </div>
                </div>

                {/* Card Actions */}
                <div className={`pt-3 mt-3 border-t flex items-center justify-between text-xs ${
                  isLight ? 'border-[#E5D6CE]' : 'border-slate-800/60'
                }`}>
                  <button
                    onClick={() => onSelectTicker(stock.ticker)}
                    className="text-blue-600 dark:text-blue-400 font-semibold text-[11px] transition flex items-center gap-1 hover:underline"
                  >
                    <span>Supply Chain Graph</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => handleAdd(stock.ticker)}
                    disabled={inWatchlist || isJustAdded}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition flex items-center gap-1 ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : inWatchlist
                        ? isLight ? 'bg-[#E7EBEE] text-slate-400 border border-[#D2DCE4] cursor-default' : 'bg-slate-800 text-slate-500 cursor-default'
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
                    ) : inWatchlist ? (
                      <span>Watching</span>
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

    </section>
  );
}
