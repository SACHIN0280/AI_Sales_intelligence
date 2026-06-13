import models
from database import SessionLocal

def seed_database():
    db = SessionLocal()
    if db.query(models.Lead).count() == 0:
        mock_leads = [
            models.Lead(name="Sarah Johnson", company="TechFlow Inc", email="sarah@techflow.com", phone="+1 (555) 234-5678", lead_score=94, deal_value=85000, status="Hot Lead", last_interaction="2 hours ago", notes="Very interested in enterprise plan. Demo scheduled for Friday."),
            models.Lead(name="Marcus Chen", company="DataVault Co", email="marcus@datavault.co", phone="+1 (555) 345-6789", lead_score=88, deal_value=62000, status="Hot Lead", last_interaction="1 day ago", notes="Budget confirmed. Needs legal review on contract."),
            models.Lead(name="Elena Rodriguez", company="ScaleUp Labs", email="elena@scaleuplabs.com", phone="+1 (555) 456-7890", lead_score=76, deal_value=47000, status="Warm Lead", last_interaction="3 days ago", notes="Evaluating 2 competitors. Strong fit for mid-market plan."),
            models.Lead(name="Raj Mehta", company="Quantum Ventures", email="raj@quantumv.io", phone="+1 (555) 567-8901", lead_score=68, deal_value=38000, status="Warm Lead", last_interaction="5 days ago", notes="On trial. Positive feedback from team. Needs pricing discussion."),
            models.Lead(name="Ava Thompson", company="Nexus Digital", email="ava@nexusdigital.com", phone="+1 (555) 678-9012", lead_score=61, deal_value=34000, status="Warm Lead", last_interaction="1 week ago", notes="Interested but slow decision process. Multiple stakeholders."),
            models.Lead(name="Jordan Lee", company="Bright Future Co", email="jordan@brightfuture.co", phone="+1 (555) 789-0123", lead_score=45, deal_value=22000, status="Cold Lead", last_interaction="2 weeks ago", notes="Initial interest but went quiet after pricing call."),
            models.Lead(name="James Wilson", company="OldCo Corp", email="james@oldcorp.com", phone="+1 (555) 890-1234", lead_score=32, deal_value=28000, status="Cold Lead", last_interaction="3 weeks ago", notes="Budget frozen. Check back in Q1."),
            models.Lead(name="Priya Patel", company="StartRight LLC", email="priya@startright.io", phone="+1 (555) 901-2345", lead_score=28, deal_value=18000, status="Cold Lead", last_interaction="1 month ago", notes="Switched priorities. Keep warm for next quarter."),
            models.Lead(name="Michael Torres", company="Growth Engine", email="michael@growthengine.ai", phone="+1 (555) 012-3456", lead_score=95, deal_value=120000, status="Closed", last_interaction="2 weeks ago", notes="Deal closed! Signed enterprise annual contract."),
            models.Lead(name="Lisa Park", company="Momentum SaaS", email="lisa@momentumsaas.com", phone="+1 (555) 123-4567", lead_score=91, deal_value=75000, status="Closed", last_interaction="3 weeks ago", notes="Successful implementation. Potential upsell in Q3."),
            models.Lead(name="Sam Alt", company="OpenAI", email="sam@openai.com", phone="+1 (555) 999-0000", lead_score=99, deal_value=500000, status="Hot Lead", last_interaction="1 hour ago", notes="Looking for large scale deployment. Very high priority. Board approval pending."),
            models.Lead(name="Guillermo Rauch", company="Vercel", email="g@vercel.com", phone="+1 (555) 888-1111", lead_score=95, deal_value=250000, status="Hot Lead", last_interaction="4 hours ago", notes="Next.js integration requested. Security review in progress."),
            models.Lead(name="Satya Nadella", company="Microsoft", email="satya@microsoft.com", phone="+1 (555) 777-2222", lead_score=85, deal_value=1200000, status="Warm Lead", last_interaction="2 days ago", notes="Stalled. Procurement process taking longer than expected. Need to engage VP of Engineering."),
            models.Lead(name="Marc Benioff", company="Salesforce", email="marc@salesforce.com", phone="+1 (555) 666-3333", lead_score=40, deal_value=800000, status="Cold Lead", last_interaction="1 month ago", notes="Competitor conflict. Re-engage next year."),
            models.Lead(name="Dylan Field", company="Figma", email="dylan@figma.com", phone="+1 (555) 555-4444", lead_score=92, deal_value=180000, status="Hot Lead", last_interaction="Yesterday", notes="Design team loves the product. Waiting on finance approval."),
            models.Lead(name="Aravind Srinivas", company="Perplexity", email="aravind@perplexity.ai", phone="+1 (555) 444-5555", lead_score=89, deal_value=150000, status="Hot Lead", last_interaction="3 hours ago", notes="Search integration PoC successful. Preparing final contract."),
            models.Lead(name="Ivan Zhao", company="Notion", email="ivan@notion.so", phone="+1 (555) 333-6666", lead_score=78, deal_value=95000, status="Warm Lead", last_interaction="5 days ago", notes="Testing workspace integration. Feedback mostly positive."),
            models.Lead(name="Mathilde Collin", company="Front", email="mathilde@frontapp.com", phone="+1 (555) 222-7777", lead_score=82, deal_value=110000, status="Warm Lead", last_interaction="1 week ago", notes="Evaluating ROI vs internal build. Shared case studies."),
            models.Lead(name="Parker Conrad", company="Rippling", email="parker@rippling.com", phone="+1 (555) 111-8888", lead_score=96, deal_value=320000, status="Hot Lead", last_interaction="Today", notes="Fast moving deal. Technical validation complete. Contract in redlines."),
            models.Lead(name="Alexandr Wang", company="Scale AI", email="alex@scale.com", phone="+1 (555) 000-9999", lead_score=88, deal_value=280000, status="Hot Lead", last_interaction="2 days ago", notes="Data labeling partnership discussed. High mutual interest."),
            models.Lead(name="Jason Citron", company="Discord", email="jason@discord.com", phone="+1 (555) 121-2121", lead_score=65, deal_value=140000, status="Warm Lead", last_interaction="2 weeks ago", notes="Community features needed. Pushed to Q3 roadmap."),
            models.Lead(name="Brian Chesky", company="Airbnb", email="brian@airbnb.com", phone="+1 (555) 232-3232", lead_score=55, deal_value=450000, status="Cold Lead", last_interaction="3 weeks ago", notes="Travel rebound focus. Tooling budget frozen temporarily."),
            models.Lead(name="Patrick Collison", company="Stripe", email="patrick@stripe.com", phone="+1 (555) 343-4343", lead_score=98, deal_value=600000, status="Closed", last_interaction="1 week ago", notes="Enterprise deal closed! Major win."),
            models.Lead(name="Tobi Lutke", company="Shopify", email="tobi@shopify.com", phone="+1 (555) 454-5454", lead_score=94, deal_value=380000, status="Closed", last_interaction="2 months ago", notes="Successfully deployed to 5000+ merchants."),
            models.Lead(name="Eric Yuan", company="Zoom", email="eric@zoom.us", phone="+1 (555) 565-6565", lead_score=72, deal_value=210000, status="Warm Lead", last_interaction="4 days ago", notes="Video AI features highly requested. Waiting on compliance review."),
            models.Lead(name="Aaron Levie", company="Box", email="aaron@box.com", phone="+1 (555) 676-7676", lead_score=86, deal_value=175000, status="Hot Lead", last_interaction="Yesterday", notes="Content security is primary concern. Passed initial infosec check."),
            models.Lead(name="Drew Houston", company="Dropbox", email="drew@dropbox.com", phone="+1 (555) 787-8787", lead_score=60, deal_value=130000, status="Cold Lead", last_interaction="1 month ago", notes="Reorg in progress. Champions left the company."),
            models.Lead(name="Anthony Casalena", company="Squarespace", email="anthony@squarespace.com", phone="+1 (555) 898-9898", lead_score=81, deal_value=160000, status="Warm Lead", last_interaction="1 week ago", notes="Website builder integration potential. Engaged with Product team."),
            models.Lead(name="Melanie Perkins", company="Canva", email="melanie@canva.com", phone="+1 (555) 909-0909", lead_score=93, deal_value=290000, status="Hot Lead", last_interaction="2 hours ago", notes="Design AI features discussed. Very excited. Pilot program starting next week."),
            models.Lead(name="Stewart Butterfield", company="Slack", email="stewart@slack.com", phone="+1 (555) 010-1010", lead_score=75, deal_value=220000, status="Warm Lead", last_interaction="5 days ago", notes="Integration with messaging workflow is key. Demoing to engineering team next."),
        ]
        for lead in mock_leads:
            db.add(lead)
        
        mock_activities = [
            models.Activity(type="meeting", title="Discovery call with Sarah Johnson", description="Discussed pain points and requirements. Strong buying signals. Budget of $85K confirmed.", lead_name="Sarah Johnson"),
            models.Activity(type="ai_action", title="AI scored Marcus Chen at 88/100", description="High urgency detected. Budget discussion indicates Q4 close. Recommended immediate demo scheduling.", lead_name="Marcus Chen"),
            models.Activity(type="follow_up", title="Follow-up email sent to Elena Rodriguez", description="Personalized email with competitor comparison and ROI calculator attached.", lead_name="Elena Rodriguez"),
            models.Activity(type="meeting", title="Executive Sync with Satya Nadella", description="Discussed enterprise rollout. Microsoft procurement is stalling the deal. Needs escalation.", lead_name="Satya Nadella"),
            models.Activity(type="ai_action", title="Pipeline Risk Alert: Microsoft", description="Deal stalled in procurement for >30 days. Recommended action: Engage VP of Engineering to push from top-down.", lead_name="Satya Nadella"),
            models.Activity(type="meeting", title="Technical Validation with Guillermo Rauch", description="Vercel team loved the architecture. Next.js integration looks seamless.", lead_name="Guillermo Rauch"),
            models.Activity(type="follow_up", title="Sent Security Questionnaire to Box", description="Aaron Levie requested SOC2 report. Sent via secure portal.", lead_name="Aaron Levie"),
            models.Activity(type="lead_update", title="Deal closed: Patrick Collison", description="Stripe signed $600K enterprise contract. Implementation starts Q3.", lead_name="Patrick Collison"),
        ]
        for activity in mock_activities:
            db.add(activity)
        
        db.commit()
    db.close()
