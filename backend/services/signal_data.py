import csv
import os
from collections import defaultdict, Counter
from datetime import datetime

# Data paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def _load_csv(filename):
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

# Global state to hold pre-computed data
data_cache = {}

def initialize_data():
    """Load and pre-compute all analytics from CSVs."""
    global data_cache
    if data_cache:
        return  # Already loaded

    pipeline = _load_csv("sales_pipeline.csv")
    accounts = _load_csv("accounts.csv")
    teams = _load_csv("sales_teams.csv")
    products = _load_csv("products.csv")

    # Mappings
    agent_to_manager = {t["sales_agent"]: t["manager"] for t in teams}
    agent_to_region = {t["sales_agent"]: t["regional_office"] for t in teams}
    account_map = {a["account"]: a for a in accounts}
    product_map = {p["product"]: p for p in products}

    # Core Pipeline Stats
    total_revenue = 0
    won_count = 0
    lost_count = 0
    active_count = 0
    stage_counts = Counter()
    monthly_rev = defaultdict(float)

    # Agent Stats
    agent_stats = defaultdict(lambda: {"won": 0, "lost": 0, "active": 0, "revenue": 0})
    
    # Product Stats
    product_stats = defaultdict(lambda: {"revenue": 0, "won": 0})

    # Region Stats
    region_stats = defaultdict(lambda: {"revenue": 0, "won": 0})
    
    # Sector Stats
    sector_stats = defaultdict(float)

    for r in pipeline:
        acc_name = r["account"].strip()
        if not acc_name:
            continue
            
        stage = r["deal_stage"]
        stage_counts[stage] += 1
        agent = r["sales_agent"]
        val = float(r["close_value"]) if r.get("close_value") and r["close_value"].strip() else 0
        prod = r["product"]
        acc = account_map.get(acc_name, {})
        region = agent_to_region.get(agent, "Unknown")
        sector = acc.get("sector", "Unknown")

        if stage == "Won":
            won_count += 1
            total_revenue += val
            agent_stats[agent]["won"] += 1
            agent_stats[agent]["revenue"] += val
            product_stats[prod]["won"] += 1
            product_stats[prod]["revenue"] += val
            region_stats[region]["won"] += 1
            region_stats[region]["revenue"] += val
            sector_stats[sector] += val
            
            # Monthly trend
            if r.get("close_date"):
                try:
                    d = datetime.strptime(r["close_date"].strip(), "%Y-%m-%d")
                    monthly_rev[f"{d.year}-{d.month:02d}"] += val
                except ValueError:
                    pass
        elif stage == "Lost":
            lost_count += 1
            agent_stats[agent]["lost"] += 1
        else:
            # Engaging or Prospecting
            active_count += 1
            agent_stats[agent]["active"] += 1

    win_rate = (won_count / (won_count + lost_count)) * 100 if (won_count + lost_count) > 0 else 0
    avg_deal_size = total_revenue / won_count if won_count > 0 else 0

    # Sort Monthly Data
    sorted_months = sorted(monthly_rev.items())
    
    # Leaderboard
    leaderboard = []
    for agent, stats in agent_stats.items():
        w = stats["won"]
        l = stats["lost"]
        t = w + l
        wr = (w / t * 100) if t > 0 else 0
        leaderboard.append({
            "agent": agent,
            "manager": agent_to_manager.get(agent, "Unknown"),
            "region": agent_to_region.get(agent, "Unknown"),
            "won": w,
            "revenue": stats["revenue"],
            "win_rate": wr,
            "active": stats["active"]
        })
    leaderboard.sort(key=lambda x: x["revenue"], reverse=True)

    # Active Leads Enriched
    active_deals = []
    for r in pipeline:
        if r["deal_stage"] in ("Engaging", "Prospecting"):
            agent = r["sales_agent"]
            # Base score on agent win rate
            a_stats = agent_stats.get(agent, {})
            w = a_stats.get("won", 0)
            t = w + a_stats.get("lost", 0)
            base_wr = (w / t * 100) if t > 0 else 50
            
            account_name = r["account"].strip()
            if not account_name:
                continue

            # Days in stage
            days = 0
            if r.get("engage_date"):
                try:
                    d = datetime.strptime(r["engage_date"].strip(), "%Y-%m-%d")
                    # Relative to Dec 2017 (end of dataset)
                    ref_date = datetime(2017, 12, 31)
                    days = (ref_date - d).days
                except ValueError:
                    pass
            days = max(0, days)

            # Artificial score logic (since we don't have deal size for active, we use product price)
            prod = product_map.get(r["product"], {})
            price = float(prod.get("sales_price", 0)) if prod.get("sales_price") else 0
            
            # Hot > 75, Warm 50-74, Cold < 50
            score = int(base_wr + (price / 1000) * 5)
            if r["deal_stage"] == "Engaging":
                score += 10
            
            # Penalize if it's been in stage for too long (e.g. stuck deals)
            # Subtract 1 point for every 5 days over 30 days
            if days > 30:
                score -= int((days - 30) / 5)
                
            # Add tiny deterministic variation so they aren't all exactly 99
            jitter = (len(account_name) % 5)
            score -= jitter
            
            score = min(99, max(10, score))
            
            status = "Hot Lead" if score >= 75 else "Warm Lead" if score >= 50 else "Cold Lead"
            
            acc_info = account_map.get(r["account"], {})
            
            active_deals.append({
                "opportunity_id": r["opportunity_id"],
                "account": account_name,
                "sector": acc_info.get("sector", "Unknown"),
                "agent": agent,
                "product": r["product"],
                "stage": r["deal_stage"],
                "days_in_stage": days,
                "ai_score": score,
                "status": status,
                "estimated_value": price
            })
    
    # Products
    product_list = []
    for p, stats in product_stats.items():
        product_list.append({
            "product": p,
            "revenue": stats["revenue"],
            "won": stats["won"]
        })
    product_list.sort(key=lambda x: x["revenue"], reverse=True)

    data_cache = {
        "kpis": {
            "total_revenue": total_revenue,
            "win_rate": win_rate,
            "active_deals": active_count,
            "avg_deal_size": avg_deal_size,
        },
        "funnel": dict(stage_counts),
        "monthly_revenue": [{"month": m, "revenue": v} for m, v in sorted_months],
        "leaderboard": leaderboard,
        "active_deals": active_deals,
        "product_revenue": product_list,
        "region_revenue": [{"region": k, "revenue": v["revenue"]} for k, v in region_stats.items()],
        "sector_revenue": [{"sector": k, "revenue": v} for k, v in sector_stats.items()],
        "accounts": accounts
    }

def get_kpis():
    return data_cache.get("kpis", {})

def get_funnel():
    return data_cache.get("funnel", {})

def get_monthly_revenue():
    return data_cache.get("monthly_revenue", [])

def get_leaderboard():
    return data_cache.get("leaderboard", [])

def get_active_deals():
    return data_cache.get("active_deals", [])

def get_product_revenue():
    return data_cache.get("product_revenue", [])

def get_region_revenue():
    return data_cache.get("region_revenue", [])

def get_sector_revenue():
    return data_cache.get("sector_revenue", [])

def get_accounts():
    return data_cache.get("accounts", [])
