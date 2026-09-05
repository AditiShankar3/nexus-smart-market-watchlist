import React, { useEffect, useState } from 'react';
import { 
  X, 
  GitFork, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  ShieldAlert, 
  Layers, 
  Building2, 
  Zap, 
  ExternalLink 
} from 'lucide-react';
import { fetchTickerDeepDive } from '../api';

export default function StockDetailModal({
  ticker,
  onClose,
  onSelectTicker
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    fetchTickerDeepDive(ticker)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load ticker deep dive", err);
        setLoading(false);
      });
  }, [ticker]);

  if (!ticker) return null;

  const meta = data?.metadata || {};
  const quote = data?.quote || {};
  const isPositive = (quote.change_pct || 0) >= 0;
  const displayTicker = ticker.replace('.NS', '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#121826] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between sticky top-0 bg-[#121826]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 font-mono font-bold text-sm flex items-center justify-center border border-blue-500/30">
              {displayTicker}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{meta.name || displayTicker}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                  NSE Listed
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {meta.sector} • Benchmark: <strong className="text-slate-300">{meta.sector_etf?.replace('.NS', '') || 'NIFTY'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {loading ? (
            <div className="py-16 text-center">
              <Activity className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-mono">Analyzing Indian market knowledge graph neighborhood...</p>
            </div>
          ) : (
            <>
              {/* Snapshot Banner in INR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Current Price (LTP)</div>
                  <div className="text-lg font-mono font-bold text-white">
                    ₹{quote.price ? quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Day Change</div>
                  <div className={`text-lg font-mono font-bold flex items-center gap-1 ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{quote.change_pct ? `${isPositive ? '+' : ''}${quote.change_pct.toFixed(2)}%` : '0.00%'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Relative Vol (RVOL)</div>
                  <div className="text-lg font-mono font-bold text-amber-400">
                    {quote.rvol ? `${quote.rvol.toFixed(1)}x` : '1.0x'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Market Cap</div>
                  <div className="text-lg font-mono font-bold text-blue-400">
                    {meta.market_cap ? `₹${(meta.market_cap / 100000).toFixed(2)}L Cr` : '-'}
                  </div>
                </div>
              </div>

              {/* Company Description */}
              {meta.description && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-sm text-slate-300 leading-relaxed">
                  {meta.description}
                </div>
              )}

              {/* Indian Graph Neighborhood: Supply Chain & Competitors */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-purple-400" />
                  Indian Supply Chain & Group Synergies
                </h3>

                {/* Upstream Suppliers */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-2">
                    Upstream Key Suppliers & Tech Enablers
                  </span>
                  {data.suppliers && data.suppliers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {data.suppliers.map(sup => (
                        <div
                          key={sup.ticker}
                          onClick={() => onSelectTicker(sup.ticker)}
                          className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-mono font-bold text-white text-sm group-hover:text-blue-400 transition">
                              {sup.ticker.replace('.NS', '')}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{sup.description}</div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No direct single-source upstream supplier nodes mapped.</p>
                  )}
                </div>

                {/* Downstream Customers */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
                    Downstream Buyers & Ecosystem Synergy
                  </span>
                  {data.customers && data.customers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {data.customers.map(cust => (
                        <div
                          key={cust.ticker}
                          onClick={() => onSelectTicker(cust.ticker)}
                          className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-mono font-bold text-white text-sm group-hover:text-emerald-400 transition">
                              {cust.ticker.replace('.NS', '')}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{cust.description}</div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Broad retail consumer demand or diversified clients.</p>
                  )}
                </div>

                {/* Competitors */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-2">
                    Direct Competitors & Rival Duopolies
                  </span>
                  {data.competitors && data.competitors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {data.competitors.map(comp => (
                        <div
                          key={comp.ticker}
                          onClick={() => onSelectTicker(comp.ticker)}
                          className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-mono font-bold text-white text-sm group-hover:text-rose-400 transition">
                              {comp.ticker.replace('.NS', '')}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{comp.description}</div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Diversified market leadership.</p>
                  )}
                </div>

              </div>

              {/* News / Catalyst Event */}
              {quote.news_event && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    Latest Active Catalyst Headline
                  </div>
                  <p className="text-sm font-medium text-amber-200">
                    {quote.news_event}
                  </p>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
