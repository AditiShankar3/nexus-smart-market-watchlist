"""
Temporal Delta & Meaningful Change Engine for Indian Equities.
Computes multi-factor Attention Score (MCS: 0-100), statistical Z-score anomalies,
sector divergence, catalyst weighting, and structured executive catch-up briefings in Rupees (₹).
"""
from typing import List, Dict, Any, Optional
import math
from datetime import datetime, timezone


class DeltaEngine:
    """
    Evaluates state diffs between T_baseline (when user last checked) and T_now.
    Synthesizes multi-factor statistical and relational signals into a prioritized ranking.
    """

    @staticmethod
    def calculate_stock_delta(
        current_data: Dict[str, Any],
        baseline_data: Optional[Dict[str, Any]],
        sector_current: Dict[str, Any],
        sector_baseline: Optional[Dict[str, Any]],
        ripple_info: Optional[Dict[str, Any]] = None,
        time_elapsed_desc: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Calculates the Meaningful Change Score (MCS: 0-100) and structured delta signals.
        """
        curr_price = float(current_data.get("price", 1000.0))
        curr_vol = current_data.get("volume", 1000000)
        curr_rvol = float(current_data.get("rvol", 1.0))
        curr_news = current_data.get("news_event", "")
        catalyst_severity = float(current_data.get("catalyst_severity", 0.0))

        # Baseline comparison
        if baseline_data and baseline_data.get("price") is not None:
            base_price = float(baseline_data.get("price", curr_price))
            price_delta_pct = ((curr_price - base_price) / base_price) * 100.0 if base_price > 0 else 0.0
            price_delta_abs = curr_price - base_price
            if not time_elapsed_desc:
                time_elapsed_desc = "since your last check-in"
        else:
            base_price = curr_price
            price_delta_pct = float(current_data.get("change_pct", 0.0))
            price_delta_abs = curr_price * (price_delta_pct / 100.0)
            if not time_elapsed_desc:
                time_elapsed_desc = "today"

        # Sector Baseline comparison
        sector_curr_change = float(sector_current.get("change_pct", 0.0))
        if sector_baseline and sector_baseline.get("price") is not None:
            s_base_price = float(sector_baseline.get("price", sector_current.get("price", 250.0)))
            s_curr_price = float(sector_current.get("price", 250.0))
            sector_delta_pct = ((s_curr_price - s_base_price) / s_base_price) * 100.0 if s_base_price > 0 else 0.0
        else:
            sector_delta_pct = sector_curr_change

        # 1. Volatility Z-Score Component (0-25 pts)
        stock_beta = float(current_data.get("beta", 1.1))
        expected_sigma = max(0.8, stock_beta * 1.1)
        z_score = abs(price_delta_pct) / expected_sigma
        volatility_score = min(25.0, (z_score / 3.0) * 25.0)

        # 2. Sector Divergence Component (0-25 pts)
        divergence_pct = price_delta_pct - sector_delta_pct
        abs_divergence = abs(divergence_pct)
        divergence_score = min(25.0, (abs_divergence / 3.5) * 25.0)

        # 3. RVOL (Relative Volume Spike) Component (0-20 pts)
        if curr_rvol >= 3.0:
            volume_score = 20.0
        elif curr_rvol >= 2.0:
            volume_score = 15.0
        elif curr_rvol >= 1.4:
            volume_score = 9.0
        else:
            volume_score = max(0.0, (curr_rvol - 0.8) * 10.0)

        # 4. Catalyst Severity (0-15 pts)
        catalyst_score = min(15.0, catalyst_severity * 15.0)

        # 5. Graph Contagion / Ripple Risk (0-15 pts)
        ripple_score = 0.0
        if ripple_info:
            raw_ripple = float(ripple_info.get("ripple_score", 0.0))
            ripple_score = min(15.0, (raw_ripple / 100.0) * 15.0)

        # Composite Meaningful Change Score (0-100)
        total_mcs = round(min(100.0, volatility_score + divergence_score + volume_score + catalyst_score + ripple_score), 1)

        # Classification Level
        if total_mcs >= 70:
            urgency_level = "CRITICAL_ANOMALY"
            badge_color = "red"
        elif total_mcs >= 45:
            urgency_level = "MEANINGFUL_CHANGE"
            badge_color = "amber"
        elif total_mcs >= 25:
            urgency_level = "NOTABLE_MOVEMENT"
            badge_color = "blue"
        else:
            urgency_level = "MARKET_NOISE"
            badge_color = "gray"

        # Structured Reason Breakdown (Clean, readable, tag-based)
        structured_reasons = []
        raw_phrases = []

        if abs_divergence >= 1.5:
            dir_str = "lagged" if divergence_pct < 0 else "outperformed"
            sec_name = current_data.get("sector", "Sector")
            etf_name = current_data.get("sector_etf", "ETF").replace(".NS", "")
            msg = f"Diverged by {divergence_pct:+.1f}% vs {sec_name} ({dir_str} {etf_name})"
            structured_reasons.append({"type": "divergence", "label": "Sector Divergence", "text": msg})
            raw_phrases.append(msg)
        elif abs(price_delta_pct) >= 2.0:
            msg = f"Significant {price_delta_pct:+.1f}% price swing ({z_score:.1f}σ deviation)"
            structured_reasons.append({"type": "volatility", "label": "Price Deviation", "text": msg})
            raw_phrases.append(msg)

        if curr_rvol >= 1.8:
            msg = f"Abnormal volume spike ({curr_rvol:.1f}x normal daily volume)"
            structured_reasons.append({"type": "volume", "label": "Volume Surge", "text": msg})
            raw_phrases.append(msg)

        if curr_news:
            msg = f"{curr_news}"
            structured_reasons.append({"type": "catalyst", "label": "Catalyst Event", "text": msg})
            raw_phrases.append(f"News: {msg}")

        if ripple_info and float(ripple_info.get("ripple_score", 0)) >= 30:
            src = ripple_info.get("propagated_from", "").replace(".NS", "")
            rel = ripple_info.get("relationship", "peer")
            note = ripple_info.get("exposure_note", f"Relational impact from {src}")
            structured_reasons.append({"type": "ripple", "label": "Supply Chain Ripple", "text": note})
            raw_phrases.append(f"Ripple from {src}")

        if not raw_phrases:
            explanation = f"Trading steadily within normal expected range ({price_delta_pct:+.1f}% {time_elapsed_desc})"
            structured_reasons.append({"type": "steady", "label": "Steady", "text": explanation})
        else:
            explanation = " • ".join(raw_phrases)

        clean_ticker = current_data["ticker"].replace(".NS", "")

        return {
            "ticker": current_data["ticker"],
            "display_ticker": clean_ticker,
            "name": current_data.get("name", clean_ticker),
            "sector": current_data.get("sector", "Equities"),
            "sector_etf": current_data.get("sector_etf", "NIFTYBEES.NS"),
            "current_price": round(curr_price, 2),
            "baseline_price": round(base_price, 2),
            "price_delta_pct": round(price_delta_pct, 2),
            "price_delta_abs": round(price_delta_abs, 2),
            "sector_delta_pct": round(sector_delta_pct, 2),
            "divergence_pct": round(divergence_pct, 2),
            "rvol": round(curr_rvol, 2),
            "z_score": round(z_score, 2),
            "news_event": curr_news,
            "catalyst_severity": catalyst_severity,
            "meaningful_change_score": total_mcs,
            "urgency_level": urgency_level,
            "badge_color": badge_color,
            "explanation": explanation,
            "structured_reasons": structured_reasons,
            "score_breakdown": {
                "volatility": round(volatility_score, 1),
                "divergence": round(divergence_score, 1),
                "volume": round(volume_score, 1),
                "catalyst": round(catalyst_score, 1),
                "ripple": round(ripple_score, 1)
            },
            "ripple_info": ripple_info
        }

    @staticmethod
    def generate_executive_briefing(
        evaluated_items: List[Dict[str, Any]],
        baseline_time_desc: str = "your last visit"
    ) -> Dict[str, Any]:
        """
        Synthesizes evaluated watchlist items into structured, clear cards.
        """
        if not evaluated_items:
            return {
                "headline": "No active stocks in this watchlist",
                "summary": "Explore the 150+ stock catalog to add stocks to your watchlist.",
                "bullets": [],
                "critical_count": 0,
                "meaningful_count": 0,
                "quiet_count": 0,
                "overall_market_mood": "NEUTRAL",
                "average_watchlist_delta": 0.0
            }

        sorted_items = sorted(evaluated_items, key=lambda x: x["meaningful_change_score"], reverse=True)
        critical_items = [x for x in sorted_items if x["meaningful_change_score"] >= 70]
        meaningful_items = [x for x in sorted_items if 45 <= x["meaningful_change_score"] < 70]
        quiet_items = [x for x in sorted_items if x["meaningful_change_score"] < 45]

        avg_change = sum(x["price_delta_pct"] for x in sorted_items) / len(sorted_items)
        if avg_change > 1.0:
            mood = "BULLISH_EXPANSION"
        elif avg_change < -1.0:
            mood = "BEARISH_CONTRACTION"
        else:
            mood = "MIXED_ROTATION"

        # Construct High-Impact Structured Bullets
        bullets = []
        for item in sorted_items[:4]:
            if item["meaningful_change_score"] >= 35:
                bullets.append({
                    "ticker": item["ticker"],
                    "display_ticker": item["display_ticker"],
                    "name": item["name"],
                    "sector": item["sector"],
                    "current_price": item["current_price"],
                    "price_delta_pct": item["price_delta_pct"],
                    "price_delta_abs": item["price_delta_abs"],
                    "explanation": item["explanation"],
                    "structured_reasons": item["structured_reasons"],
                    "mcs": item["meaningful_change_score"],
                    "urgency": item["urgency_level"]
                })

        if not bullets and sorted_items:
            top = sorted_items[0]
            bullets.append({
                "ticker": top["ticker"],
                "display_ticker": top["display_ticker"],
                "name": top["name"],
                "sector": top["sector"],
                "current_price": top["current_price"],
                "price_delta_pct": top["price_delta_pct"],
                "price_delta_abs": top["price_delta_abs"],
                "explanation": f"Trading steadily at ₹{top['current_price']:,.2f} ({top['price_delta_pct']:+.1f}%). No abnormal sector divergence.",
                "structured_reasons": [{"type": "steady", "label": "Steady", "text": f"Trading within normal expected bounds ({top['price_delta_pct']:+.1f}%)"}],
                "mcs": top["meaningful_change_score"],
                "urgency": "MARKET_NOISE"
            })

        headline = f"Executive Catch-Up ({len(critical_items) + len(meaningful_items)} notable shifts since {baseline_time_desc})"

        return {
            "headline": headline,
            "summary": f"Analyzed {len(evaluated_items)} tracked assets. {len(critical_items)} critical alerts and {len(meaningful_items)} notable movements.",
            "bullets": bullets,
            "critical_count": len(critical_items),
            "meaningful_count": len(meaningful_items),
            "quiet_count": len(quiet_items),
            "overall_market_mood": mood,
            "average_watchlist_delta": round(avg_change, 2)
        }


delta_engine = DeltaEngine()
