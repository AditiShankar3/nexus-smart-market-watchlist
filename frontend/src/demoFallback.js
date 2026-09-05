/**
 * Seamless Demo & Standalone Fallback for Nexus Market Graph.
 * Ensures the Vercel deployed frontend functions flawlessly even when 
 * the backend is spun down or evaluated in pure browser demo mode.
 */

export const DEMO_WATCHLISTS = [
  {
    id: "wl_nifty_titans",
    name: "Nifty 50 Titans",
    description: "Core heavyweights of the Indian National Stock Exchange (NSE)",
    is_default: true,
    tickers: ["RELIANCE.NS", "TCS.NS", "TATAMOTORS.NS", "INFY.NS", "TATAPOWER.NS"]
  },
  {
    id: "wl_tata_ev",
    name: "Tata EV Mobility",
    description: "Interconnected clean energy and automotive supply chain",
    is_default: true,
    tickers: ["TATAMOTORS.NS", "TATAPOWER.NS", "TATASTEEL.NS", "TCS.NS"]
  },
  {
    id: "wl_tech_duopolies",
    name: "Indian Tech Duopolies",
    description: "Quick commerce and consumer technology giants",
    is_default: true,
    tickers: ["ZOMATO.NS", "SWIGGY.NS", "TCS.NS", "INFY.NS"]
  }
];

export const DEMO_ITEMS = [
  {
    ticker: "TATAMOTORS.NS",
    name: "Tata Motors Limited",
    sector: "Auto",
    current_price: 984.50,
    baseline_price: 948.20,
    delta_price: 36.30,
    delta_pct: 3.83,
    direction: "up",
    volume_24h: 18500000,
    rvol: 2.65,
    sector_delta_pct: 0.85,
    sector_divergence: 2.98,
    meaningful_change_score: 84.5,
    score_tier: "CRITICAL ANOMALY",
    score_factors: {
      divergence: 24.2,
      volume: 23.5,
      volatility: 18.2,
      ripple: 18.6
    },
    direct_driver: "Landmark ₹5,000 Cr EV commercial fleet contract win with major logistics operators.",
    supply_chain_ripple: "Propagates 2nd-order surge to fast-charging partner Tata Power (+2.1%) and driveline supplier Sona BLW. Exerts competitive pressure on Maruti Suzuki (-1.2%).",
    sparkline: [948, 952, 950, 962, 970, 978, 984.5]
  },
  {
    ticker: "TATAPOWER.NS",
    name: "Tata Power Company Limited",
    sector: "Utilities",
    current_price: 432.10,
    baseline_price: 423.20,
    delta_price: 8.90,
    delta_pct: 2.10,
    direction: "up",
    volume_24h: 9200000,
    rvol: 2.10,
    sector_delta_pct: -0.20,
    sector_divergence: 2.30,
    meaningful_change_score: 74.0,
    score_tier: "CRITICAL ANOMALY",
    score_factors: {
      divergence: 21.0,
      volume: 19.5,
      volatility: 16.0,
      ripple: 17.5
    },
    direct_driver: "Expansion of national highway EV fast-charging grid and joint deployment with Tata Motors.",
    supply_chain_ripple: "Benefits from captive conglomerate demand; clean energy power purchase agreements secured.",
    sparkline: [423, 424, 427, 426, 429, 431, 432.1]
  },
  {
    ticker: "ZOMATO.NS",
    name: "Zomato Limited",
    sector: "Consumer Tech",
    current_price: 268.40,
    baseline_price: 275.80,
    delta_price: -7.40,
    delta_pct: -2.68,
    direction: "down",
    volume_24h: 31000000,
    rvol: 2.40,
    sector_delta_pct: 0.40,
    sector_divergence: 3.08,
    meaningful_change_score: 71.5,
    score_tier: "CRITICAL ANOMALY",
    score_factors: {
      divergence: 23.0,
      volume: 21.0,
      volatility: 15.5,
      ripple: 12.0
    },
    direct_driver: "Heightened dark-store expansion capex and aggressive pricing competition in quick commerce.",
    supply_chain_ripple: "Swiggy counter-promotions escalate; dark store warehouse REIT yields compress slightly.",
    sparkline: [275, 274, 271, 270, 269, 267, 268.4]
  },
  {
    ticker: "RELIANCE.NS",
    name: "Reliance Industries Limited",
    sector: "Energy / Telecom",
    current_price: 2985.00,
    baseline_price: 2962.00,
    delta_price: 23.00,
    delta_pct: 0.78,
    direction: "up",
    volume_24h: 6800000,
    rvol: 1.15,
    sector_delta_pct: 0.65,
    sector_divergence: 0.13,
    meaningful_change_score: 32.0,
    score_tier: "ROUTINE NOISE",
    score_factors: {
      divergence: 5.0,
      volume: 10.0,
      volatility: 12.0,
      ripple: 5.0
    },
    direct_driver: "Trading in line with benchmark Nifty 50 index. Stable refining margins in Jamnagar.",
    supply_chain_ripple: "No systemic shocks detected across downstream polymers or Jio retail network.",
    sparkline: [2962, 2965, 2970, 2968, 2980, 2982, 2985]
  },
  {
    ticker: "TCS.NS",
    name: "Tata Consultancy Services",
    sector: "IT Services",
    current_price: 4120.00,
    baseline_price: 4135.00,
    delta_price: -15.00,
    delta_pct: -0.36,
    direction: "down",
    volume_24h: 2100000,
    rvol: 0.88,
    sector_delta_pct: -0.42,
    sector_divergence: 0.06,
    meaningful_change_score: 18.5,
    score_tier: "ROUTINE NOISE",
    score_factors: {
      divergence: 2.5,
      volume: 6.0,
      volatility: 7.0,
      ripple: 3.0
    },
    direct_driver: "Low-volatility consolidation following recent quarterly dividend distribution.",
    supply_chain_ripple: "Neutral contagion across Indian IT tier-1 peer group (Infosys, Wipro).",
    sparkline: [4135, 4132, 4130, 4128, 4125, 4122, 4120]
  },
  {
    ticker: "SWIGGY.NS",
    name: "Swiggy Limited",
    sector: "Consumer Tech",
    current_price: 485.50,
    baseline_price: 472.00,
    delta_price: 13.50,
    delta_pct: 2.86,
    direction: "up",
    volume_24h: 14200000,
    rvol: 2.30,
    sector_delta_pct: 0.40,
    sector_divergence: 2.46,
    meaningful_change_score: 68.0,
    score_tier: "NOTABLE SHIFT",
    score_factors: {
      divergence: 20.0,
      volume: 20.5,
      volatility: 15.0,
      ripple: 12.5
    },
    direct_driver: "Instamart average order value (AOV) acceleration and quick-commerce dark store efficiency gains.",
    supply_chain_ripple: "Rivalry dynamic with Zomato; competitive margin pressure remains active.",
    sparkline: [472, 474, 478, 481, 480, 483, 485.5]
  }
];

