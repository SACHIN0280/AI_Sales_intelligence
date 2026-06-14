from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from database import engine, Base, SessionLocal
import models
from routes import leads, ai, analytics, activity, signal

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SalesMind AI", version="1.0.0")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leads.router)
app.include_router(ai.router)
app.include_router(analytics.router)
app.include_router(activity.router)
app.include_router(signal.router)

@app.get("/")
def root():
    return {"message": "SalesMind AI API", "version": "1.0.0", "status": "running"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.get("/api/insights")
def get_insights():
    return {
        "priority_leads": [
            {"name": "Sarah Johnson", "company": "TechFlow Inc", "score": 94, "reason": "High buying intent, demo scheduled", "deal_value": 85000},
            {"name": "Marcus Chen", "company": "DataVault Co", "score": 88, "reason": "Budget confirmed, Q4 deadline", "deal_value": 62000},
            {"name": "Elena Rodriguez", "company": "ScaleUp Labs", "score": 81, "reason": "Strong engagement, multiple touchpoints", "deal_value": 47000}
        ],
        "at_risk": [
            {"name": "James Wilson", "company": "OldCo Corp", "score": 32, "reason": "No response in 14 days", "deal_value": 28000},
            {"name": "Priya Patel", "company": "StartRight LLC", "score": 28, "reason": "Budget frozen until Q1", "deal_value": 18000}
        ],
        "reminders": [
            {"lead": "Sarah Johnson", "action": "Send customized proposal by EOD", "urgency": "high"},
            {"lead": "Marcus Chen", "action": "Schedule executive business review", "urgency": "medium"},
            {"lead": "Raj Mehta", "action": "Follow up on trial experience", "urgency": "medium"}
        ],
        "predicted_closures": [
            {"name": "Sarah Johnson", "probability": 87, "expected_date": "Jun 28, 2026", "deal_value": 85000},
            {"name": "Marcus Chen", "probability": 72, "expected_date": "Jul 5, 2026", "deal_value": 62000},
            {"name": "Ava Thompson", "probability": 61, "expected_date": "Jul 15, 2026", "deal_value": 34000}
        ],
        "strategy_suggestions": [
            "Focus Q2 outreach on Series B startups — 3x higher conversion rate",
            "Schedule demos on Tuesday-Thursday 2-4pm for 28% higher show rates",
            "Add ROI calculator to proposals — deals close 40% faster",
            "Personalize LinkedIn follow-ups within 2 hours of a meeting for best engagement"
        ]
    }

# Seed mock data on startup
from mock_seed import seed_database as run_mock_seed

@app.on_event("startup")
def seed_database():
    run_mock_seed()
