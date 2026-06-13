export type LeadStatus = "Hot Lead" | "Warm Lead" | "Cold Lead" | "Closed";

export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  lead_score: number;
  deal_value: number;
  status: LeadStatus;
  last_interaction: string;
  notes: string;
  created_at?: string;
}

export interface Activity {
  id: number;
  type: "meeting" | "lead_update" | "ai_action" | "follow_up";
  title: string;
  description: string;
  lead_name: string;
  created_at?: string;
}

export interface LeadScoringResult {
  score: number;
  classification: string;
  reasoning: string;
  next_action: string;
  buying_intent: number;
  urgency: number;
  sentiment: number;
  engagement: number;
  confidence: number;
}

export interface MeetingSummaryResult {
  key_requirements: string[];
  objections: string[];
  pain_points: string[];
  action_items: string[];
  follow_up_tasks: string[];
  next_meeting_suggestion: string;
  sentiment: string;
  summary: string;
}

export interface FollowUpResult {
  subject?: string;
  message: string;
  type: string;
  tone: string;
}

export interface AnalyticsSummary {
  total_leads: number;
  hot_leads: number;
  warm_leads: number;
  cold_leads: number;
  closed: number;
  revenue_pipeline: number;
  closed_revenue: number;
  conversion_rate: number;
  active_deals: number;
  lead_status_distribution: { name: string; value: number; color: string }[];
  weekly_revenue: { week: string; revenue: number; target: number }[];
  funnel: { stage: string; count: number; value: number }[];
  conversion_trends: { month: string; rate: number }[];
}

export interface Insight {
  priority_leads: {
    name: string;
    company: string;
    score: number;
    reason: string;
    deal_value: number;
  }[];
  at_risk: {
    name: string;
    company: string;
    score: number;
    reason: string;
    deal_value: number;
  }[];
  reminders: { lead: string; action: string; urgency: string }[];
  predicted_closures: {
    name: string;
    probability: number;
    expected_date: string;
    deal_value: number;
  }[];
  strategy_suggestions: string[];
}

export interface KPIData {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}
