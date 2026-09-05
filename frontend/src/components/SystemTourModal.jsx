import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  GitFork, 
  Clock, 
  Layers, 
  Zap, 
  TrendingUp,
  Bookmark,
  Sun,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function SystemTourModal({
  isOpen,
  onClose,
  theme = 'light'
}) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  const tourSteps = [
    {
      stepNumber: 1,
      badge: "Zero-Hallucination Session Deltas",
      title: "Know Exactly What Changed While You Were Away",
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      description: "When you close this tab or log out, Nexus uses the browser Beacon API to freeze and record the exact Rupee (₹) price of every stock on your screen. When you return, the Executive Catch-Up diffs current market prices against your exact exit second—with 100% mathematical precision.",
      highlightPoints: [
        "Automatic background exit price logging on tab close",
        "Plain-English explanation cards for price swings & sector divergences",
        "Timeframe scrubber to view 1h, 3h, 5h, Market Open, or Your Last Logout"
      ],
      color: "from-blue-600 to-indigo-600"
    },
    {
      stepNumber: 2,
      badge: "Relational Supply Chain Topology",
      title: "Market Knowledge Graph & Shockwave Ripples",
      icon: <GitFork className="w-6 h-6 text-purple-500" />,
      description: "Stocks don't move in isolation. Nexus connects 150+ Indian equities with multi-year relational edges: upstream suppliers, downstream buyers, competitor duopolies, and conglomerate group ties (Tata, Adani, Reliance, PSU).",
      highlightPoints: [
        "Upstream suppliers (e.g. Tata Power supplying EV infrastructure to Tata Motors)",
        "Direct competitor duopolies (e.g. Reliance Jio vs Bharti Airtel)",
        "Automated ripple propagation when news breaks on a peer stock"
      ],
      color: "from-purple-600 to-pink-600"
    },
    {
      stepNumber: 3,
      badge: "150+ Indian Equities (NSE/BSE)",
      title: "Explore Indian Stocks & Create Custom Watchlists",
      icon: <Compass className="w-6 h-6 text-emerald-500" />,
      description: "Browse the comprehensive Indian stock universe across Information Technology, Banking & Finance, Automobile & EV, Energy, FMCG, Pharma, and Internet Leaders. Add any stock to your custom watchlists with a single click.",
      highlightPoints: [
        "Filter by sector or search by company name and NSE ticker",
        "Create custom watchlists and switch instantly from the top bar",
        "100% reactive sync across tables, charts, and header counters"
      ],
      color: "from-emerald-600 to-teal-600"
    },
    {
      stepNumber: 4,
      badge: "Interactive Scenario Simulation",
      title: "Simulate Live Market Shocks",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      description: "Test how your portfolio and the knowledge graph respond to unexpected news. Trigger synthetic shocks like semiconductor disruptions, crude oil spikes, or RBI rate hikes to watch the network propagate impact scores live.",
      highlightPoints: [
        "Simulate real-world market shock events in 1 click",
        "Inspect attention re-scoring (MCS) and urgency badges in real time",
        "Real-time event feed with RVOL and catalyst severity tags"
      ],
      color: "from-amber-600 to-orange-600"
    },
    {
      stepNumber: 5,
      badge: "Seaside Escape Palette & Themes",
      title: "Designed for Focus & Clarity",
      icon: <Sun className="w-6 h-6 text-amber-500" />,
      description: "Enjoy our clean, default Seaside Escape light theme (#F8F2EF, #DEC3B3, #D2DCE4) designed for calm and readability during busy trading days. Switch effortlessly to Midnight Nexus dark mode whenever you prefer.",
      highlightPoints: [
        "Seaside Escape light mode set as default for clean aesthetics",
        "1-Click Theme Toggle located in the top navbar",
        "Clean, un-bombarded UI built for intuitive navigation"
      ],
      color: "from-amber-500 to-indigo-500"
    }
  ];

  const step = tourSteps[currentStep];
  const isLast = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('nexus_tour_completed', 'true');
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border transition-all relative ${
          isLight
            ? 'bg-[#F8F2EF] border-[#E5D6CE] text-[#1E293B]'
            : 'bg-[#121826] border-slate-700/90 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isLight ? 'border-[#E5D6CE]/80 bg-[#FFFFFF]/70' : 'border-slate-800 bg-[#0D121F]/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border ${
              isLight ? 'bg-[#E7EBEE] border-[#D2DCE4]' : 'bg-slate-800 border-slate-700'
            }`}>
              {step.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  isLight
                    ? 'bg-[#D2DCE4]/60 text-slate-700 border-[#DEC3B3]'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {step.badge}
                </span>
                <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </div>
              <h2 className="text-base font-bold tracking-tight mt-0.5">
                {step.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition ${
              isLight ? 'bg-[#E7EBEE] hover:bg-[#DEC3B3]/40 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}
            title="Skip Guided Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {step.description}
          </p>

          <div className={`p-4 rounded-2xl border space-y-2.5 ${
            isLight
              ? 'bg-[#FFFFFF] border-[#E5D6CE] shadow-sm'
              : 'bg-slate-900/70 border-slate-800'
          }`}>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Key Highlights:
            </span>
            {step.highlightPoints.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px] ${
                  isLight ? 'bg-[#D2DCE4] text-slate-800' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  ✓
                </div>
                <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>
                  {pt}
                </span>
              </div>
            ))}
          </div>

          {/* Step Indicators (Dots) */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-blue-600'
                    : isLight
                    ? 'w-2 bg-[#D2DCE4] hover:bg-[#DEC3B3]'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className={`p-5 border-t flex items-center justify-between ${
          isLight ? 'border-[#E5D6CE]/80 bg-[#FFFFFF]/70' : 'border-slate-800 bg-[#0D121F]/70'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`text-xs font-semibold px-3 py-2 rounded-xl transition ${
              isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-[#E7EBEE] hover:bg-[#D2DCE4] border-[#DEC3B3] text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <span>{isLast ? "Let's Get Started!" : "Next"}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
