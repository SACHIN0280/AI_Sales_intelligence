from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    company = Column(String)
    email = Column(String)
    phone = Column(String)
    lead_score = Column(Integer, default=0)
    deal_value = Column(Float, default=0.0)
    status = Column(String, default="Warm Lead")  # Hot Lead, Warm Lead, Cold Lead, Closed
    last_interaction = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)  # meeting, lead_update, ai_action, follow_up
    title = Column(String)
    description = Column(Text)
    lead_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AISummary(Base):
    __tablename__ = "ai_summaries"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)  # scoring, meeting, followup
    input_text = Column(Text)
    result_json = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
