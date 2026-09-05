/**
 * Complete, High-Fidelity Demo Dataset for Nexus Market Graph.
 * Ensures that both WatchlistTable and MarketTopMoversWidget have every
 * required numeric and string property so no undefined property errors can occur.
 */

export const DEMO_WATCHLISTS = [
  {
    id: "wl_nifty_titans",
    name: "Nifty 50 Titans",
    description: "Core heavyweights of the Indian National Stock Exchange (NSE)",
    is_default: true,
    tickers: ["TATAMOTORS.NS", "TATAPOWER.NS", "ZOMATO.NS", "RELIANCE.NS", "TCS.NS", "SWIGGY.NS"]
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
    display_ticker: "TATAMOTORS",
    name: "Tata Motors Limited",
    sector: "Auto",
    sector_etf: "NIFTYAUTO.NS",
    current_price: 984.50,
    price: 984.50,
    baseline_price: 948.20,
    price_delta_pct: 3.83,
    delta_pct: 3.83,
    change_pct: 3.83,
    price_delta_abs: 36.30,
    delta_price: 36.30,
    direction: "up",
    volume_24h: 18500000,
    rvol: 2.65,
    sector_delta_pct: 0.85,
    sector_divergence: 2.98,
    divergence_pct: 2.98,
    meaningful_change_score: 84.5,
    urgency_level: "CRITICAL_ANOMALY",
    badge_color: "red",
    reason: "Landmark ₹5,000 Cr EV commercial fleet contract win • Outperformed Auto by +3.0%",
    direct_driver: "Landmark ₹5,000 Cr EV commercial fleet contract win with major logistics operators.",
    supply_chain_ripple: "Propagates 2nd-order surge to fast-charging partner Tata Power (+2.1%) and driveline supplier Sona BLW. Exerts competitive pressure on Maruti Suzuki (-1.2%).",
    structured_reasons: [
      { type: "divergence", label: "Sector Divergence", text: "Outperformed Nifty Auto by +3.0%" },
      { type: "volume", label: "Volume Surge", text: "2.65x abnormal institutional volume" },
      { type: "catalyst", label: "Catalyst Event", text: "Landmark EV commercial fleet contract" }
    ],
    sparkline: [948, 952, 950, 962, 970, 978, 984.5]
  },
  {
    ticker: "TATAPOWER.NS",
    display_ticker: "TATAPOWER",
    name: "Tata Power Company Limited",
    sector: "Utilities",
    sector_etf: "NIFTYENERGY.NS",
    current_price: 432.10,
    price: 432.10,
    baseline_price: 423.20,
    price_delta_pct: 2.10,
    delta_pct: 2.10,
    change_pct: 2.10,
    price_delta_abs: 8.90,
    delta_price: 8.90,
    direction: "up",
    volume_24h: 9200000,
    rvol: 2.10,
    sector_delta_pct: -0.20,
    sector_divergence: 2.30,
    divergence_pct: 2.30,
    meaningful_change_score: 74.0,
    urgency_level: "CRITICAL_ANOMALY",
    badge_color: "red",
    reason: "Supply Chain Ripple from Tata Motors EV expansion • National highway EV fast-charging grid",
    direct_driver: "Expansion of national highway EV fast-charging grid and joint deployment with Tata Motors.",
    supply_chain_ripple: "Benefits from captive conglomerate demand; clean energy power purchase agreements secured.",
    structured_reasons: [
      { type: "ripple", label: "Supply Chain Ripple", text: "2nd-order surge from Tata Motors EV contract" },
      { type: "divergence", label: "Sector Divergence", text: "Outperformed Energy index by +2.3%" }
    ],
    sparkline: [423, 424, 427, 426, 429, 431, 432.1]
  },
  {
    ticker: "ZOMATO.NS",
    display_ticker: "ZOMATO",
    name: "Zomato Limited",
    sector: "Consumer Tech",
    sector_etf: "NIFTYIT.NS",
    current_price: 268.40,
    price: 268.40,
    baseline_price: 275.80,
    price_delta_pct: -2.68,
    delta_pct: -2.68,
    change_pct: -2.68,
    price_delta_abs: -7.40,
    delta_price: -7.40,
    direction: "down",
    volume_24h: 31000000,
    rvol: 2.40,
    sector_delta_pct: 0.40,
    sector_divergence: 3.08,
    divergence_pct: -3.08,
    meaningful_change_score: 71.5,
    urgency_level: "CRITICAL_ANOMALY",
    badge_color: "red",
    reason: "Heightened quick commerce dark-store expansion capex • Fierce competition with Swiggy",
    direct_driver: "Heightened dark-store expansion capex and aggressive pricing competition in quick commerce.",
    supply_chain_ripple: "Swiggy counter-promotions escalate; dark store warehouse REIT yields compress slightly.",
    structured_reasons: [
      { type: "catalyst", label: "Catalyst Event", text: "Quick commerce dark store capex surge" },
      { type: "volume", label: "Volume Surge", text: "2.40x elevated volume on pullback" }
    ],
    sparkline: [275, 274, 271, 270, 269, 267, 268.4]
  },
  {
    ticker: "SWIGGY.NS",
    display_ticker: "SWIGGY",
    name: "Swiggy Limited",
    sector: "Consumer Tech",
    sector_etf: "NIFTYIT.NS",
    current_price: 485.50,
    price: 485.50,
    baseline_price: 472.00,
    price_delta_pct: 2.86,
    delta_pct: 2.86,
    change_pct: 2.86,
    price_delta_abs: 13.50,
    delta_price: 13.50,
    direction: "up",
    volume_24h: 14200000,
    rvol: 2.30,
    sector_delta_pct: 0.40,
    sector_divergence: 2.46,
    divergence_pct: 2.46,
    meaningful_change_score: 68.0,
    urgency_level: "MEANINGFUL_CHANGE",
    badge_color: "blue",
    reason: "Instamart average order value acceleration • Market share gains in grocery delivery",
    direct_driver: "Instamart average order value (AOV) acceleration and quick-commerce dark store efficiency gains.",
    supply_chain_ripple: "Rivalry dynamic with Zomato; competitive margin pressure remains active.",
    structured_reasons: [
      { type: "divergence", label: "Sector Divergence", text: "Outperformed tech peers by +2.5%" },
      { type: "volume", label: "Volume Surge", text: "2.30x institutional accumulation" }
    ],
    sparkline: [472, 474, 478, 481, 480, 483, 485.5]
  },
  {
    ticker: "RELIANCE.NS",
    display_ticker: "RELIANCE",
    name: "Reliance Industries Limited",
    sector: "Energy / Telecom",
    sector_etf: "NIFTYENERGY.NS",
    current_price: 2985.00,
    price: 2985.00,
    baseline_price: 2962.00,
    price_delta_pct: 0.78,
    delta_pct: 0.78,
    change_pct: 0.78,
    price_delta_abs: 23.00,
    delta_price: 23.00,
    direction: "up",
    volume_24h: 6800000,
    rvol: 1.15,
    sector_delta_pct: 0.65,
    sector_divergence: 0.13,
    divergence_pct: 0.13,
    meaningful_change_score: 32.0,
    urgency_level: "MARKET_NOISE",
    badge_color: "gray",
    reason: "Trading steadily in line with benchmark Nifty 50 • Stable Jamnagar refining margins",
    direct_driver: "Trading in line with benchmark Nifty 50 index. Stable refining margins in Jamnagar.",
    supply_chain_ripple: "No systemic shocks detected across downstream polymers or Jio retail network.",
    structured_reasons: [
      { type: "steady", label: "Market Drift", text: "Trading in sync with broader benchmark" }
    ],
    sparkline: [2962, 2965, 2970, 2968, 2980, 2982, 2985]
  },
  {
    ticker: "TCS.NS",
    display_ticker: "TCS",
    name: "Tata Consultancy Services",
    sector: "IT Services",
    sector_etf: "NIFTYIT.NS",
    current_price: 4120.00,
    price: 4120.00,
    baseline_price: 4135.00,
    price_delta_pct: -0.36,
    delta_pct: -0.36,
    change_pct: -0.36,
    price_delta_abs: -15.00,
    delta_price: -15.00,
    direction: "down",
    volume_24h: 2100000,
    rvol: 0.88,
    sector_delta_pct: -0.42,
    sector_divergence: 0.06,
    divergence_pct: 0.06,
    meaningful_change_score: 18.5,
    urgency_level: "MARKET_NOISE",
    badge_color: "gray",
    reason: "Low-volatility consolidation • Neutral contagion across Indian IT tier-1 peers",
    direct_driver: "Low-volatility consolidation following recent quarterly dividend distribution.",
    supply_chain_ripple: "Neutral contagion across Indian IT tier-1 peer group (Infosys, Wipro).",
    structured_reasons: [
      { type: "steady", label: "Quiet Trading", text: "Normal price noise within expected volatility" }
    ],
    sparkline: [4135, 4132, 4130, 4128, 4125, 4122, 4120]
  }
];

