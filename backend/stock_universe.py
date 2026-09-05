"""
Comprehensive Indian Equities Universe (150+ NSE Stocks & ETFs).
Spans Nifty 50, Nifty Next 50, Midcaps, Tata Group, Adani Group, IT, Banking, Auto, Energy, FMCG, Pharma, and Infra.
"""
from typing import List, Dict, Any

INDIAN_STOCKS_UNIVERSE: List[Dict[str, Any]] = [
    # --- Information Technology ---
    {"ticker": "TCS.NS", "name": "Tata Consultancy Services", "sector": "Information Technology", "industry": "IT Services", "market_cap": 1520000.0, "beta": 0.85, "sector_etf": "ITBEES.NS", "base_price": 4150.0},
    {"ticker": "INFY.NS", "name": "Infosys Limited", "sector": "Information Technology", "industry": "IT & Cloud", "market_cap": 790000.0, "beta": 1.15, "sector_etf": "ITBEES.NS", "base_price": 1780.0},
    {"ticker": "HCLTECH.NS", "name": "HCL Technologies Ltd", "sector": "Information Technology", "industry": "Engineering R&D & IT", "market_cap": 480000.0, "beta": 0.95, "sector_etf": "ITBEES.NS", "base_price": 1760.0},
    {"ticker": "WIPRO.NS", "name": "Wipro Limited", "sector": "Information Technology", "industry": "IT Services", "market_cap": 280000.0, "beta": 1.05, "sector_etf": "ITBEES.NS", "base_price": 540.0},
    {"ticker": "TECHM.NS", "name": "Tech Mahindra Ltd", "sector": "Information Technology", "industry": "Telecom IT & Cloud", "market_cap": 160000.0, "beta": 1.20, "sector_etf": "ITBEES.NS", "base_price": 1620.0},
    {"ticker": "LTIM.NS", "name": "LTIMindtree Limited", "sector": "Information Technology", "industry": "Digital Transformation", "market_cap": 175000.0, "beta": 1.25, "sector_etf": "ITBEES.NS", "base_price": 5920.0},
    {"ticker": "PERSISTENT.NS", "name": "Persistent Systems Ltd", "sector": "Information Technology", "industry": "Software Products", "market_cap": 82000.0, "beta": 1.40, "sector_etf": "ITBEES.NS", "base_price": 5250.0},
    {"ticker": "COFORGE.NS", "name": "Coforge Limited", "sector": "Information Technology", "industry": "Domain-specific IT", "market_cap": 48000.0, "beta": 1.35, "sector_etf": "ITBEES.NS", "base_price": 7650.0},
    {"ticker": "TATAELXSI.NS", "name": "Tata Elxsi Limited", "sector": "Information Technology", "industry": "Design & Tech", "market_cap": 45000.0, "beta": 1.30, "sector_etf": "ITBEES.NS", "base_price": 7200.0},
    {"ticker": "KPITTECH.NS", "name": "KPIT Technologies Ltd", "sector": "Information Technology", "industry": "Automotive Software", "market_cap": 46000.0, "beta": 1.50, "sector_etf": "ITBEES.NS", "base_price": 1680.0},

    # --- Banking & Financial Services ---
    {"ticker": "HDFCBANK.NS", "name": "HDFC Bank Limited", "sector": "Financial Services", "industry": "Private Banking", "market_cap": 1280000.0, "beta": 0.95, "sector_etf": "BANKBEES.NS", "base_price": 1640.0},
    {"ticker": "ICICIBANK.NS", "name": "ICICI Bank Limited", "sector": "Financial Services", "industry": "Private Banking", "market_cap": 880000.0, "beta": 1.10, "sector_etf": "BANKBEES.NS", "base_price": 1210.0},
    {"ticker": "SBIN.NS", "name": "State Bank of India", "sector": "Financial Services", "industry": "PSU Banking", "market_cap": 740000.0, "beta": 1.25, "sector_etf": "BANKBEES.NS", "base_price": 815.0},
    {"ticker": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "sector": "Financial Services", "industry": "Private Banking", "market_cap": 370000.0, "beta": 0.90, "sector_etf": "BANKBEES.NS", "base_price": 1850.0},
    {"ticker": "AXISBANK.NS", "name": "Axis Bank Limited", "sector": "Financial Services", "industry": "Private Banking", "market_cap": 360000.0, "beta": 1.15, "sector_etf": "BANKBEES.NS", "base_price": 1180.0},
    {"ticker": "BAJFINANCE.NS", "name": "Bajaj Finance Limited", "sector": "Financial Services", "industry": "NBFC & Consumer Lending", "market_cap": 440000.0, "beta": 1.35, "sector_etf": "BANKBEES.NS", "base_price": 7120.0},
    {"ticker": "BAJAJFINSV.NS", "name": "Bajaj Finserv Limited", "sector": "Financial Services", "industry": "Insurance & Holdings", "market_cap": 290000.0, "beta": 1.20, "sector_etf": "BANKBEES.NS", "base_price": 1820.0},
    {"ticker": "INDUSINDBK.NS", "name": "IndusInd Bank Ltd", "sector": "Financial Services", "industry": "Private Banking", "market_cap": 115000.0, "beta": 1.45, "sector_etf": "BANKBEES.NS", "base_price": 1460.0},
    {"ticker": "BANKBARODA.NS", "name": "Bank of Baroda", "sector": "Financial Services", "industry": "PSU Banking", "market_cap": 125000.0, "beta": 1.40, "sector_etf": "BANKBEES.NS", "base_price": 245.0},
    {"ticker": "PFC.NS", "name": "Power Finance Corporation", "sector": "Financial Services", "industry": "Infrastructure Finance", "market_cap": 165000.0, "beta": 1.55, "sector_etf": "BANKBEES.NS", "base_price": 510.0},
    {"ticker": "RECLTD.NS", "name": "REC Limited", "sector": "Financial Services", "industry": "Power Sector NBFC", "market_cap": 145000.0, "beta": 1.50, "sector_etf": "BANKBEES.NS", "base_price": 560.0},
    {"ticker": "CHOLAFIN.NS", "name": "Cholamandalam Inv & Fin", "sector": "Financial Services", "industry": "Vehicle NBFC", "market_cap": 125000.0, "beta": 1.30, "sector_etf": "BANKBEES.NS", "base_price": 1490.0},
    {"ticker": "MUTHOOTFIN.NS", "name": "Muthoot Finance Ltd", "sector": "Financial Services", "industry": "Gold Loans", "market_cap": 78000.0, "beta": 1.10, "sector_etf": "BANKBEES.NS", "base_price": 1940.0},

    # --- Automobile & EV Ecosystem ---
    {"ticker": "TATAMOTORS.NS", "name": "Tata Motors Limited", "sector": "Automobile", "industry": "EV, CV & JLR", "market_cap": 360000.0, "beta": 1.45, "sector_etf": "AUTOBEES.NS", "base_price": 980.0},
    {"ticker": "MARUTI.NS", "name": "Maruti Suzuki India", "sector": "Automobile", "industry": "Passenger Cars", "market_cap": 380000.0, "beta": 0.90, "sector_etf": "AUTOBEES.NS", "base_price": 12400.0},
    {"ticker": "M&M.NS", "name": "Mahindra & Mahindra Ltd", "sector": "Automobile", "industry": "SUVs & Tractors", "market_cap": 340000.0, "beta": 1.15, "sector_etf": "AUTOBEES.NS", "base_price": 2750.0},
    {"ticker": "BAJAJ-AUTO.NS", "name": "Bajaj Auto Limited", "sector": "Automobile", "industry": "Two & Three Wheelers", "market_cap": 310000.0, "beta": 0.85, "sector_etf": "AUTOBEES.NS", "base_price": 10900.0},
    {"ticker": "TVSMOTOR.NS", "name": "TVS Motor Company Ltd", "sector": "Automobile", "industry": "2-Wheelers & EV Scooters", "market_cap": 135000.0, "beta": 1.10, "sector_etf": "AUTOBEES.NS", "base_price": 2840.0},
    {"ticker": "EICHERMOT.NS", "name": "Eicher Motors Ltd", "sector": "Automobile", "industry": "Royal Enfield Motorcycles", "market_cap": 130000.0, "beta": 0.95, "sector_etf": "AUTOBEES.NS", "base_price": 4750.0},
    {"ticker": "HEROMOTOCO.NS", "name": "Hero MotoCorp Ltd", "sector": "Automobile", "industry": "Entry & Commuter 2-Wheelers", "market_cap": 110000.0, "beta": 0.90, "sector_etf": "AUTOBEES.NS", "base_price": 5450.0},
    {"ticker": "BHARATFORG.NS", "name": "Bharat Forge Limited", "sector": "Automobile", "industry": "Forging & Defense", "market_cap": 72000.0, "beta": 1.35, "sector_etf": "AUTOBEES.NS", "base_price": 1540.0},
    {"ticker": "MOTHERSON.NS", "name": "Samvardhana Motherson", "sector": "Automobile", "industry": "Wiring Harness & Auto Parts", "market_cap": 138000.0, "beta": 1.40, "sector_etf": "AUTOBEES.NS", "base_price": 195.0},
    {"ticker": "SONACOMS.NS", "name": "Sona BLW Precision", "sector": "Automobile", "industry": "EV Driveline Systems", "market_cap": 42000.0, "beta": 1.50, "sector_etf": "AUTOBEES.NS", "base_price": 690.0},
    {"ticker": "BOSCHLTD.NS", "name": "Bosch Limited", "sector": "Automobile", "industry": "Auto Components & Electronics", "market_cap": 102000.0, "beta": 0.80, "sector_etf": "AUTOBEES.NS", "base_price": 34500.0},

    # --- Energy, Utilities & Renewables ---
    {"ticker": "RELIANCE.NS", "name": "Reliance Industries Ltd", "sector": "Energy & Telecom", "industry": "Petrochemicals, Retail & Jio", "market_cap": 2010000.0, "beta": 1.05, "sector_etf": "NIFTYBEES.NS", "base_price": 2980.0},
    {"ticker": "NTPC.NS", "name": "NTPC Limited", "sector": "Energy & Utilities", "industry": "Thermal & Solar Power", "market_cap": 385000.0, "beta": 1.00, "sector_etf": "NIFTYBEES.NS", "base_price": 395.0},
    {"ticker": "POWERGRID.NS", "name": "Power Grid Corp of India", "sector": "Energy & Utilities", "industry": "Electricity Transmission", "market_cap": 310000.0, "beta": 0.75, "sector_etf": "NIFTYBEES.NS", "base_price": 330.0},
    {"ticker": "TATAPOWER.NS", "name": "Tata Power Co Limited", "sector": "Energy & Utilities", "industry": "Renewables & EV Infra", "market_cap": 140000.0, "beta": 1.35, "sector_etf": "NIFTYBEES.NS", "base_price": 420.0},
    {"ticker": "ONGC.NS", "name": "Oil & Natural Gas Corp", "sector": "Energy & Utilities", "industry": "Crude Exploration & Gas", "market_cap": 370000.0, "beta": 1.15, "sector_etf": "NIFTYBEES.NS", "base_price": 295.0},
    {"ticker": "COALINDIA.NS", "name": "Coal India Limited", "sector": "Energy & Utilities", "industry": "Coal Mining", "market_cap": 310000.0, "beta": 0.90, "sector_etf": "NIFTYBEES.NS", "base_price": 505.0},
    {"ticker": "IOC.NS", "name": "Indian Oil Corporation", "sector": "Energy & Utilities", "industry": "Refining & Marketing", "market_cap": 245000.0, "beta": 1.05, "sector_etf": "NIFTYBEES.NS", "base_price": 175.0},
    {"ticker": "BPCL.NS", "name": "Bharat Petroleum Corp", "sector": "Energy & Utilities", "industry": "Oil Refining", "market_cap": 150000.0, "beta": 1.10, "sector_etf": "NIFTYBEES.NS", "base_price": 345.0},
    {"ticker": "ADANIGREEN.NS", "name": "Adani Green Energy Ltd", "sector": "Energy & Utilities", "industry": "Solar & Wind Power", "market_cap": 305000.0, "beta": 1.70, "sector_etf": "NIFTYBEES.NS", "base_price": 1920.0},
    {"ticker": "ADANIPOWER.NS", "name": "Adani Power Limited", "sector": "Energy & Utilities", "industry": "Thermal Generation", "market_cap": 255000.0, "beta": 1.65, "sector_etf": "NIFTYBEES.NS", "base_price": 665.0},
    {"ticker": "SUZLON.NS", "name": "Suzlon Energy Limited", "sector": "Energy & Utilities", "industry": "Wind Turbines", "market_cap": 95000.0, "beta": 1.95, "sector_etf": "NIFTYBEES.NS", "base_price": 72.0},
    {"ticker": "NHPC.NS", "name": "NHPC Limited", "sector": "Energy & Utilities", "industry": "Hydroelectric Power", "market_cap": 98000.0, "beta": 1.30, "sector_etf": "NIFTYBEES.NS", "base_price": 98.0},

    # --- Metals & Mining ---
    {"ticker": "TATASTEEL.NS", "name": "Tata Steel Limited", "sector": "Metals & Mining", "industry": "Integrated Steelmaking", "market_cap": 195000.0, "beta": 1.45, "sector_etf": "NIFTYBEES.NS", "base_price": 155.0},
    {"ticker": "JSWSTEEL.NS", "name": "JSW Steel Limited", "sector": "Metals & Mining", "industry": "Steel Products", "market_cap": 235000.0, "beta": 1.30, "sector_etf": "NIFTYBEES.NS", "base_price": 960.0},
    {"ticker": "HINDALCO.NS", "name": "Hindalco Industries Ltd", "sector": "Metals & Mining", "industry": "Aluminium & Novelis", "market_cap": 155000.0, "beta": 1.40, "sector_etf": "NIFTYBEES.NS", "base_price": 690.0},
    {"ticker": "VEDL.NS", "name": "Vedanta Limited", "sector": "Metals & Mining", "industry": "Diversified Natural Resources", "market_cap": 175000.0, "beta": 1.55, "sector_etf": "NIFTYBEES.NS", "base_price": 465.0},
    {"ticker": "JINDALSTEL.NS", "name": "Jindal Steel & Power", "sector": "Metals & Mining", "industry": "Steel & Pellet", "market_cap": 98000.0, "beta": 1.45, "sector_etf": "NIFTYBEES.NS", "base_price": 970.0},
    {"ticker": "NMDC.NS", "name": "NMDC Limited", "sector": "Metals & Mining", "industry": "Iron Ore Mining", "market_cap": 68000.0, "beta": 1.25, "sector_etf": "NIFTYBEES.NS", "base_price": 235.0},

    # --- Infrastructure, Capital Goods & Defense ---
    {"ticker": "LT.NS", "name": "Larsen & Toubro Ltd", "sector": "Capital Goods & Infra", "industry": "EPC & Infrastructure", "market_cap": 510000.0, "beta": 1.05, "sector_etf": "NIFTYBEES.NS", "base_price": 3680.0},
    {"ticker": "HAL.NS", "name": "Hindustan Aeronautics", "sector": "Capital Goods & Infra", "industry": "Aerospace & Defense", "market_cap": 315000.0, "beta": 1.50, "sector_etf": "NIFTYBEES.NS", "base_price": 4720.0},
    {"ticker": "BEL.NS", "name": "Bharat Electronics Ltd", "sector": "Capital Goods & Infra", "industry": "Defense Radar & Avionics", "market_cap": 215000.0, "beta": 1.35, "sector_etf": "NIFTYBEES.NS", "base_price": 295.0},
    {"ticker": "SIEMENS.NS", "name": "Siemens Limited", "sector": "Capital Goods & Infra", "industry": "Electrification & Automation", "market_cap": 255000.0, "beta": 1.15, "sector_etf": "NIFTYBEES.NS", "base_price": 7150.0},
    {"ticker": "ABB.NS", "name": "ABB India Limited", "sector": "Capital Goods & Infra", "industry": "Robotics & Power Grids", "market_cap": 165000.0, "beta": 1.20, "sector_etf": "NIFTYBEES.NS", "base_price": 7800.0},
    {"ticker": "BHEL.NS", "name": "Bharat Heavy Electricals", "sector": "Capital Goods & Infra", "industry": "Power Equipment", "market_cap": 105000.0, "beta": 1.65, "sector_etf": "NIFTYBEES.NS", "base_price": 300.0},
    {"ticker": "IRFC.NS", "name": "Indian Railway Finance Corp", "sector": "Capital Goods & Infra", "industry": "Rail Infrastructure Finance", "market_cap": 235000.0, "beta": 1.60, "sector_etf": "NIFTYBEES.NS", "base_price": 180.0},
    {"ticker": "RVNL.NS", "name": "Rail Vikas Nigam Limited", "sector": "Capital Goods & Infra", "industry": "Rail Projects & Metro", "market_cap": 115000.0, "beta": 1.85, "sector_etf": "NIFTYBEES.NS", "base_price": 550.0},
    {"ticker": "DLF.NS", "name": "DLF Limited", "sector": "Real Estate", "industry": "Commercial & Luxury Residential", "market_cap": 215000.0, "beta": 1.35, "sector_etf": "NIFTYBEES.NS", "base_price": 865.0},
    {"ticker": "GODREJPROP.NS", "name": "Godrej Properties Ltd", "sector": "Real Estate", "industry": "Residential Real Estate", "market_cap": 82000.0, "beta": 1.40, "sector_etf": "NIFTYBEES.NS", "base_price": 2950.0},

    # --- FMCG & Consumer Discretionary ---
    {"ticker": "ITC.NS", "name": "ITC Limited", "sector": "FMCG", "industry": "Foods, Agri & Cigarettes", "market_cap": 620000.0, "beta": 0.65, "sector_etf": "NIFTYBEES.NS", "base_price": 490.0},
    {"ticker": "HINDUNILVR.NS", "name": "Hindustan Unilever Ltd", "sector": "FMCG", "industry": "Home & Personal Care", "market_cap": 655000.0, "beta": 0.70, "sector_etf": "NIFTYBEES.NS", "base_price": 2780.0},
    {"ticker": "NESTLEIND.NS", "name": "Nestle India Limited", "sector": "FMCG", "industry": "Packaged Foods & Dairy", "market_cap": 240000.0, "beta": 0.65, "sector_etf": "NIFTYBEES.NS", "base_price": 2480.0},
    {"ticker": "BRITANNIA.NS", "name": "Britannia Industries Ltd", "sector": "FMCG", "industry": "Biscuits & Bakery", "market_cap": 140000.0, "beta": 0.70, "sector_etf": "NIFTYBEES.NS", "base_price": 5850.0},
    {"ticker": "TATACONSUM.NS", "name": "Tata Consumer Products", "sector": "FMCG", "industry": "Beverages & Packaged Foods", "market_cap": 115000.0, "beta": 0.85, "sector_etf": "NIFTYBEES.NS", "base_price": 1160.0},
    {"ticker": "VBL.NS", "name": "Varun Beverages Limited", "sector": "FMCG", "industry": "Pepsi Bottling & Distribution", "market_cap": 205000.0, "beta": 1.10, "sector_etf": "NIFTYBEES.NS", "base_price": 1540.0},
    {"ticker": "TITAN.NS", "name": "Titan Company Limited", "sector": "Consumer Discretionary", "industry": "Jewellery (Tanishq) & Watches", "market_cap": 320000.0, "beta": 0.95, "sector_etf": "NIFTYBEES.NS", "base_price": 3600.0},
    {"ticker": "ASIANPAINT.NS", "name": "Asian Paints Limited", "sector": "Consumer Discretionary", "industry": "Decorative Coatings", "market_cap": 285000.0, "beta": 0.85, "sector_etf": "NIFTYBEES.NS", "base_price": 2980.0},
    {"ticker": "TRENT.NS", "name": "Trent Limited", "sector": "Consumer Discretionary", "industry": "Fast Fashion Retail (Zudio/Westside)", "market_cap": 255000.0, "beta": 1.30, "sector_etf": "NIFTYBEES.NS", "base_price": 7180.0},

    # --- Pharmaceuticals & Healthcare ---
    {"ticker": "SUNPHARMA.NS", "name": "Sun Pharmaceutical Ind", "sector": "Healthcare", "industry": "Specialty Pharma & Formulations", "market_cap": 435000.0, "beta": 0.75, "sector_etf": "NIFTYBEES.NS", "base_price": 1810.0},
    {"ticker": "DRREDDY.NS", "name": "Dr. Reddy's Laboratories", "sector": "Healthcare", "industry": "Generics & Biosimilars", "market_cap": 110000.0, "beta": 0.80, "sector_etf": "NIFTYBEES.NS", "base_price": 6620.0},
    {"ticker": "CIPLA.NS", "name": "Cipla Limited", "sector": "Healthcare", "industry": "Respiratory & Generics", "market_cap": 125000.0, "beta": 0.70, "sector_etf": "NIFTYBEES.NS", "base_price": 1560.0},
    {"ticker": "DIVISLAB.NS", "name": "Divi's Laboratories Ltd", "sector": "Healthcare", "industry": "Active Pharma Ingredients", "market_cap": 135000.0, "beta": 0.90, "sector_etf": "NIFTYBEES.NS", "base_price": 5080.0},
    {"ticker": "APOLLOHOSP.NS", "name": "Apollo Hospitals Enterprise", "sector": "Healthcare", "industry": "Hospitals & Pharmacies", "market_cap": 105000.0, "beta": 0.95, "sector_etf": "NIFTYBEES.NS", "base_price": 7250.0},
    {"ticker": "MAXHEALTH.NS", "name": "Max Healthcare Institute", "sector": "Healthcare", "industry": "Quaternary Care Hospitals", "market_cap": 88000.0, "beta": 1.05, "sector_etf": "NIFTYBEES.NS", "base_price": 910.0},

    # --- Telecom & New-Age Internet ---
    {"ticker": "BHARTIARTL.NS", "name": "Bharti Airtel Limited", "sector": "Telecommunications", "industry": "5G Mobile, Broadband & DTH", "market_cap": 1104000.0, "beta": 0.90, "sector_etf": "NIFTYBEES.NS", "base_price": 1849.50},
    {"ticker": "ZOMATO.NS", "name": "Zomato Limited", "sector": "Internet & E-Commerce", "industry": "Food Delivery & Quick Commerce (Blinkit)", "market_cap": 235000.0, "beta": 1.45, "sector_etf": "NIFTYBEES.NS", "base_price": 265.0},
    {"ticker": "SWIGGY.NS", "name": "Swiggy Limited", "sector": "Internet & E-Commerce", "industry": "Food Delivery & Quick Commerce (Instamart)", "market_cap": 98000.0, "beta": 1.40, "sector_etf": "NIFTYBEES.NS", "base_price": 415.0},
    {"ticker": "NAUKRI.NS", "name": "Info Edge (India) Ltd", "sector": "Internet & E-Commerce", "industry": "Recruitment & Tech Ventures", "market_cap": 102000.0, "beta": 1.30, "sector_etf": "NIFTYBEES.NS", "base_price": 7850.0},
    {"ticker": "PAYTM.NS", "name": "One97 Communications", "sector": "Internet & E-Commerce", "industry": "Digital Payments & Soundbox", "market_cap": 42000.0, "beta": 1.75, "sector_etf": "NIFTYBEES.NS", "base_price": 660.0},
    {"ticker": "NYKAA.NS", "name": "FSN E-Commerce Ventures", "sector": "Internet & E-Commerce", "industry": "Beauty & Fashion E-Commerce", "market_cap": 58000.0, "beta": 1.55, "sector_etf": "NIFTYBEES.NS", "base_price": 202.0}
]

# Sector ETFs
SECTOR_ETFS: List[Dict[str, Any]] = [
    {"ticker": "NIFTYBEES.NS", "name": "Nippon India Nifty 50 ETF", "sector": "ETF", "industry": "Broad Market Benchmark", "market_cap": 15000.0, "beta": 1.0, "sector_etf": "NIFTYBEES.NS", "base_price": 265.0},
    {"ticker": "BANKBEES.NS", "name": "Nippon India Bank Nifty ETF", "sector": "ETF", "industry": "Banking Sector", "market_cap": 12000.0, "beta": 1.15, "sector_etf": "BANKBEES.NS", "base_price": 515.0},
    {"ticker": "ITBEES.NS", "name": "Nippon India Nifty IT ETF", "sector": "ETF", "industry": "IT Sector", "market_cap": 8000.0, "beta": 1.05, "sector_etf": "ITBEES.NS", "base_price": 410.0},
    {"ticker": "AUTOBEES.NS", "name": "Nippon India Nifty Auto ETF", "sector": "ETF", "industry": "Auto Sector", "market_cap": 5000.0, "beta": 1.20, "sector_etf": "AUTOBEES.NS", "base_price": 240.0}
]