export const DEMO_GRAPH = {
  nodes: [
    { id: "TATAMOTORS.NS", name: "Tata Motors", sector: "Auto", mcs: 84.5, delta_pct: 3.83, role: "Assembler" },
    { id: "TATAPOWER.NS", name: "Tata Power", sector: "Utilities", mcs: 74.0, delta_pct: 2.10, role: "EV Infra" },
    { id: "TATASTEEL.NS", name: "Tata Steel", sector: "Metals", mcs: 42.0, delta_pct: 1.15, role: "Materials" },
    { id: "TCS.NS", name: "TCS", sector: "IT Services", mcs: 18.5, delta_pct: -0.36, role: "Tech Partner" },
    { id: "MARUTI.NS", name: "Maruti Suzuki", sector: "Auto", mcs: 58.0, delta_pct: -1.20, role: "Competitor" },
    { id: "ZOMATO.NS", name: "Zomato", sector: "Consumer Tech", mcs: 71.5, delta_pct: -2.68, role: "Duopoly" },
    { id: "SWIGGY.NS", name: "Swiggy", sector: "Consumer Tech", mcs: 68.0, delta_pct: 2.86, role: "Duopoly" },
    { id: "RELIANCE.NS", name: "Reliance Ind", sector: "Conglomerate", mcs: 32.0, delta_pct: 0.78, role: "Macro Titan" }
  ],
  links: [
    { source: "TATAMOTORS.NS", target: "TATAPOWER.NS", type: "SUPPLIER_TO", weight: 0.85 },
    { source: "TATAMOTORS.NS", target: "MARUTI.NS", type: "COMPETITOR", weight: -0.70 },
    { source: "TATAMOTORS.NS", target: "TATASTEEL.NS", type: "CUSTOMER_OF", weight: 0.75 },
    { source: "ZOMATO.NS", target: "SWIGGY.NS", type: "RIVAL", weight: -0.80 },
    { source: "TCS.NS", target: "TATAMOTORS.NS", type: "TECH_VENDOR", weight: 0.65 }
  ]
};

export function getDemoAnalysis(watchlistId, baselineMode = "last_visit") {
  let filteredItems = DEMO_ITEMS;
  if (watchlistId === "wl_tata_ev") {
    filteredItems = DEMO_ITEMS.filter(i => i.ticker.includes("TATA"));
  } else if (watchlistId === "wl_tech_duopolies") {
    filteredItems = DEMO_ITEMS.filter(i => ["ZOMATO.NS", "SWIGGY.NS", "TCS.NS"].includes(i.ticker));
  }

  const criticalCount = filteredItems.filter(i => i.meaningful_change_score >= 70).length;
  const notableCount = filteredItems.filter(i => i.meaningful_change_score >= 45 && i.meaningful_change_score < 70).length;
  const routineCount = filteredItems.filter(i => i.meaningful_change_score < 45).length;

  return {
    watchlist_id: watchlistId || "wl_nifty_titans",
    baseline_label: baselineMode === "1h" ? "1 hour ago" : "your last visit (2h 15m ago)",
    executive_summary: `${criticalCount} meaningful shift${criticalCount === 1 ? '' : 's'} detected in your watchlist. Tata Motors broke out +3.8% on EV fleet orders, rippling into Tata Power (+2.1%), while Zomato pulled back on quick commerce competition.`,
    critical_count: criticalCount,
    notable_count: notableCount,
    routine_count: routineCount,
    items: filteredItems
  };
}
