"""
Insight Generation Service.
Combines multi-factor signals into explainable insights.
Features deterministic rule-based explanations (fast & reliable) with optional
LLM summarization (Google Gemini / OpenAI) if an API key is configured.
"""
import os
import json
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Optional

from database import get_db_connection

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")


class InsightGenerationService:
    def __init__(self):
        self.has_llm = bool(GEMINI_API_KEY or OPENAI_API_KEY)

    def get_active_gemini_key(self) -> str:
        """Fetch API key from env or settings database table."""
        if GEMINI_API_KEY:
            return GEMINI_API_KEY
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT value FROM settings WHERE key = 'gemini_api_key'")
            row = cursor.fetchone()
            conn.close()
            if row and row["value"]:
                return row["value"].strip()
        except Exception:
            pass
        return ""

    def generate_stock_explanation(self, delta_data: Dict[str, Any]) -> str:
        """
        Fast, deterministic rule-based synthesizer.
        Zero latency and zero hallucinations.
        """
        reasons = []
        ticker = delta_data.get("ticker", "")
        price_delta = delta_data.get("price_delta_pct", 0.0)
        div = delta_data.get("divergence_pct", 0.0)
        rvol = delta_data.get("rvol", 1.0)
        z = delta_data.get("z_score", 0.0)
        news = delta_data.get("news_event", "")
        sector = delta_data.get("sector", "Sector")
        sec_etf = delta_data.get("sector_etf", "ETF")
        ripple = delta_data.get("ripple_info")

        # 1. Sector Divergence
        if abs(div) >= 2.0:
            direction = "lagged" if div < 0 else "outperformed"
            reasons.append(f"Diverged by {div:+.1f}% vs {sector} ({direction} {sec_etf})")
        elif abs(price_delta) >= 2.5:
            reasons.append(f"Sharp {price_delta:+.1f}% move ({z:.1f}σ deviation)")

        # 2. Volume Anomaly
        if rvol >= 2.0:
            reasons.append(f"Surged on {rvol:.1f}x abnormal volume")

        # 3. Catalyst Headline
        if news:
            reasons.append(f"Catalyst: {news}")

        # 4. Graph Ripple Contagion
        if ripple and ripple.get("ripple_score", 0) >= 30:
            src = ripple.get("propagated_from")
            rel = ripple.get("relationship", "peer")
            reasons.append(f"2nd-order graph ripple from {src} ({rel})")

        if not reasons:
            return f"Trading steadily within normal expected bounds ({price_delta:+.1f}% delta)"

        return " • ".join(reasons)

    def _call_gemini_summary(self, items_summary: str, baseline_desc: str, api_key: str) -> Optional[str]:
        """Call Google Gemini 1.5 Flash API with timeout to synthesize natural-language debriefing."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        prompt = (
            f"You are a senior Indian equities market analyst. Based on this session delta data since {baseline_desc}:\n"
            f"{items_summary}\n\n"
            f"Provide a concise, 2-sentence executive catch-up summarizing why these Indian stocks diverged and "
            f"key supply-chain or sectoral contagion factors. Focus strictly on facts provided."
        )
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "maxOutputTokens": 150,
                "temperature": 0.2
            }
        }
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=3.5) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    return text.strip() if text else None
        except Exception:
            return None
        return None

    def generate_executive_briefing(self, evaluated_items: List[Dict[str, Any]], baseline_desc: str) -> Dict[str, Any]:
        """
        Synthesizes watchlist items into high-conviction executive briefing bullets.
        Supports rule-based speed + optional Gemini AI enhancement.
        """
        critical = [x for x in evaluated_items if x.get("meaningful_change_score", 0) >= 70]
        meaningful = [x for x in evaluated_items if 45 <= x.get("meaningful_change_score", 0) < 70]
        quiet = [x for x in evaluated_items if x.get("meaningful_change_score", 0) < 45]

        # Top 4 actionable bullets
        bullets = []
        for item in evaluated_items[:4]:
            if item.get("meaningful_change_score", 0) >= 40:
                bullets.append({
                    "ticker": item["ticker"],
                    "headline": f"{item['ticker']} ({item['price_delta_pct']:+.1f}%): {item['explanation']}",
                    "mcs": item["meaningful_change_score"],
                    "urgency": item["urgency_level"]
                })

        if not bullets and evaluated_items:
            top = evaluated_items[0]
            bullets.append({
                "ticker": top["ticker"],
                "headline": f"Watchlist is steady. Top mover is {top['ticker']} at {top['price_delta_pct']:+.1f}%.",
                "mcs": top["meaningful_change_score"],
                "urgency": "MARKET_NOISE"
            })

        headline = f"Executive Catch-Up ({len(critical) + len(meaningful)} meaningful shifts since {baseline_desc})"
        default_summary = f"Evaluated {len(evaluated_items)} assets. {len(critical)} critical alerts and {len(meaningful)} notable movements."

        # Check for Gemini key
        gemini_key = self.get_active_gemini_key()
        ai_summary = None
        briefing_mode = "DETERMINISTIC_RULES"

        if gemini_key:
            items_text = "; ".join([
                f"{item['ticker']}: {item['price_delta_pct']:+.1f}%, divergence: {item.get('divergence_pct', 0.0):+.1f}%, note: {item['explanation']}"
                for item in evaluated_items[:5]
            ])
            ai_summary = self._call_gemini_summary(items_text, baseline_desc, gemini_key)
            if ai_summary:
                briefing_mode = "AI_GEMINI"

        return {
            "headline": headline,
            "summary": ai_summary or default_summary,
            "briefing_mode": briefing_mode,
            "bullets": bullets,
            "critical_count": len(critical),
            "meaningful_count": len(meaningful),
            "quiet_count": len(quiet)
        }


insight_service = InsightGenerationService()
