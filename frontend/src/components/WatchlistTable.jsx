import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  GitFork, 
  ExternalLink, 
  Trash2, 
  Activity
} from 'lucide-react';

export default function WatchlistTable({
  items,
  onSelectTicker,
  onRemoveTicker,
  baselineTimeDescription,
  theme = 'light',
  loading
}) {
  const isLight = theme === 'light';

  if (!items || items.length === 0) {
    return (
      <div className={`border rounded-2xl p-12 text-center shadow-lg ${
        isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
      }`}>
        <Activity className="w-10 h-10 text-slate-400 mx-auto mb-3 animate-pulse" />
        <h3 className={`text-base font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Watchlist is Empty
        </h3>
        <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Add Indian stocks to your watchlist from the catalog to start tracking meaningful market changes.
        </p>
      </div>
    );
  }

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-xl transition-all ${
      isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
    }`}>
      
      {/* Table Header */}
      <div className={`px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
        isLight ? 'border-[#E5D6CE]/80 bg-[#FFFFFF]' : 'border-slate-800 bg-[#121826]'
      }`}>
        <div>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <span>NSE / BSE Stocks Ranked by Attention Priority</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium border ${
              isLight ? 'bg-[#D2DCE4]/60 text-slate-800 border-[#DEC3B3]' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {items.length} Tracked
            </span>
          </h3>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Showing exact rupee price changes (₹) and explanations since {baselineTimeDescription}.
          </p>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${
              isLight 
                ? 'border-[#E5D6CE] bg-[#E7EBEE]/60 text-slate-600' 
                : 'border-slate-800/80 bg-slate-900/50 text-slate-400'
            }`}>
              <th className="py-3 px-4 font-semibold">Stock</th>
              <th className="py-3 px-4 font-semibold text-right">LTP (₹)</th>
              <th className="py-3 px-4 font-semibold text-right">Change ({baselineTimeDescription})</th>
              <th className="py-3 px-4 font-semibold text-center">Attention Level</th>
              <th className="py-3 px-4 font-semibold text-center">Trend (12h)</th>
              <th className="py-3 px-4 font-semibold">Why It Changed</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${
            isLight ? 'divide-[#E5D6CE]/60' : 'divide-slate-800/50'
          }`}>
            {items.map((item, index) => {
              const deltaPct = typeof item.price_delta_pct === 'number' ? item.price_delta_pct : (typeof item.delta_pct === 'number' ? item.delta_pct : 0);
              const deltaAbs = typeof item.price_delta_abs === 'number' ? item.price_delta_abs : (typeof item.delta_price === 'number' ? item.delta_price : 0);
              const currPrice = typeof item.current_price === 'number' ? item.current_price : (typeof item.price === 'number' ? item.price : 0);
              const isPositive = deltaPct >= 0;
              const mcs = item.meaningful_change_score || 0;
              const isHighAttention = mcs >= 70;
              const isMediumAttention = mcs >= 45 && mcs < 70;
              const displayTicker = (item.display_ticker || item.ticker || '').replace('.NS', '');

              return (
                <tr
                  key={item.ticker || index}
                  className={`transition group ${
                    isHighAttention 
                      ? isLight ? 'bg-rose-50/50 hover:bg-rose-50' : 'bg-rose-950/10 hover:bg-rose-950/20'
                      : isLight ? 'hover:bg-[#F8F2EF]' : 'hover:bg-slate-800/40'
                  }`}
                >
                  
                  {/* Stock Symbol & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${
                        isHighAttention
                          ? isLight ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : isMediumAttention
                          ? isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : isLight ? 'bg-[#E7EBEE] text-slate-800 border-[#D2DCE4]' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectTicker(item.ticker)}
                            className={`font-bold font-mono text-sm tracking-tight transition flex items-center gap-1 hover:underline ${
                              isLight ? 'text-slate-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
                            }`}
                          >
                            {displayTicker}
                            <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>NSE</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition" />
                          </button>
                          {item.ripple_info && (
                            <span
                              title={item.ripple_info.exposure_note}
                              className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                                isLight ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              }`}
                            >
                              Ripple Alert
                            </span>
                          )}
                        </div>
                        <div className={`text-xs truncate max-w-[160px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Current Price in Rupees */}
                  <td className={`py-3.5 px-4 text-right font-mono font-semibold ${
                    isLight ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    ₹{currPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Price Change */}
                  <td className="py-3.5 px-4 text-right font-mono">
                    <div className={`inline-flex items-center gap-0.5 font-bold ${
                      isPositive 
                        ? isLight ? 'text-emerald-700' : 'text-emerald-400' 
                        : isLight ? 'text-rose-700' : 'text-rose-400'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span>{isPositive ? '+' : ''}{deltaPct.toFixed(2)}%</span>
                    </div>
                    <div className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      {deltaAbs > 0 ? '+' : ''}₹{deltaAbs.toFixed(2)}
                    </div>
                  </td>

                  {/* Attention Level Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block text-xs font-mono font-semibold px-2.5 py-1 rounded-full border ${
                      isHighAttention
                        ? isLight ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : isMediumAttention
                        ? isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : isLight ? 'bg-[#E7EBEE] text-slate-700 border-[#D2DCE4]' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {item.urgency_level === 'CRITICAL_ANOMALY' ? '🚨 High Alert' : item.urgency_level === 'MEANINGFUL_CHANGE' ? '⚠️ Notable' : 'Normal'}
                    </span>
                  </td>

                  {/* Mini Sparkline */}
                  <td className="py-3.5 px-4">
                    <div className="w-20 h-6 mx-auto flex items-center justify-center">
                      <SparklineGraph data={item.sparkline} isPositive={isPositive} isLight={isLight} />
                    </div>
                  </td>

                  {/* Plain English Reason */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className={`text-xs leading-snug line-clamp-2 ${
                      isLight ? 'text-slate-800' : 'text-slate-200'
                    }`} title={item.explanation}>
                      {item.explanation}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectTicker(item.ticker)}
                        title="View Supply Chain & Peer Graph"
                        className={`p-1.5 rounded-lg border transition ${
                          isLight 
                            ? 'bg-[#E7EBEE] hover:bg-[#D2DCE4] text-slate-700 border-[#D2DCE4]' 
                            : 'bg-slate-800 hover:bg-blue-600/30 text-slate-400 hover:text-blue-300 border-slate-700'
                        }`}
                      >
                        <GitFork className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveTicker(item.ticker)}
                        title="Remove from watchlist"
                        className={`p-1.5 rounded-lg border transition ${
                          isLight 
                            ? 'bg-[#E7EBEE] hover:bg-rose-100 text-slate-700 hover:text-rose-600 border-[#D2DCE4]' 
                            : 'bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-300 border-slate-700'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// Mini SVG Sparkline Component
function SparklineGraph({ data, isPositive, isLight }) {
  if (!data || data.length < 2) {
    return <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>-</span>;
  }

  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * 75;
    const y = 20 - ((p - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = isPositive 
    ? isLight ? '#059669' : '#34D399' 
    : isLight ? '#E11D48' : '#F43F5E';

  return (
    <svg width="75" height="22" className="overflow-visible">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