export const DEMO_TOP_MOVERS = {
  gainers: DEMO_ITEMS.filter(i => i.price_delta_pct > 0),
  losers: DEMO_ITEMS.filter(i => i.price_delta_pct < 0),
  volume_spikes: DEMO_ITEMS.filter(i => i.rvol >= 2.0)
};

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
  const baselineDesc = baselineMode === "1h" ? "1 hour ago" : "your last visit (2h 15m ago)";

  return {
    is_user_logged_in: true,
    is_new_user: false,
    user_name: "Aditi Shankar",
    baseline_mode: baselineMode,
    baseline_time_description: baselineDesc,
    current_timestamp: new Date().toISOString(),
    briefing: {
      headline: `${criticalCount} critical shifts detected across your watchlist`,
      summary: `Tata Motors broke out +3.8% on EV fleet orders, rippling into Tata Power (+2.1%), while Zomato pulled back on quick commerce competition.`,
      bullets: [
        {
          ticker: "TATAMOTORS.NS",
          display_ticker: "TATAMOTORS",
          name: "Tata Motors Limited",
          sector: "Auto",
          current_price: 984.50,
          price_delta_pct: 3.83,
          price_delta_abs: 36.30,
          meaningful_change_score: 84.5,
          urgency_level: "CRITICAL_ANOMALY",
          badge_color: "red",
          explanation: "Diverged by +3.0% vs Auto • 2.6x Volume Spike • Landmark ₹5,000 Cr EV contract",
          structured_reasons: [
            { type: "divergence", label: "Sector Divergence", text: "Outperformed Nifty Auto by +3.0%" },
            { type: "volume", label: "Volume Surge", text: "2.65x abnormal institutional volume" }
          ]
        },
        {
          ticker: "TATAPOWER.NS",
          display_ticker: "TATAPOWER",
          name: "Tata Power Company Limited",
          sector: "Utilities",
          current_price: 432.10,
          price_delta_pct: 2.10,
          price_delta_abs: 8.90,
          meaningful_change_score: 74.0,
          urgency_level: "CRITICAL_ANOMALY",
          badge_color: "red",
          explanation: "Supply Chain Ripple from Tata Motors (+2.1%) • EV fast-charging expansion",
          structured_reasons: [
            { type: "ripple", label: "Supply Chain Ripple", text: "2nd-order surge from Tata Motors EV contract" }
          ]
        },
        {
          ticker: "ZOMATO.NS",
          display_ticker: "ZOMATO",
          name: "Zomato Limited",
          sector: "Consumer Tech",
          current_price: 268.40,
          price_delta_pct: -2.68,
          price_delta_abs: -7.40,
          meaningful_change_score: 71.5,
          urgency_level: "CRITICAL_ANOMALY",
          badge_color: "red",
          explanation: "Quick commerce dark-store expansion price war with Swiggy",
          structured_reasons: [
            { type: "catalyst", label: "Catalyst Event", text: "Heightened capex and margin pressure" }
          ]
        }
      ],
      critical_count: criticalCount,
      meaningful_count: notableCount,
      quiet_count: routineCount,
      overall_market_mood: "BULLISH_EXPANSION",
      average_watchlist_delta: 1.12,
      personalized_greeting: "Welcome back, Aditi!"
    },
    items: filteredItems,
    total_tracked: filteredItems.length
  };
}
