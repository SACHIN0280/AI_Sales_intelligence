from fastapi import APIRouter
from schemas import (
    LeadScoringRequest, LeadScoringResponse,
    MeetingSummaryRequest, MeetingSummaryResponse,
    FollowUpRequest, FollowUpResponse
)
from services.groq_service import score_lead, summarize_meeting, generate_followup, chat_with_copilot
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/ai", tags=["ai"])

# ── Existing endpoints ─────────────────────────────────────────────────────────

@router.post("/score-lead", response_model=LeadScoringResponse)
def ai_score_lead(req: LeadScoringRequest):
    result = score_lead(req.client_notes, req.meeting_summary or "", req.interaction_history or "")
    return LeadScoringResponse(**result)

@router.post("/summarize-meeting", response_model=MeetingSummaryResponse)
def ai_summarize_meeting(req: MeetingSummaryRequest):
    result = summarize_meeting(req.raw_notes)
    return MeetingSummaryResponse(**result)

@router.post("/generate-followup", response_model=FollowUpResponse)
def ai_generate_followup(req: FollowUpRequest):
    result = generate_followup(req.context, req.lead_name, req.company or "", req.tone, req.type)
    return FollowUpResponse(**result)

# ── Copilot chat endpoint ──────────────────────────────────────────────────────

class ChatTurn(BaseModel):
    role: str   # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatTurn]] = []

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
def ai_chat(req: ChatRequest):
    history = [{"role": t.role, "content": t.content} for t in (req.history or [])]
    reply = chat_with_copilot(req.message, history)
    return ChatResponse(reply=reply)
