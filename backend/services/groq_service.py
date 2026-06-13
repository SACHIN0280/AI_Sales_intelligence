import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = None
if os.getenv("GROQ_API_KEY") and os.getenv("GROQ_API_KEY") != "your_groq_api_key_here":
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.3-70b-versatile"

COPILOT_SYSTEM = """You are SalesMind AI Copilot, an expert AI sales assistant powered by LLaMA 3.3 70B.
You help sales teams with:
- Lead analysis and prioritization
- Writing personalized outreach emails and LinkedIn messages
- Pipeline risk assessment and deal coaching
- Conversion rate analysis and forecasting
- Meeting preparation and follow-up strategy
- Objection handling and negotiation tips

Always be specific, concise, and actionable. Respond in plain text (no markdown headers or asterisks).
Keep responses under 200 words unless the user asks for something longer like a full email draft."""

def call_groq(prompt: str, system: str = "You are a helpful AI sales assistant.") -> str:
    if client is None:
        return None
    chat = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2048
    )
    return chat.choices[0].message.content

def chat_with_copilot(message: str, history: list) -> str:
    """Free-form copilot chat — sends full conversation history to LLaMA 3.3 70B."""
    if client is None:
        return (
            "I'm running in demo mode — no Groq API key is configured. "
            "Add your GROQ_API_KEY to the backend .env file to enable real AI responses. "
            "Get a free key at console.groq.com — the free tier supports LLaMA 3.3 70B."
        )
    messages = [{"role": "system", "content": COPILOT_SYSTEM}]
    for turn in history[-10:]:
        messages.append({"role": turn["role"], "content": turn["content"]})
    messages.append({"role": "user", "content": message})
    chat = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=1024
    )
    return chat.choices[0].message.content

def score_lead(client_notes: str, meeting_summary: str, interaction_history: str) -> dict:
    prompt = f"""Analyze this sales lead and provide a JSON scoring response.

Client Notes: {client_notes}
Meeting Summary: {meeting_summary}
Interaction History: {interaction_history}

Respond with ONLY valid JSON in this exact format:
{{
  "score": <0-100>,
  "classification": "Hot Lead" | "Warm Lead" | "Cold Lead",
  "reasoning": "<2-3 sentence explanation>",
  "next_action": "<specific recommended next step>",
  "buying_intent": <0-100>,
  "urgency": <0-100>,
  "sentiment": <0-100>,
  "engagement": <0-100>,
  "confidence": <0-100>
}}"""

    result = call_groq(prompt, "You are an expert AI sales analyst. Always respond with valid JSON only.")

    if result is None:
        return {
            "score": 78, "classification": "Hot Lead",
            "reasoning": "The client demonstrates strong buying intent with clear urgency signals. Multiple interactions show consistent engagement and the budget discussion indicates readiness to proceed.",
            "next_action": "Schedule a demo call within 48 hours and prepare a customized ROI proposal.",
            "buying_intent": 82, "urgency": 75, "sentiment": 85, "engagement": 70, "confidence": 88
        }

    try:
        start = result.find('{')
        end = result.rfind('}') + 1
        return json.loads(result[start:end])
    except:
        return {
            "score": 65, "classification": "Warm Lead",
            "reasoning": "Moderate engagement detected. Further qualification needed.",
            "next_action": "Send a follow-up email with relevant case studies.",
            "buying_intent": 60, "urgency": 55, "sentiment": 70, "engagement": 65, "confidence": 75
        }

