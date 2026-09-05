import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Flame, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  Activity 
} from 'lucide-react';
import { injectMarketShock } from '../api';

export default function ShockSimulatorModal({
  onClose,
  onShockInjected
}) {
  const [injecting, setInjecting] = useState(false);
  const [result, setResult] = useState(null);

  const shockScenarios = [
    {
      id: "TATAMOTORS_EV_SURGE",
      title: "Tata Motors Gigafactory & EV Dispatches Beat",
      ticker: "TATAMOTORS.NS",
      impact: "+5.8% (Surge of ~₹57) & 3.8x Volume",
      direction: "BULLISH",
      desc: "Simulates an unexpected surge in monthly EV deliveries and JLR orders. Watch Tata Power and Auto ecosystem light up with positive supply contagion.",
      badge: "Tata Group Synergy"
    },
    {
      id: "RBI_RATE_PAUSE",
      title: "RBI MPC Policy Rate Pause & Liquidity Boost",
      ticker: "HDFCBANK.NS",
      impact: "+3.4% (Surge of ~₹55) in Bank Nifty",
      direction: "BULLISH",
      desc: "Simulates RBI keeping repo rate steady with banking liquidity support. HDFC Bank, ICICI Bank, and SBI rally on margin expansion.",
      badge: "RBI Monetary Policy"
    },
    {
      id: "RELIANCE_JIO_TARIFF",
      title: "Reliance Jio 5G Postpaid Tariff Hike",
      ticker: "RELIANCE.NS",
      impact: "+4.2% (Surge of ~₹125) & 3.2x Volume",
      direction: "BULLISH",
      desc: "Simulates a nationwide 15% tariff increase boosting telecom ARPU. Triggers competitive reactions with Bharti Airtel.",
      badge: "Telecom Re-rating"
    },
    {
      id: "INFY_GLOBAL_DEAL",
      title: "Infosys $1.5B Mega European GenAI Deal",
      ticker: "INFY.NS",
      impact: "+4.6% (Surge of ~₹80) & 3.4x Volume",
      direction: "BULLISH",
      desc: "Simulates a massive multi-year cloud & GenAI contract win. Pushes Nifty IT index higher and creates competitive pressure on TCS.",
      badge: "IT Export Catalyst"
    }
  ];

  const handleInject = async (shockId) => {
    setInjecting(true);
    setResult(null);
    try {
      const res = await injectMarketShock(shockId);
      setResult(res);
      setTimeout(() => {
        onShockInjected();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to inject shock", err);
      alert("Failed to inject simulation event.");
    } finally {
      setInjecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#121826] border border-amber-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-amber-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Indian Market Shock Simulator</h2>
              <p className="text-xs text-slate-400 font-sans">
                Inject real-time NSE catalyst events to test Indian knowledge graph ripples & dynamic re-ranking live.
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

        {/* Shock List */}
        <div className="p-6 space-y-3">
          {result && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Injected <strong>{result.ticker.replace('.NS', '')}</strong> shock! Recalculating watchlist graph...</span>
            </div>
          )}

          <div className="space-y-3">
            {shockScenarios.map((s) => {
              const isBullish = s.direction === 'BULLISH';
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{s.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                      <span className="text-slate-300 font-bold">Target: {s.ticker.replace('.NS', '')}</span>
                      <span className={`font-semibold ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {s.impact}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInject(s.id)}
                    disabled={injecting}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                      isBullish
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Trigger Shock</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
