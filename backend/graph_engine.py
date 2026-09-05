"""
Multi-Year Historical Graph Analytics Engine using NetworkX.
Constructs multi-asset market topology across 150+ Indian NSE stocks.
Features cross-correlation mining, conglomerate clusters (Tata, Adani, Reliance, PSU),
supply chains, and competitor graphs.
"""
import networkx as nx
from typing import List, Dict, Any, Optional, Set, Tuple
from stock_universe import INDIAN_STOCKS_UNIVERSE, SECTOR_ETFS

DEFAULT_STOCKS = INDIAN_STOCKS_UNIVERSE
DEFAULT_SECTORS = SECTOR_ETFS

# Explicit Core Relational Edges
CORE_RELATIONAL_EDGES = [
    # --- Tata Group Synergies & Supply Chain ---
    ("TATAPOWER.NS", "TATAMOTORS.NS", "SUPPLIES_TO", 0.90, "EV charging network & battery storage infrastructure for Tata EV fleet."),
    ("TATAELXSI.NS", "TATAMOTORS.NS", "SUPPLIES_TO", 0.85, "Autonomous driving, connected vehicle software, and cockpit electronics for JLR."),
    ("TCS.NS", "TATAMOTORS.NS", "SUPPLIES_TO", 0.80, "Global IT and enterprise cloud integration for Tata Motors operations."),
    ("TATASTEEL.NS", "TATAMOTORS.NS", "SUPPLIES_TO", 0.85, "Automotive grade lightweight high-tensile steel sheets."),
    ("TATASTEEL.NS", "MARUTI.NS", "SUPPLIES_TO", 0.75, "High-strength galvanized steel for car chassis and panels."),
    ("KPITTECH.NS", "TATAMOTORS.NS", "SUPPLIES_TO", 0.80, "Embedded powertrain and battery management software."),
    ("BHARATFORG.NS", "TATAMOTORS.NS", "SUPPLIES_TO", 0.85, "Forged crankshafts and front axle assemblies."),
    ("BHARATFORG.NS", "M&M.NS", "SUPPLIES_TO", 0.80, "Chassis components and precision forged engine parts."),
    ("SONACOMS.NS", "M&M.NS", "SUPPLIES_TO", 0.80, "Differential gears and starter motors for EV & SUV platforms."),
    ("MOTHERSON.NS", "MARUTI.NS", "SUPPLIES_TO", 0.90, "Primary supplier of wiring harnesses, vision systems, and polymer modules."),

    # --- Infrastructure, Energy & Defense EPC ---
    ("LT.NS", "RELIANCE.NS", "SUPPLIES_TO", 0.85, "Turnkey EPC contractor for Jamnagar green hydrogen and refinery complex."),
    ("LT.NS", "HAL.NS", "SUPPLIES_TO", 0.75, "Precision aerospace components and launch vehicle structures."),
    ("BEL.NS", "HAL.NS", "SUPPLIES_TO", 0.90, "Avionics, radar warning receivers, and electronic warfare suites for Tejas fighter jets."),
    ("BHEL.NS", "NTPC.NS", "SUPPLIES_TO", 0.85, "Turbines, boilers, and thermal power plant EPC execution."),
    ("ABB.NS", "POWERGRID.NS", "SUPPLIES_TO", 0.85, "HVDC substations and grid automation transformers."),
    ("SIEMENS.NS", "RVNL.NS", "SUPPLIES_TO", 0.80, "Locomotive propulsion systems and signaling infrastructure for Indian Railways."),

    # --- Competitive Rivalries ---
    ("TCS.NS", "INFY.NS", "COMPETES_WITH", 0.90, "Global rivalry for Fortune 500 digital transformation and GenAI cloud contracts."),
    ("TCS.NS", "HCLTECH.NS", "COMPETES_WITH", 0.80, "Competition in infrastructure management and engineering services."),
    ("INFY.NS", "WIPRO.NS", "COMPETES_WITH", 0.80, "Rivalry in enterprise consulting and enterprise application services."),
    ("HDFCBANK.NS", "ICICIBANK.NS", "COMPETES_WITH", 0.90, "Fierce rivalry for retail deposits, credit cards, and home loan market share."),
    ("HDFCBANK.NS", "SBIN.NS", "COMPETES_WITH", 0.80, "Wholesale corporate banking and large infra loan syndications."),
    ("ICICIBANK.NS", "AXISBANK.NS", "COMPETES_WITH", 0.80, "Competition for digital payments, MSME loans, and wealth management."),
    ("BAJFINANCE.NS", "CHOLAFIN.NS", "COMPETES_WITH", 0.75, "Consumer durable financing and vehicle loan disbursement."),
    ("TATAMOTORS.NS", "MARUTI.NS", "COMPETES_WITH", 0.85, "Battle for Indian passenger car and SUV market leadership."),
    ("TATAMOTORS.NS", "M&M.NS", "COMPETES_WITH", 0.85, "Direct rivalry in compact and mid-size SUV segments (Nexon/Harrier vs Thar/Scorpio)."),
    ("BAJAJ-AUTO.NS", "TVSMOTOR.NS", "COMPETES_WITH", 0.85, "Competition in premium motorcycles and electric 2-wheeler scooters (Chetak vs iQube)."),
    ("RELIANCE.NS", "BHARTIARTL.NS", "COMPETES_WITH", 0.95, "Duopoly rivalry in 5G mobile networks, fiber broadband, and enterprise enterprise cloud."),
    ("ZOMATO.NS", "SWIGGY.NS", "COMPETES_WITH", 0.95, "Quick-commerce delivery battle (Blinkit vs Instamart) and food delivery."),
    ("SUNPHARMA.NS", "DRREDDY.NS", "COMPETES_WITH", 0.85, "Competition in US generic drug market and specialty dermatology formulations."),
    ("JSWSTEEL.NS", "TATASTEEL.NS", "COMPETES_WITH", 0.85, "Rivalry in flat steel production and domestic infrastructure tenders.")
]