def summarize_meeting(raw_notes: str) -> dict:
    prompt = f"""Analyze these sales call notes and extract structured insights.

Raw Notes:
{raw_notes}

Respond with ONLY valid JSON:
{{
  "key_requirements": ["req1", "req2", ...],
  "objections": ["obj1", "obj2", ...],
  "pain_points": ["pain1", "pain2", ...],
  "action_items": ["action1", "action2", ...],
  "follow_up_tasks": ["task1", "task2", ...],
  "next_meeting_suggestion": "<suggestion>",
  "sentiment": "positive" | "neutral" | "negative",
  "summary": "<2-3 sentence executive summary>"
}}"""

    result = call_groq(prompt, "You are an expert sales call analyst. Always respond with valid JSON only.")

    if result is None:
        return {
            "key_requirements": ["CRM integration", "Real-time analytics", "Team collaboration", "Mobile app", "API access"],
            "objections": ["Budget cycle ends Q3", "IT approval required", "Data migration complexity"],
            "pain_points": ["Manual data entry 3+ hrs/day", "No pipeline visibility", "Manual lead scoring", "Disconnected tools"],
            "action_items": ["Send ROI calculator", "Schedule IT deep-dive", "Prepare CRM integration demo", "Get VP sponsorship"],
            "follow_up_tasks": ["Follow up in 48h with case study", "Share migration guide", "Send pricing proposal"],
            "next_meeting_suggestion": "Technical discovery call with IT team — next Tuesday or Wednesday.",
            "sentiment": "positive",
            "summary": "Strong discovery call with clear buying signals. Client has defined requirements and budget authority. Main obstacles are IT approval and Q3 timing."
        }

    try:
        start = result.find('{')
        end = result.rfind('}') + 1
        return json.loads(result[start:end])
    except:
        return {
            "key_requirements": ["Custom integration", "Advanced reporting", "Team collaboration"],
            "objections": ["Budget constraints", "Implementation timeline"],
            "pain_points": ["Manual processes", "Data silos", "Lack of visibility"],
            "action_items": ["Send proposal", "Schedule demo", "Connect with decision maker"],
            "follow_up_tasks": ["Follow up in 48 hours", "Share case studies"],
            "next_meeting_suggestion": "Follow-up call next week.",
            "sentiment": "neutral",
            "summary": "Meeting notes analyzed. Key requirements and action items identified."
        }

def generate_followup(context: str, lead_name: str, company: str, tone: str, msg_type: str) -> dict:
    type_desc = {"email": "professional email with subject line", "linkedin": "LinkedIn message (under 300 chars)", "whatsapp": "WhatsApp message (casual)", "cold_outreach": "cold outreach email"}
    tone_desc = {"professional": "formal and professional", "friendly": "warm and personable", "persuasive": "persuasive with strong value props", "concise": "brief and punchy"}
    is_email = msg_type in ["email", "cold_outreach"]

    prompt = f"""Generate a {type_desc.get(msg_type, 'message')} for a sales follow-up.
Context: {context}
Lead Name: {lead_name}
Company: {company}
Tone: {tone_desc.get(tone, tone)}

Respond with ONLY valid JSON:
{{
  {'"subject": "<email subject line>",' if is_email else ''}
  "message": "<the full message text>",
  "type": "{msg_type}",
  "tone": "{tone}"
}}"""

    result = call_groq(prompt, "You are an expert sales copywriter. Always respond with valid JSON only.")

    if result is None:
        mock = {
            "email": {"subject": f"Following up — {company}", "message": f"Hi {lead_name},\n\nThank you for connecting. I wanted to follow up on our conversation and see if you had questions about how SalesMind AI can help {company} accelerate your pipeline.\n\nWould you be open to a 20-minute call this week?\n\nBest,\nSalesMind AI Team", "type": "email", "tone": tone},
            "linkedin": {"subject": None, "message": f"Hi {lead_name}, great connecting! Following up on our conversation about {company}'s sales challenges. Would a quick call work?", "type": "linkedin", "tone": tone},
            "whatsapp": {"subject": None, "message": f"Hey {lead_name}! 👋 Just following up on our chat. Let me know if you'd like those case studies! 🚀", "type": "whatsapp", "tone": tone},
            "cold_outreach": {"subject": f"Helping {company} close deals faster with AI", "message": f"Hi {lead_name},\n\nI noticed {company} is scaling — congrats!\n\nWe've helped 50+ sales teams reduce their cycle by 35% with AI-powered lead intelligence. Worth a 15-minute call?\n\n[Your Name]\nSalesMind AI", "type": "cold_outreach", "tone": tone},
        }
        return mock.get(msg_type, mock["email"])

    try:
        start = result.find('{')
        end = result.rfind('}') + 1
        data = json.loads(result[start:end])
        if "subject" not in data:
            data["subject"] = None
        return data
    except:
        return {"subject": f"Following up — {company}", "message": f"Hi {lead_name}, following up on our conversation.", "type": msg_type, "tone": tone}
