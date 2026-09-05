import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Database, 
  Sliders, 
  Cpu, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Info,
  TrendingUp,
  Sun,
  Moon,
  Compass,
  Palette,
  Sparkles
} from 'lucide-react';
import { fetchSettings, saveSettings } from '../api';

export default function SettingsView({ 
  dataStatus,
  theme = 'light',
  onToggleTheme,
  onOpenTour,
  onOpenDbExplorer
}) {
  const [provider, setProvider] = useState('hybrid');
  const [angelOneKey, setAngelOneKey] = useState('');
  const [zerodhaKey, setZerodhaKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const isLight = theme === 'light';

  useEffect(() => {
    async function load() {
      try {
        const s = await fetchSettings();
        if (s) {
          if (s.data_provider) setProvider(s.data_provider);
          if (s.gemini_api_key) setGeminiKey(s.gemini_api_key);
          if (s.angel_one_key) setAngelOneKey(s.angel_one_key);
          if (s.zerodha_key) setZerodhaKey(s.zerodha_key);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoadingSettings(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await saveSettings({
        data_provider: provider,
        gemini_api_key: geminiKey.trim(),
        angel_one_key: angelOneKey.trim(),
        zerodha_key: zerodhaKey.trim()
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className={`border rounded-3xl p-6 shadow-xl transition-all ${
        isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
      }`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs ${
              isLight ? 'bg-[#E7EBEE] border-[#D2DCE4] text-blue-600' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
            }`}>
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                System Settings & Configuration
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Configure theme appearance, live Indian market streaming, optional AI summaries, and inspect SQLite.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDbExplorer}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                isLight ? 'bg-[#E7EBEE] hover:bg-[#D2DCE4] text-slate-800 border-[#DEC3B3]' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Inspect Database</span>
            </button>

            <button
              onClick={onOpenTour}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                isLight ? 'bg-[#E7EBEE] hover:bg-[#D2DCE4] text-slate-800 border-[#DEC3B3]' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-500" />
              <span>Launch Tour</span>
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          Preferences, API keys, and market configuration persisted successfully!
        </div>
      )}

      {/* Theme Appearance Card */}
      <div className={`border rounded-3xl p-6 shadow-xl space-y-5 transition-all ${
        isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
      }`}>
        <div>
          <h3 className={`text-base font-bold flex items-center gap-2 mb-1 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <Palette className="w-4 h-4 text-blue-500" />
            Display Theme & Color Palette
          </h3>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Choose between the default calming Seaside Escape pastel palette or Midnight Dark mode.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Option 1: Seaside Escape Light Theme */}
          <div 
            onClick={isLight ? undefined : onToggleTheme}
            className={`p-5 rounded-2xl border cursor-pointer transition shadow-xs ${
              isLight 
                ? 'bg-[#F8F2EF] border-blue-500 ring-2 ring-blue-500/20 text-slate-900' 
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Seaside Escape (Default Light)</span>
              </div>
              {isLight && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono font-bold">Active</span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Warm linen paper base (#F8F2EF), dusty blue-gray cards (#E7EBEE), and soft rose-taupe borders (#DEC3B3).
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-6 h-6 rounded-lg bg-[#F8F2EF] border border-[#DEC3B3]" title="#F8F2EF Base" />
              <span className="w-6 h-6 rounded-lg bg-[#E7EBEE] border border-[#DEC3B3]" title="#E7EBEE Surface" />
              <span className="w-6 h-6 rounded-lg bg-[#DEC3B3] border border-[#DEC3B3]" title="#DEC3B3 Accent" />
              <span className="w-6 h-6 rounded-lg bg-[#D2DCE4] border border-[#DEC3B3]" title="#D2DCE4 Soft Blue" />
            </div>
          </div>

          {/* Option 2: Midnight Dark Theme */}
          <div 
            onClick={!isLight ? undefined : onToggleTheme}
            className={`p-5 rounded-2xl border cursor-pointer transition shadow-xs ${
              !isLight 
                ? 'bg-[#121826] border-blue-500 ring-2 ring-blue-500/20 text-white' 
                : 'bg-[#E7EBEE]/60 border-[#D2DCE4] text-slate-700 hover:border-[#DEC3B3]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Midnight Nexus (Dark)</span>
              </div>
              {!isLight && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono font-bold">Active</span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Deep oceanic dark palette designed for low-light environments and night sessions.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-6 h-6 rounded-lg bg-[#0B0F17] border border-slate-700" title="#0B0F17" />
              <span className="w-6 h-6 rounded-lg bg-[#121826] border border-slate-700" title="#121826" />
              <span className="w-6 h-6 rounded-lg bg-[#1E293B] border border-slate-700" title="#1E293B" />
              <span className="w-6 h-6 rounded-lg bg-[#3B82F6] border border-slate-700" title="#3B82F6" />
            </div>
          </div>

        </div>
      </div>

      {/* Indian Market Data & AI Intelligence Settings */}
      <div className={`border rounded-3xl p-6 shadow-xl space-y-6 transition-all ${
        isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-[#121826] border-slate-800'
      }`}>
        <div>
          <h3 className={`text-base font-bold flex items-center gap-2 mb-1 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <Database className="w-4 h-4 text-blue-500" />
            Active Market Data Engine
          </h3>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Currently streaming Indian Equities (NSE/BSE) in Indian Rupees (₹). Status: <strong>{dataStatus}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div 
            onClick={() => setProvider('hybrid')}
            className={`p-4 rounded-2xl border cursor-pointer transition ${
              provider === 'hybrid'
                ? isLight ? 'bg-[#E7EBEE] border-blue-500 text-slate-900 ring-2 ring-blue-500/20' : 'bg-blue-600/15 border-blue-500/50 text-white'
                : isLight ? 'bg-[#F8F2EF] border-[#E5D6CE] text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm">NSE Live Hybrid</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono font-bold">Active</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Live NSE stock prices via yfinance (.NS) with mathematical micro-drift fallback when markets are closed.
            </p>
          </div>

          <div 
            onClick={() => setProvider('angelone')}
            className={`p-4 rounded-2xl border cursor-pointer transition opacity-90 ${
              provider === 'angelone'
                ? isLight ? 'bg-[#E7EBEE] border-blue-500 text-slate-900 ring-2 ring-blue-500/20' : 'bg-blue-600/15 border-blue-500/50 text-white'
                : isLight ? 'bg-[#F8F2EF] border-[#E5D6CE] text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm">Angel One SmartAPI</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">Planned</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Direct WebSocket connection to NSE/BSE ticks with low latency. Direct order execution.
            </p>
          </div>

          <div 
            onClick={() => setProvider('zerodha')}
            className={`p-4 rounded-2xl border cursor-pointer transition opacity-90 ${
              provider === 'zerodha'
                ? isLight ? 'bg-[#E7EBEE] border-blue-500 text-slate-900 ring-2 ring-blue-500/20' : 'bg-blue-600/15 border-blue-500/50 text-white'
                : isLight ? 'bg-[#F8F2EF] border-[#E5D6CE] text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm">Zerodha Kite Connect</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">Planned</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Official Kite Connect v3 market streaming API for live tick-by-tick orderbook depth.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          
          {/* Optional Gemini LLM Key */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 to-indigo-900/10 border border-blue-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Sparkles className="w-4 h-4 text-blue-500" />
                Google Gemini API Key (Optional AI Briefing Synthesizer)
              </label>
              {geminiKey ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  AI Summaries Active
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-500/10 text-slate-500 font-semibold">
                  Deterministic Rule Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When configured, the executive catch-up is augmented with natural-language macroeconomic narrative by Gemini 1.5 Flash. When blank, the system runs in zero-latency deterministic rule mode.
            </p>
            <input
              type="password"
              placeholder="AIzaSy... (Paste Google Gemini API Key)"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className={`w-full border rounded-2xl px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isLight ? 'bg-white border-[#DEC3B3] text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Angel One SmartAPI API Key
              </label>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Coming Soon: Direct Order Placement & WebSockets
              </span>
            </div>
            <input
              type="password"
              placeholder="Paste Angel One API Key (Optional)..."
              value={angelOneKey}
              onChange={(e) => setAngelOneKey(e.target.value)}
              className={`w-full border rounded-2xl px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isLight ? 'bg-[#F8F2EF] border-[#DEC3B3] text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Zerodha Kite Connect API Key
              </label>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Coming Soon: Direct Order Placement & WebSockets
              </span>
            </div>
            <input
              type="password"
              placeholder="Paste Zerodha API Key (Optional)..."
              value={zerodhaKey}
              onChange={(e) => setZerodhaKey(e.target.value)}
              className={`w-full border rounded-2xl px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isLight ? 'bg-[#F8F2EF] border-[#DEC3B3] text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-500/20"
          >
            Save Configuration
          </button>
        </form>
      </div>

    </div>
  );
}
