# SalesMind AI 🧠

> AI-powered sales intelligence for modern teams.

A premium full-stack SaaS platform that leverages **LLaMA 3.3 70B via Groq** to supercharge your sales workflow.

## 🚀 Quick Start

### Frontend (Next.js 15)

```bash
cd frontend
npm install        # already done if you ran setup
npm run dev        # starts at http://localhost:3000
```

### Backend (FastAPI)

```bash
cd backend
source .venv/bin/activate
# Add your Groq API key to .env:
# GROQ_API_KEY=your_key_here
uvicorn main:app --reload --port 8000
```

## 🔑 Environment Setup

### Backend `.env`
```
GROQ_API_KEY=your_groq_api_key_here   # Get from console.groq.com
DATABASE_URL=sqlite:///./salesmind.db
CORS_ORIGINS=http://localhost:3000
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Note:** The app works fully without a Groq API key using rich mock data fallbacks.
> Add your key to get real LLaMA 3.3 70B responses for AI features.

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| UI Components | Custom glassmorphism design system |
| Charts | Recharts |
| Animations | CSS animations + Framer Motion ready |
| Backend | FastAPI (Python) |
| Database | SQLite via SQLAlchemy |
| AI Model | LLaMA 3.3 70B (Groq API) |

## 📱 Features

1. **🔥 AI Lead Management** — Score, filter, and track leads with table/grid views
2. **⚡ AI Lead Scoring** — Analyze buying intent, urgency, sentiment, engagement (0-100)
3. **📋 Meeting Summarizer** — Extract requirements, objections, pain points from raw notes
4. **✉️ Follow-Up Generator** — Email, LinkedIn, WhatsApp, and cold outreach with tone control
5. **📊 Sales Analytics** — Funnel chart, revenue trends, conversion analysis, pie charts
6. **💡 AI Insights** — Priority leads, at-risk alerts, smart reminders, deal predictions
7. **📅 Activity Timeline** — Chronological feed of all sales activities
8. **🌐 Landing Page** — Premium marketing page with pricing, testimonials, features

## 🔑 Demo Login

```
Email: admin@salesmind.ai
Password: demo1234
```

Or visit `/dashboard` directly to skip auth.

## 📂 Project Structure

```
salesmind-ai/
├── frontend/
│   ├── app/
│   │   ├── (landing)/page.tsx      # Landing page
│   │   ├── (auth)/login|signup/    # Auth pages
│   │   └── (dashboard)/           # 8 dashboard pages
│   ├── components/
│   │   ├── layout/                # Sidebar, TopBar
│   │   └── shared/                # KPICard, ScoreRing, etc.
│   └── lib/                       # API client, mock data, utils
└── backend/
    ├── main.py                    # FastAPI app + seed data
    ├── models.py                  # SQLAlchemy ORM models
    ├── routes/                    # leads, ai, analytics, activity
    └── services/groq_service.py   # Groq LLaMA 3.3 70B integration
```
