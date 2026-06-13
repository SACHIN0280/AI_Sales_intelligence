from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os

from services.signal_data import (
    initialize_data,
    get_kpis,
    get_funnel,
    get_monthly_revenue,
    get_leaderboard,
    get_active_deals,
    get_product_revenue,
    get_region_revenue,
    get_sector_revenue,
    get_accounts
)

router = APIRouter(prefix="/api/signal", tags=["signal"])

# Initialize data cache when router is loaded
initialize_data()

@router.get("/dashboard")
def dashboard_data():
    return {
        "kpis": get_kpis(),
        "funnel": get_funnel(),
        "monthly_revenue": get_monthly_revenue(),
        "top_agents": get_leaderboard()[:5]
    }

@router.get("/leads")
def leads_data():
    return {
        "leads": get_active_deals()
    }

@router.get("/analytics")
def analytics_data():
    return {
        "monthly_revenue": get_monthly_revenue(),
        "product_revenue": get_product_revenue(),
        "funnel": get_funnel(),
        "region_revenue": get_region_revenue(),
        "sector_revenue": get_sector_revenue()
    }

@router.get("/leaderboard")
def leaderboard_data():
    return {
        "leaderboard": get_leaderboard()
    }

@router.get("/accounts")
def accounts_data():
    return {
        "accounts": get_accounts()
    }

@router.get("/products")
def products_data():
    return {
        "products": get_product_revenue()
    }

@router.get("/transcripts")
def transcripts_data():
    path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "transcripts.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return {"transcripts": json.load(f)}
    return {"transcripts": []}

@router.get("/activities")
def activities_data():
    path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "activities.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return {"activities": json.load(f)}
    return {"activities": []}