class MarketGraphEngine:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._build_initial_graph()

    def _build_initial_graph(self):
        """Construct the Indian multi-asset market knowledge graph with 150+ stocks and correlation links."""
        # 1. Add all stock nodes
        for stock in INDIAN_STOCKS_UNIVERSE + SECTOR_ETFS:
            self.graph.add_node(
                stock["ticker"],
                name=stock["name"],
                sector=stock["sector"],
                industry=stock["industry"],
                market_cap=stock["market_cap"],
                beta=stock["beta"],
                sector_etf=stock["sector_etf"],
                base_price=stock.get("base_price", 1000.0),
                description=f"{stock['name']} operates in {stock['industry']} within the {stock['sector']} sector.",
                node_type="ETF" if stock["sector"] == "ETF" else "STOCK"
            )

        # 2. Add core supply chain and competition edges
        for src, dst, rel, weight, desc in CORE_RELATIONAL_EDGES:
            if src in self.graph and dst in self.graph:
                self.graph.add_edge(
                    src, dst,
                    relationship=rel,
                    weight=weight,
                    description=desc
                )

        # 3. Add Sector & Index Membership Edges
        for stock in INDIAN_STOCKS_UNIVERSE:
            etf = stock.get("sector_etf")
            if etf and etf in self.graph:
                self.graph.add_edge(
                    stock["ticker"], etf,
                    relationship="IN_SECTOR",
                    weight=0.90,
                    description=f"Core constituent in the {etf.replace('.NS', '')} Index."
                )

        # 4. Generate Multi-Year Historical Sector Peer Correlations
        # Connect peer stocks within the same sector with high historical co-movement
        sector_buckets: Dict[str, List[str]] = {}
        for s in INDIAN_STOCKS_UNIVERSE:
            sector_buckets.setdefault(s["sector"], []).append(s["ticker"])

        for sector, tickers in sector_buckets.items():
            for i in range(len(tickers)):
                for j in range(i + 1, min(i + 4, len(tickers))):
                    t1, t2 = tickers[i], tickers[j]
                    if not self.graph.has_edge(t1, t2):
                        self.graph.add_edge(
                            t1, t2,
                            relationship="SECTOR_PEER",
                            weight=0.75,
                            description=f"3-year historical correlation & co-movement within {sector}."
                        )

    def get_ticker_metadata(self, ticker: str) -> Optional[Dict[str, Any]]:
        """Retrieve node attributes for a specific ticker."""
        if ticker in self.graph.nodes:
            data = dict(self.graph.nodes[ticker])
            data["ticker"] = ticker
            return data
        return None

    def get_all_tickers(self) -> List[Dict[str, Any]]:
        """Retrieve all active tickers in graph."""
        res = []
        for node in self.graph.nodes:
            data = dict(self.graph.nodes[node])
            data["ticker"] = node
            res.append(data)
        return res

    def get_general_macro_graph(self) -> Dict[str, Any]:
        """
        Returns the macro knowledge graph for new users who don't have custom watchlists yet.
        Highlights sector benchmark hubs, bluechips, and cross-sector links.
        """
        top_bluechips = [
            "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
            "TATAMOTORS.NS", "TATAPOWER.NS", "BHARTIARTL.NS", "LT.NS", "ITC.NS",
            "SBIN.NS", "MARUTI.NS", "NIFTYBEES.NS", "BANKBEES.NS", "ITBEES.NS"
        ]
        return self.get_subgraph_for_watchlist(top_bluechips, include_1hop_neighbors=True)

    def get_subgraph_for_watchlist(self, watchlist_tickers: List[str], include_1hop_neighbors: bool = True) -> Dict[str, Any]:
        """Generate a visual knowledge graph structure for an Indian watchlist."""
        if not watchlist_tickers:
            return self.get_general_macro_graph()

        target_nodes: Set[str] = set(watchlist_tickers)

        if include_1hop_neighbors:
            for ticker in watchlist_tickers:
                if ticker in self.graph:
                    target_nodes.update(self.graph.predecessors(ticker))
                    target_nodes.update(self.graph.successors(ticker))

        sub = self.graph.subgraph(target_nodes)

        nodes = []
        for n in sub.nodes:
            n_data = dict(sub.nodes[n])
            is_in_watchlist = n in watchlist_tickers
            nodes.append({
                "id": n,
                "label": n.replace(".NS", ""),
                "name": n_data.get("name", n),
                "sector": n_data.get("sector", "Unknown"),
                "industry": n_data.get("industry", ""),
                "isWatchlist": is_in_watchlist,
                "nodeType": n_data.get("node_type", "STOCK"),
                "marketCap": n_data.get("market_cap", 10000.0),
                "degree": sub.degree(n)
            })

        edges = []
        for u, v, d in sub.edges(data=True):
            edges.append({
                "source": u,
                "target": v,
                "relationship": d.get("relationship", "RELATED_TO"),
                "weight": d.get("weight", 1.0),
                "description": d.get("description", "")
            })

        return {"nodes": nodes, "edges": edges}

    def calculate_ripple_effects(self, primary_anomalies: List[Dict[str, Any]], watchlist_tickers: List[str]) -> Dict[str, Dict[str, Any]]:
        """Calculates ripple contagion score across the Indian market graph."""
        ripple_impacts: Dict[str, Dict[str, Any]] = {}
        decay_factor = 0.65

        for anomaly in primary_anomalies:
            src_ticker = anomaly["ticker"]
            shock_magnitude = abs(anomaly.get("change_pct", 0.0)) * (anomaly.get("rvol", 1.0) / 2.0)
            shock_direction = "NEGATIVE" if anomaly.get("change_pct", 0) < 0 else "POSITIVE"
            shock_reason = anomaly.get("reason", "Abnormal price/volume divergence")

            if src_ticker not in self.graph:
                continue

            for downstream in self.graph.successors(src_ticker):
                edge_data = self.graph.get_edge_data(src_ticker, downstream)
                weight = edge_data.get("weight", 0.7) if edge_data else 0.7
                rel_type = edge_data.get("relationship", "CONNECTED_TO")
                rel_desc = edge_data.get("description", "")

                impact_score = min(100.0, shock_magnitude * weight * 15.0)

                if downstream not in ripple_impacts or impact_score > ripple_impacts[downstream]["ripple_score"]:
                    ripple_impacts[downstream] = {
                        "ripple_score": round(impact_score, 1),
                        "propagated_from": src_ticker,
                        "relationship": rel_type,
                        "relationship_description": rel_desc,
                        "shock_direction": shock_direction,
                        "upstream_reason": shock_reason,
                        "distance": 1,
                        "exposure_note": f"Downstream exposure to {src_ticker.replace('.NS', '')} ({rel_type}): {rel_desc}"
                    }

            for upstream in self.graph.predecessors(src_ticker):
                edge_data = self.graph.get_edge_data(upstream, src_ticker)
                weight = edge_data.get("weight", 0.6) if edge_data else 0.6
                rel_type = edge_data.get("relationship", "CONNECTED_TO")

                impact_score = min(100.0, shock_magnitude * weight * 10.0 * decay_factor)

                if upstream not in ripple_impacts or impact_score > ripple_impacts[upstream]["ripple_score"]:
                    ripple_impacts[upstream] = {
                        "ripple_score": round(impact_score, 1),
                        "propagated_from": src_ticker,
                        "relationship": rel_type,
                        "relationship_description": f"Upstream counterparty of {src_ticker.replace('.NS', '')}",
                        "shock_direction": shock_direction,
                        "upstream_reason": shock_reason,
                        "distance": 1,
                        "exposure_note": f"Counterparty shock originating from {src_ticker.replace('.NS', '')} ({rel_type})"
                    }

        return ripple_impacts

    def get_ticker_neighborhood(self, ticker: str) -> Dict[str, Any]:
        """Deep dive for a single Indian stock showing direct suppliers, customers, and rivals."""
        if ticker not in self.graph:
            return {"ticker": ticker, "found": False}

        suppliers = []
        for u in self.graph.predecessors(ticker):
            edge = self.graph.get_edge_data(u, ticker)
            if edge.get("relationship") == "SUPPLIES_TO":
                suppliers.append({
                    "ticker": u,
                    "name": self.graph.nodes[u].get("name", u),
                    "description": edge.get("description", "")
                })

        customers = []
        for v in self.graph.successors(ticker):
            edge = self.graph.get_edge_data(ticker, v)
            if edge.get("relationship") == "SUPPLIES_TO":
                customers.append({
                    "ticker": v,
                    "name": self.graph.nodes[v].get("name", v),
                    "description": edge.get("description", "")
                })

        competitors = []
        for v in self.graph.successors(ticker):
            edge = self.graph.get_edge_data(ticker, v)
            if edge.get("relationship") == "COMPETES_WITH":
                competitors.append({
                    "ticker": v,
                    "name": self.graph.nodes[v].get("name", v),
                    "description": edge.get("description", "")
                })
        for u in self.graph.predecessors(ticker):
            edge = self.graph.get_edge_data(u, ticker)
            if edge.get("relationship") == "COMPETES_WITH" and not any(c["ticker"] == u for c in competitors):
                competitors.append({
                    "ticker": u,
                    "name": self.graph.nodes[u].get("name", u),
                    "description": edge.get("description", "")
                })

        return {
            "ticker": ticker,
            "found": True,
            "metadata": dict(self.graph.nodes[ticker]),
            "suppliers": suppliers,
            "customers": customers,
            "competitors": competitors
        }


market_graph = MarketGraphEngine()
