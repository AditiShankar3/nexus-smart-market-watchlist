"""
Database models and SQLite connection setup with WAL mode, User Authentication,
and Exact Session Exit Price Tracking.
"""
import os
import sqlite3
import json
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "market_watchlist.db")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def init_db():
    """Initialize database schema with tables and indexes."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        created_at TEXT NOT NULL,
        last_login_at TEXT,
        last_logout_at TEXT,
        last_exit_prices_json TEXT,
        session_token TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS watchlists (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT NOT NULL,
        description TEXT,
        is_default INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS watchlist_items (
        id TEXT PRIMARY KEY,
        watchlist_id TEXT NOT NULL,
        ticker TEXT NOT NULL,
        notes TEXT,
        order_index INTEGER DEFAULT 0,
        added_at TEXT NOT NULL,
        FOREIGN KEY (watchlist_id) REFERENCES watchlists(id) ON DELETE CASCADE,
        UNIQUE(watchlist_id, ticker)
    );

    CREATE TABLE IF NOT EXISTS stock_metadata (
        ticker TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sector TEXT NOT NULL,
        industry TEXT,
        market_cap REAL,
        beta REAL DEFAULT 1.0,
        sector_etf TEXT NOT NULL,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS historical_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        price REAL NOT NULL,
        change_pct REAL NOT NULL,
        volume REAL NOT NULL,
        rvol REAL DEFAULT 1.0,
        volatility_z REAL DEFAULT 0.0,
        rsi REAL DEFAULT 50.0,
        sector_etf_change REAL DEFAULT 0.0,
        news_event TEXT,
        catalyst_severity REAL DEFAULT 0.0
    );

    CREATE TABLE IF NOT EXISTS user_checkpoints (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        checkpoint_name TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        prices_json TEXT,
        notes TEXT
    );

    CREATE TABLE IF NOT EXISTS graph_edges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        target TEXT NOT NULL,
        relationship_type TEXT NOT NULL,
        weight REAL DEFAULT 1.0,
        description TEXT,
        UNIQUE(source, target, relationship_type)
    );

    CREATE INDEX IF NOT EXISTS idx_snapshots_ticker_time ON historical_snapshots(ticker, timestamp);
    CREATE INDEX IF NOT EXISTS idx_watchlist_items_wl ON watchlist_items(watchlist_id);
    """)

    # Defensive schema migration for existing sqlite database files
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN session_token TEXT")
    except sqlite3.OperationalError:
        pass  # Column already exists

    # Seed Default Demo User if not exists
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'demo_user'")
    if cursor.fetchone()[0] == 0:
        now_iso = datetime.now(timezone.utc).isoformat()
        # Clean 2 hours ago calculation
        past_2h_iso = (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()
        cursor.execute("""
        INSERT INTO users (id, username, name, email, created_at, last_login_at, last_logout_at, last_exit_prices_json, session_token)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "usr_demo_01",
            "demo_user",
            "Aditi Shankar",
            "aditi@example.com",
            now_iso,
            now_iso,
            past_2h_iso,
            json.dumps({"RELIANCE.NS": 2940.00, "TCS.NS": 4180.00, "INFY.NS": 1755.00, "HDFCBANK.NS": 1665.00, "TATAMOTORS.NS": 945.00, "TATAPOWER.NS": 410.00}),
            "tok_demo_user"
        ))
    else:
        # Ensure demo user has a valid session_token
        cursor.execute("UPDATE users SET session_token = COALESCE(session_token, 'tok_demo_user') WHERE username = 'demo_user'")

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print(f"Database initialized at {DB_PATH}")
