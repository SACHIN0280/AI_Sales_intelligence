from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/summary")
def get_analytics(db: Session = Depends(get_db)):
    leads = db.query(models.Lead).all()
    total_leads = len(leads)
    hot_leads = len([l for l in leads if l.status == "Hot Lead"])
    warm_leads = len([l for l in leads if l.status == "Warm Lead"])
    cold_leads = len([l for l in leads if l.status == "Cold Lead"])
    closed = len([l for l in leads if l.status == "Closed"])
    revenue_pipeline = sum(l.deal_value for l in leads if l.status != "Closed")
    closed_revenue = sum(l.deal_value for l in leads if l.status == "Closed")
    conversion_rate = round((closed / total_leads * 100) if total_leads > 0 else 0, 1)
    active_deals = hot_leads + warm_leads
    
    return {
        "total_leads": total_leads,
        "hot_leads": hot_leads,
        "warm_leads": warm_leads,
        "cold_leads": cold_leads,
        "closed": closed,
        "revenue_pipeline": revenue_pipeline,
        "closed_revenue": closed_revenue,
        "conversion_rate": conversion_rate,
        "active_deals": active_deals,
        "lead_status_distribution": [
            {"name": "Hot Lead", "value": hot_leads, "color": "#EF4444"},
            {"name": "Warm Lead", "value": warm_leads, "color": "#F59E0B"},
            {"name": "Cold Lead", "value": cold_leads, "color": "#6366F1"},
            {"name": "Closed", "value": closed, "color": "#10B981"}
        ],
        "weekly_revenue": [
            {"week": "Week 1", "revenue": 42000, "target": 50000},
            {"week": "Week 2", "revenue": 68000, "target": 55000},
            {"week": "Week 3", "revenue": 53000, "target": 60000},
            {"week": "Week 4", "revenue": 91000, "target": 65000},
            {"week": "Week 5", "revenue": 87000, "target": 70000},
            {"week": "Week 6", "revenue": 120000, "target": 75000}
        ],
        "funnel": [
            {"stage": "Prospects", "count": 240, "value": 1200000},
            {"stage": "Qualified", "count": 142, "value": 890000},
            {"stage": "Proposal", "count": 78, "value": 620000},
            {"stage": "Negotiation", "count": 34, "value": 380000},
            {"stage": "Closed Won", "count": 18, "value": 210000}
        ],
        "conversion_trends": [
            {"month": "Jan", "rate": 18.2},
            {"month": "Feb", "rate": 21.5},
            {"month": "Mar", "rate": 19.8},
            {"month": "Apr", "rate": 24.3},
            {"month": "May", "rate": 28.7},
            {"month": "Jun", "rate": 31.2}
        ]
    }
