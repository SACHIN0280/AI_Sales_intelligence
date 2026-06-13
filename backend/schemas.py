from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LeadCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    lead_score: Optional[int] = 0
    deal_value: Optional[float] = 0.0
    status: Optional[str] = "Warm Lead"
    last_interaction: Optional[str] = None
    notes: Optional[str] = None

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    lead_score: Optional[int] = None
    deal_value: Optional[float] = None
    status: Optional[str] = None
    last_interaction: Optional[str] = None
    notes: Optional[str] = None

class LeadResponse(BaseModel):
    id: int
    name: str
    company: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    lead_score: int
    deal_value: float
    status: str
    last_interaction: Optional[str]
    notes: Optional[str]
    created_at: Optional[datetime]
    class Config:
        from_attributes = True

class LeadScoringRequest(BaseModel):
    client_notes: str
    meeting_summary: Optional[str] = ""
    interaction_history: Optional[str] = ""

class LeadScoringResponse(BaseModel):
    score: int
    classification: str
    reasoning: str
    next_action: str
    buying_intent: int
    urgency: int
    sentiment: int
    engagement: int
    confidence: int

class MeetingSummaryRequest(BaseModel):
    raw_notes: str

class MeetingSummaryResponse(BaseModel):
    key_requirements: List[str]
    objections: List[str]
    pain_points: List[str]
    action_items: List[str]
    follow_up_tasks: List[str]
    next_meeting_suggestion: str
    sentiment: str
    summary: str

class FollowUpRequest(BaseModel):
    context: str
    lead_name: str
    company: Optional[str] = ""
    tone: str = "professional"  # professional, friendly, persuasive, concise
    type: str = "email"  # email, linkedin, whatsapp, cold_outreach

class FollowUpResponse(BaseModel):
    subject: Optional[str] = None
    message: str
    type: str
    tone: str

class ActivityResponse(BaseModel):
    id: int
    type: str
    title: str
    description: Optional[str]
    lead_name: Optional[str]
    created_at: Optional[datetime]
    class Config:
        from_attributes = True
