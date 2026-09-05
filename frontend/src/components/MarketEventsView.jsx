import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Zap, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Activity, 
  ShieldAlert,
  GitFork,
  Radio
} from 'lucide-react';
import { fetchMarketEvents } from '../api';

export default function MarketEventsView({ 
  onSelectTicker,
  theme = 'light'
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLight = theme === 'light';

  useEffect(() => {
    fetchMarketEvents()
      .then(res => {
        setEvents(res.events || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load events", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={`border rounded-2xl p-12 text-center shadow-lg ${
        isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
      }`}>
        <Activity className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
        <p className={`text-sm font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Aggregating market catalysts & breaking events...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className={`border rounded-2xl p-6 shadow-xl transition-all ${
        isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
      }`}>
        
        {/* Header Bar */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
          isLight ? 'border-[#E5D6CE]/80' : 'border-slate-800'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-semibold uppercase tracking-wider border ${
                isLight 
                  ? 'bg-[#DEC3B3]/40 text-amber-900 border-[#DEC3B3]'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}>
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                Market Events & Catalysts
              </span>
            </div>
            <h3 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Real-Time Shockwaves, Earnings & Macro Headlines
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Live catalytic news events mapped directly to stock nodes in the Knowledge Graph.
            </p>
          </div>
          
          <span className={`text-xs font-mono px-3 py-1.5 rounded-xl border self-start sm:self-auto ${
            isLight ? 'bg-[#E7EBEE] text-slate-600 border-[#D2DCE4]' : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}>
            {events.length} Active Events Logged
          </span>
        </div>

        {/* Events Feed (Clean list with NO text overlaps) */}
        <div className={`divide-y mt-2 ${isLight ? 'divide-[#E5D6CE]/60' : 'divide-slate-800/80'}`}>
          {events.map((evt, idx) => {
            const isPositive = evt.change_pct >= 0;
            const isHighSeverity = evt.severity >= 0.7;
            const displayTicker = evt.ticker.replace('.NS', '');

            return (
              <div 
                key={idx}
                className={`py-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group rounded-xl px-2.5 ${
                  isLight ? 'hover:bg-[#F8F2EF]' : 'hover:bg-slate-800/40'
                }`}
              >
                {/* Left: Clean Badge + Content */}
                <div className="flex items-start gap-3.5 min-w-0">
                  
                  {/* Clean Non-Overlapping Stock Badge */}
                  <div className={`px-2.5 py-1.5 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border shadow-xs min-w-[75px] text-center ${
                    isHighSeverity
                      ? isLight ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : isLight ? 'bg-[#E7EBEE] text-slate-800 border-[#D2DCE4]' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {displayTicker}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <button
                        onClick={() => onSelectTicker(evt.ticker)}
                        className={`font-bold font-mono text-sm transition hover:underline ${
                          isLight ? 'text-slate-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
                        }`}
                      >
                        {evt.ticker}
                      </button>
                      <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isHighSeverity && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isLight ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          High Severity
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium leading-relaxed ${
                      isLight ? 'text-slate-700' : 'text-slate-200'
                    }`}>
                      {evt.headline}
                    </p>
                  </div>
                </div>

                {/* Right: Metrics & Inspection Button */}
                <div className="flex items-center gap-4 self-end sm:self-center font-mono text-xs shrink-0">
                  <div className="text-right">
                    <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Price Move</div>
                    <div className={`font-bold flex items-center gap-0.5 ${
                      isPositive 
                        ? isLight ? 'text-emerald-700' : 'text-emerald-400'
                        : isLight ? 'text-rose-700' : 'text-rose-400'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{isPositive ? '+' : ''}{evt.change_pct.toFixed(2)}%</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>RVOL</div>
                    <div className={`font-bold ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                      {evt.rvol.toFixed(1)}x
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTicker(evt.ticker)}
                    className={`p-2 rounded-xl border transition ${
                      isLight 
                        ? 'bg-[#E7EBEE] hover:bg-[#D2DCE4] text-slate-700 border-[#D2DCE4]'
                        : 'bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border-slate-700'
                    }`}
                    title="View Graph Neighborhood"
                  >
                    <GitFork className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
