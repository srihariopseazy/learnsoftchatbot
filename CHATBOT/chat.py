from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["learnsoft_chatbot"]
leads_col = db["leads"]
print("✅ MongoDB Connected!")

COURSE_CATEGORIES = {
    "1": {"name": "☁️ Cloud Computing", "courses": ["AWS", "Azure", "Google Cloud", "AZ-104: Azure Administrator", "AZ-900: Azure Fundamentals", "AZ-305: Azure Solutions Architect", "AZ-140: Azure Virtual Desktop", "DP-900: Azure Data Fundamentals"]},
    "2": {"name": "⚙️ DevOps", "courses": ["Jenkins", "Terraform", "Kubernetes", "Docker", "DevSecOps", "Ansible", "GitLab CI/CD", "Linux"]},
    "3": {"name": "💻 Development", "courses": ["ReactJS", "NodeJS", "Flutter", "UI/UX Design", "Python", "Full Stack Development", "Angular", "Django"]},
    "4": {"name": "📊 Data Engineering", "courses": ["Data Science", "Power BI", "Tableau", "SQL", "Apache Spark", "Snowflake", "Azure Data Factory", "Databricks"]},
    "5": {"name": "🤖 AI & Machine Learning", "courses": ["Machine Learning", "Deep Learning", "NLP", "Generative AI", "TensorFlow", "LLM & ChatGPT", "Computer Vision", "MLOps"]},
    "6": {"name": "🔐 IAM & Security", "courses": ["CyberArk", "SailPoint", "Okta", "BeyondTrust", "ForgeRock", "Ping Identity", "Azure AD", "AWS IAM"]},
    "7": {"name": "🧪 Testing", "courses": ["Selenium", "Manual Testing", "API Testing", "Playwright", "Cypress", "JMeter", "Postman", "JIRA"]},
    "8": {"name": "📦 ERP", "courses": ["SAP", "Salesforce", "ServiceNow", "Workday", "Oracle ERP", "SAP S/4HANA", "Microsoft Dynamics", "SAP FICO"]}
}

user_sessions = {}

def build_category_list():
    lines = "📚 <b>Choose a Course Category:</b><br><br>"
    for key, val in COURSE_CATEGORIES.items():
        lines += f"<b>{key}.</b> {val['name']}<br>"
    return lines

def get_response(user_id, message):
    msg = message.strip().lower()
    if user_id not in user_sessions:
        user_sessions[user_id] = {"step": "start", "category": "", "course": "", "name": "", "phone": "", "email": ""}
    session = user_sessions[user_id]

    faqs = {
        "contact": "📞 Call: <b>+91 78258 88899</b><br>📧 Email: <b>contact@learnsoft.org</b>",
        "location": "📍 OMR Chennai, Keelkattalai, Ashok Nagar, Tirunelveli",
        "timing": "🕐 Weekdays: 7–9 PM | Weekends: 10 AM–1 PM",
        "certificate": "🏆 Yes! Verified certificate upon completion.",
        "demo": "🎓 Free demo available! Call +91 78258 88899.",
        "placement": "💼 Placement assistance with resume building & mock interviews.",
        "duration": "⏳ Courses: 4 to 12 weeks.",
        "fee": "💰 Call +91 78258 88899 for fee details.",
        "fees": "💰 Call +91 78258 88899 for fee details.",
    }
    for keyword, answer in faqs.items():
        if keyword in msg:
            return answer

    if msg in ["hi", "hello", "hey", "start"] or session["step"] == "start":
        session["step"] = "category"
        return "👋 <b>Welcome to LearnSoft!</b><br>500K+ professionals trained · 200+ IT courses.<br><br>" + build_category_list()

    return "Please use the chat buttons to explore courses! 🎓"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").strip()
    user_id = data.get("user_id", "default_user")
    if not message:
        return jsonify({"response": "Please type something 😊"})
    response = get_response(user_id, message)
    return jsonify({"response": response})

@app.route("/save_lead", methods=["POST"])
def save_lead():
    data = request.get_json()
    lead = {
        "name":    data.get("name", ""),
        "phone":   data.get("phone", ""),
        "email":   data.get("email", ""),
        "course":  data.get("course", ""),
        "city":    data.get("city", ""),
        "state":   data.get("state", ""),
        "country": data.get("country", ""),
        "time":    datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    leads_col.insert_one(lead)
    return jsonify({"status": "saved"})

@app.route("/leads", methods=["GET"])
def view_leads():
    leads = list(leads_col.find({}, {"_id": 0}))
    return jsonify(leads)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
