import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Info,
  TrendingDown, 
  TrendingUp, 
  Radio, 
  UserCheck,
  Zap,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function CatchUpHeader({
  currentUser,
  briefing,
  baselineMode,
  baselineTimeDescription,
  isNewUser = false,
  onSelectBaseline,
  onSelectTicker,
  onStartTour,
  theme = 'light',
  loading
}) {
  if (!briefing) return null;

  const isLight = theme === 'light';

  const guestPresets = [
    { id: '1h', label: 'Past 1 Hour', desc: 'Summary of the last 60 minutes' },
    { id: '3h', label: 'Past 3 Hours', desc: 'General summary of past 3 hours' },
    { id: '5h', label: 'Past 5 Hours', desc: 'General summary of past 5 hours' },
    { id: 'market_open', label: 'Market Open', desc: 'Since 9:15 AM opening bell' },
    { id: 'yesterday', label: 'Yesterday Close', desc: 'Since previous NSE closing bell' }
  ];

  const isUserLoggedIn = Boolean(currentUser);
  const showLastLogoutButton = isUserLoggedIn && !isNewUser;

  return (
    <section className={`border rounded-3xl p-5 md:p-7 shadow-xl relative overflow-hidden transition-all ${
      isLight 
        ? 'bg-[#FFFFFF] border-[#E5D6CE] text-[#1E293B]' 
        : 'bg-gradient-to-b from-[#121826] to-[#0D121F] border-slate-800 text-slate-100'
    }`}>
      
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 ${
        isLight ? 'bg-[#DEC3B3]/30' : 'bg-blue-600/5'
      }`}></div>

      <div className="relative z-10 space-y-6">
        
        {/* Top Bar: Personalized Welcome / First Visit / Guest Selection */}
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b ${
          isLight ? 'border-[#E5D6CE]/80' : 'border-slate-800/80'
        }`}>
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-semibold uppercase tracking-wider border ${
                isLight 
                  ? 'bg-[#D2DCE4]/50 text-blue-900 border-[#DEC3B3]'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                {isNewUser ? 'First Visit Overview' : isUserLoggedIn ? 'Personalized Session Delta' : 'General Market Summary'}
              </span>

              {isNewUser ? (
                <span className={`text-xs flex items-center gap-1 font-medium px-2.5 py-0.5 rounded-md border ${
                  isLight 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}>
                  ✨ New Profile Initialized • Comparing against {baselineTimeDescription}
                </span>
              ) : isUserLoggedIn ? (
                <span className={`text-xs flex items-center gap-1 font-medium px-2.5 py-0.5 rounded-md border ${
                  isLight 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  <UserCheck className="w-3.5 h-3.5" />
                  Synced to your previous logout: <strong>{baselineTimeDescription}</strong>
                </span>
              ) : (
                <span className={`text-xs flex items-center gap-1 px-2.5 py-0.5 rounded-md border ${
                  isLight 
                    ? 'bg-[#E7EBEE] text-slate-700 border-[#D2DCE4]' 
                    : 'bg-slate-900/60 text-slate-400 border-slate-800'
                }`}>
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Comparing against: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{baselineTimeDescription}</strong>
                </span>
              )}
            </div>

            <h2 className={`text-xl md:text-2xl font-bold tracking-tight leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {briefing.personalized_greeting ? `${briefing.personalized_greeting} ` : ''}
              {briefing.headline}
            </h2>
          </div>

          {/* Timeframe Selector Scrubber */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 self-start lg:self-auto">
            <div className={`flex items-center gap-1 p-1.5 rounded-2xl border overflow-x-auto max-w-full ${
              isLight ? 'bg-[#E7EBEE] border-[#D2DCE4]' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <span className={`text-[11px] font-mono uppercase px-2 hidden sm:inline-block ${
                isLight ? 'text-slate-500' : 'text-slate-500'
              }`}>
                Timeframe:
              </span>
              
              {showLastLogoutButton && (
                <button
                  onClick={() => onSelectBaseline('last_visit')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    baselineMode === 'last_visit'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : isLight 
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-[#D2DCE4]/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  My Last Logout
                </button>
              )}

              {guestPresets.map(preset => {
                const isActive = baselineMode === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectBaseline(preset.id)}
                    title={preset.desc}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-[#D2DCE4]/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Executive Bullets (Clean & Structured Alignment) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Key Takeaways (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                Why It Changed (Plain-English Explanations)
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                {briefing.critical_count} critical • {briefing.meaningful_count} notable
              </span>
            </div>

            {briefing.bullets && briefing.bullets.length > 0 ? (
              <div className="space-y-3">
                {briefing.bullets.map((bullet, idx) => {
                  const isCritical = bullet.urgency === 'CRITICAL_ANOMALY';
                  const isMeaningful = bullet.urgency === 'MEANINGFUL_CHANGE';
                  const isPositive = (bullet.price_delta_pct || 0) >= 0;
                  const displayTicker = bullet.display_ticker || (bullet.ticker ? bullet.ticker.replace('.NS', '') : `STOCK ${idx + 1}`);

                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectTicker && bullet.ticker && onSelectTicker(bullet.ticker)}
                      className={`p-4 md:p-5 rounded-2xl border transition cursor-pointer group shadow-sm ${
                        isCritical
                          ? isLight ? 'bg-rose-50/70 hover:bg-rose-50 border-rose-200 text-rose-950' : 'bg-rose-950/20 hover:bg-rose-950/30 border-rose-500/30 text-rose-100'
                          : isMeaningful
                          ? isLight ? 'bg-amber-50/70 hover:bg-amber-50 border-amber-200 text-amber-950' : 'bg-amber-950/15 hover:bg-amber-950/25 border-amber-500/30 text-slate-200'
                          : isLight ? 'bg-[#FFFFFF] hover:bg-[#F8F2EF] border-[#E5D6CE] text-slate-800' : 'bg-slate-900/60 hover:bg-slate-900/80 border-slate-800 text-slate-200'
                      }`}
                    >
                      {/* Top Row: Stock Badge, Company Name, Sector, Urgency, Price Delta */}
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b ${
                        isLight ? 'border-[#E5D6CE]' : 'border-slate-800/80'
                      }`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg border shadow-2xs ${
                            isLight ? 'bg-[#E7EBEE] text-slate-900 border-[#D2DCE4]' : 'bg-slate-800 text-white border-slate-700'
                          }`}>
                            {displayTicker}
                          </span>
                          <span className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            {bullet.name}
                          </span>
                          {bullet.sector && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              isLight ? 'bg-[#DEC3B3]/40 text-slate-700 border-[#DEC3B3]' : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {bullet.sector}
                            </span>
                          )}

                          {isCritical ? (
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              isLight ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}>
                              🚨 Critical Anomaly
                            </span>
                          ) : isMeaningful ? (
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              isLight ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}>
                              ⚠️ Notable Shift
                            </span>
                          ) : null}
                        </div>

                        {/* Price & Delta Badge */}
                        {bullet.current_price !== undefined && (
                          <div className="flex items-center gap-2 self-start sm:self-auto font-mono">
                            <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              ₹{bullet.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-0.5 border ${
                              isPositive
                                ? isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : isLight ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              <span>{isPositive ? '+' : ''}{bullet.price_delta_pct.toFixed(2)}%</span>
                              {bullet.price_delta_abs !== undefined && (
                                <span className="opacity-90">({bullet.price_delta_abs > 0 ? '+' : ''}₹{bullet.price_delta_abs.toFixed(2)})</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Row: Categorized Reason Chips */}
                      {bullet.structured_reasons && bullet.structured_reasons.length > 0 ? (
                        <div className="space-y-2">
                          {bullet.structured_reasons.map((reason, rIdx) => {
                            let tagStyle = isLight 
                              ? "bg-[#D2DCE4]/60 text-slate-800 border-[#DEC3B3]" 
                              : "bg-blue-500/10 text-blue-300 border-blue-500/30";
                            let icon = <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />;

                            if (reason.type === 'divergence') {
                              tagStyle = isLight ? "bg-purple-100 text-purple-900 border-purple-200" : "bg-purple-500/10 text-purple-300 border-purple-500/30";
                              icon = <TrendingDown className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
                            } else if (reason.type === 'volume') {
                              tagStyle = isLight ? "bg-amber-100 text-amber-900 border-amber-200" : "bg-amber-500/10 text-amber-300 border-amber-500/30";
                              icon = <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
                            } else if (reason.type === 'catalyst') {
                              tagStyle = isLight ? "bg-emerald-100 text-emerald-900 border-emerald-200" : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
                              icon = <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
                            } else if (reason.type === 'ripple') {
                              tagStyle = isLight ? "bg-indigo-100 text-indigo-900 border-indigo-200" : "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
                              icon = <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
                            } else if (reason.type === 'volatility') {
                              tagStyle = isLight ? "bg-rose-100 text-rose-900 border-rose-200" : "bg-rose-500/10 text-rose-300 border-rose-500/30";
                              icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
                            }

                            return (
                              <div key={rIdx} className="flex items-start gap-2.5 text-xs leading-relaxed">
                                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider border shrink-0 flex items-center gap-1 shadow-2xs ${tagStyle}`}>
                                  {icon}
                                  {reason.label}
                                </span>
                                <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                                  {reason.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className={`text-xs font-medium leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          {bullet.explanation}
                        </p>
                      )}

                      {/* Card Action Link */}
                      <div className="pt-2 mt-2 flex items-center justify-end text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition">
                        <span>Inspect Knowledge Graph & Peer Group</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border text-sm flex items-center gap-3 ${
                isLight ? 'bg-[#FFFFFF] border-[#E5D6CE] text-slate-600' : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}>
                <Info className="w-5 h-5 text-blue-500 shrink-0" />
                <span>All tracked stocks are trading steadily. No unusual price swings or sector divergences detected.</span>
              </div>
            )}
          </div>

          {/* Right Metrics Card (Right 4 cols) */}
          <div className={`lg:col-span-4 border rounded-2xl p-5 flex flex-col justify-between shadow-sm ${
            isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider block mb-3.5 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Market Pulse Summary
              </span>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-[#E7EBEE]/70 border-[#D2DCE4]' : 'bg-slate-800/50 border-slate-700/50'
                }`}>
                  <div className={`text-[11px] mb-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Watchlist Direction</div>
                  <div className={`text-xs font-bold flex items-center gap-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {briefing.overall_market_mood === 'BULLISH_EXPANSION' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                    {briefing.overall_market_mood === 'BEARISH_CONTRACTION' && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                    {briefing.overall_market_mood?.replace('_', ' ')}
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-[#E7EBEE]/70 border-[#D2DCE4]' : 'bg-slate-800/50 border-slate-700/50'
                }`}>
                  <div className={`text-[11px] mb-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Avg Watchlist Δ</div>
                  <div className={`text-sm font-mono font-bold ${
                    briefing.average_watchlist_delta >= 0 
                      ? isLight ? 'text-emerald-700' : 'text-emerald-400'
                      : isLight ? 'text-rose-700' : 'text-rose-400'
                  }`}>
                    {briefing.average_watchlist_delta > 0 ? '+' : ''}{briefing.average_watchlist_delta}%
                  </div>
                </div>
              </div>

              <div className={`text-xs leading-relaxed space-y-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {isNewUser ? (
                  <p>
                    Welcome to your first session! As you trade and browse, your exact exit prices will be stored when you leave this tab.
                  </p>
                ) : isUserLoggedIn ? (
                  <p>
                    Comparing against your stored prices from <strong>{baselineTimeDescription}</strong>.
                  </p>
                ) : (
                  <p>
                    Viewing <strong>{baselineTimeDescription}</strong>. Sign in anytime to track return visits with zero hallucination.
                  </p>
                )}
              </div>
            </div>

            <div className={`pt-4 mt-4 border-t text-[11px] flex items-center justify-between font-mono ${
              isLight ? 'border-[#E5D6CE] text-slate-500' : 'border-slate-800 text-slate-500'
            }`}>
              <span>Zero Hallucinations</span>
              <span className={isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400'}>100% Exact Math</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
