import csv
import os

DATA_DIR = "/Users/sachin2806/AI_sales_intelligence/backend/data"

accounts_file = os.path.join(DATA_DIR, "accounts.csv")
pipeline_file = os.path.join(DATA_DIR, "sales_pipeline.csv")

new_accounts = [
    {"account": "Microsoft", "sector": "Technology", "year_established": "1975", "revenue": "198000.00", "employees": "181000", "office_location": "United States", "subsidiary_of": ""},
    {"account": "Salesforce", "sector": "Technology", "year_established": "1999", "revenue": "26000.00", "employees": "73000", "office_location": "United States", "subsidiary_of": ""},
    {"account": "Airbnb", "sector": "Hospitality", "year_established": "2008", "revenue": "8000.00", "employees": "6000", "office_location": "United States", "subsidiary_of": ""},
    {"account": "Stripe", "sector": "Financial Services", "year_established": "2010", "revenue": "12000.00", "employees": "7000", "office_location": "United States", "subsidiary_of": ""},
    {"account": "OpenAI", "sector": "Technology", "year_established": "2015", "revenue": "1000.00", "employees": "500", "office_location": "United States", "subsidiary_of": ""},
    {"account": "Vercel", "sector": "Technology", "year_established": "2015", "revenue": "100.00", "employees": "400", "office_location": "United States", "subsidiary_of": ""}
]

new_pipeline = [
    # opportunity_id,sales_agent,product,account,deal_stage,engage_date,close_date,close_value
    {"opportunity_id": "ENT_MSFT", "sales_agent": "Moses Frase", "product": "GTX Plus Pro", "account": "Microsoft", "deal_stage": "Engaging", "engage_date": "2017-11-20", "close_date": "", "close_value": "1200000"},
    {"opportunity_id": "ENT_CRM", "sales_agent": "Darcel Schlecht", "product": "GTX Plus Pro", "account": "Salesforce", "deal_stage": "Engaging", "engage_date": "2017-12-10", "close_date": "", "close_value": "800000"},
    {"opportunity_id": "ENT_ABNB", "sales_agent": "Moses Frase", "product": "GTX Pro", "account": "Airbnb", "deal_stage": "Engaging", "engage_date": "2017-12-05", "close_date": "", "close_value": "450000"},
    {"opportunity_id": "ENT_STRP", "sales_agent": "Moses Frase", "product": "GTX Plus Pro", "account": "Stripe", "deal_stage": "Engaging", "engage_date": "2017-12-25", "close_date": "", "close_value": "600000"},
    {"opportunity_id": "ENT_OAI", "sales_agent": "Darcel Schlecht", "product": "GTX Plus Pro", "account": "OpenAI", "deal_stage": "Prospecting", "engage_date": "2017-12-28", "close_date": "", "close_value": "500000"},
    {"opportunity_id": "ENT_VRCL", "sales_agent": "Moses Frase", "product": "GTX Pro", "account": "Vercel", "deal_stage": "Engaging", "engage_date": "2017-12-20", "close_date": "", "close_value": "250000"}
]

with open(accounts_file, "a", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["account","sector","year_established","revenue","employees","office_location","subsidiary_of"])
    for row in new_accounts:
        writer.writerow(row)

with open(pipeline_file, "a", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["opportunity_id","sales_agent","product","account","deal_stage","engage_date","close_date","close_value"])
    for row in new_pipeline:
        writer.writerow(row)

print("Done injecting enterprise deals to CSV!")
