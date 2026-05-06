from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────
# MongoDB
# ─────────────────────────────────────────
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["learnsoft_chatbot"]
leads_col = db["leads"]
print("✅ MongoDB Connected!")

# ─────────────────────────────────────────
# LEARNSOFT COURSES
# ─────────────────────────────────────────
COURSE_CATEGORIES = {
    "1": {
        "name": "☁️ Cloud Computing",
        "courses": ["AWS", "Azure", "Google Cloud", "AZ-104: Azure Administrator",
            "AZ-900: Azure Fundamentals", "AZ-305: Azure Solutions Architect",
            "AZ-140: Azure Virtual Desktop", "DP-900: Azure Data Fundamentals"]
    },
    "2": {
        "name": "⚙️ DevOps",
        "courses": ["Jenkins", "Terraform", "Kubernetes", "Docker",
            "DevSecOps", "Ansible", "GitLab CI/CD", "Linux"]
    },
    "3": {
        "name": "💻 Development",
        "courses": ["ReactJS", "NodeJS", "Flutter", "UI/UX Design",
            "Python", "Full Stack Development", "Angular", "Django"]
    },
    "4": {
        "name": "📊 Data Engineering",
        "courses": ["Data Science", "Power BI", "Tableau", "SQL",
            "Apache Spark", "Snowflake", "Azure Data Factory", "Databricks"]
    },
    "5": {
        "name": "🤖 AI & Machine Learning",
        "courses": ["Machine Learning", "Deep Learning", "NLP",
            "Generative AI", "TensorFlow", "LLM & ChatGPT", "Computer Vision", "MLOps"]
    },
    "6": {
        "name": "🔐 IAM & Security",
        "courses": ["CyberArk", "SailPoint", "Okta", "BeyondTrust",
            "ForgeRock", "Ping Identity", "Azure AD", "AWS IAM"]
    },
    "7": {
        "name": "🧪 Testing",
        "courses": ["Selenium", "Manual Testing", "API Testing",
            "Playwright", "Cypress", "JMeter", "Postman", "JIRA"]
    },
    "8": {
        "name": "📦 ERP",
        "courses": ["SAP", "Salesforce", "ServiceNow", "Workday",
            "Oracle ERP", "SAP S/4HANA", "Microsoft Dynamics", "SAP FICO"]
    }
}

# ─────────────────────────────────────────
# USER SESSIONS
# ─────────────────────────────────────────
user_sessions = {}

# ─────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────
def build_category_list():
    lines = "📚 <b>Choose a Course Category:</b><br><br>"
    for key, val in COURSE_CATEGORIES.items():
        lines += f"<b>{key}.</b> {val['name']}<br>"
    lines += "<br>Type a number (1–8) or category name."
    return lines

def build_course_list(category_key):
    cat = COURSE_CATEGORIES[category_key]
    lines = f"{cat['name']} — <b>Courses:</b><br><br>"
    for i, course in enumerate(cat["courses"], 1):
        lines += f"<b>{i}.</b> {course}<br>"
    lines += "<br>Type the <b>number</b> or <b>course name</b> to select, or type <b>back</b>."
    return lines

# ─────────────────────────────────────────
# BOT LOGIC
# ─────────────────────────────────────────
def get_response(user_id, message):
    msg = message.strip().lower()

    if user_id not in user_sessions:
        user_sessions[user_id] = {
            "step": "start", "category": "",
            "course": "", "name": "", "phone": "", "email": ""
        }

    session = user_sessions[user_id]

    # Global commands
    if msg in ["back", "menu", "categories"]:
        session["step"] = "category"
        session["category"] = ""
        session["course"] = ""
        return build_category_list()

    if msg in ["restart", "reset", "new chat"]:
        user_sessions.pop(user_id)
        return "🔄 Restarted! Type <b>hello</b> to begin."

    # FAQ
    faqs = {
        "contact":     "📞 Call: <b>+91 78258 88899</b><br>📧 Email: <b>contact@learnsoft.org</b><br>💬 WhatsApp: +91 78258 88899",
        "location":    "📍 <b>Locations:</b><br>• OMR, Thoraipakkam, Chennai<br>• Keelkattalai, Chennai<br>• Ashok Nagar, Chennai<br>• Tirunelveli",
        "timing":      "🕐 Weekdays: 7–9 PM<br>Weekends: 10 AM–1 PM",
        "certificate": "🏆 Yes! Verified certificate upon completion.",
        "demo":        "🎓 Free demo available! Call +91 78258 88899.",
        "placement":   "💼 Placement assistance with resume building & mock interviews.",
        "duration":    "⏳ Courses: 4 to 12 weeks.",
        "online":      "🌐 All courses available online and offline!",
        "fee":         "💰 Fees vary by course. Call +91 78258 88899 for details.",
        "fees":        "💰 Fees vary by course. Call +91 78258 88899 for details.",
    }
    for keyword, answer in faqs.items():
        if keyword in msg:
            return answer

    # Greeting
    if msg in ["hi", "hello", "hey", "start", "hai"] or session["step"] == "start":
        session["step"] = "category"
        return (
            "👋 <b>Welcome to LearnSoft!</b><br>"
            "500K+ professionals trained · 200+ IT courses.<br><br>"
            + build_category_list()
        )

    # Category selection
    if session["step"] == "category":
        # Match by number
        if msg in COURSE_CATEGORIES:
            session["category"] = msg
            session["step"] = "course"
            return build_course_list(msg)
        # Match by category name
        for key, val in COURSE_CATEGORIES.items():
            if msg in val["name"].lower():
                session["category"] = key
                session["step"] = "course"
                return build_course_list(key)
        return "❌ Type a number between <b>1 and 8</b> or category name.<br><br>" + build_category_list()

    # Course selection
    if session["step"] == "course":
        cat = COURSE_CATEGORIES.get(session["category"], {})
        courses = cat.get("courses", [])
        # Match by number
        if msg.isdigit() and 1 <= int(msg) <= len(courses):
            session["course"] = courses[int(msg) - 1]
            session["step"] = "name"
            return f"✅ You selected <b>{session['course']}</b>.<br><br>Please enter your <b>full name</b>:"
        # Back
        elif msg == "back":
            session["step"] = "category"
            session["category"] = ""
            return build_category_list()
        # Match by typing course name
        else:
            matched = next((c for c in courses if msg in c.lower()), None)
            if matched:
                session["course"] = matched
                session["step"] = "name"
                return f"✅ You selected <b>{matched}</b>.<br><br>Please enter your <b>full name</b>:"
            return f"❌ Type a number (1–{len(courses)}), course name, or <b>back</b>."

    # Name
    if session["step"] == "name":
        if len(message.strip()) < 2:
            return "❌ Please enter your <b>full name</b>."
        session["name"] = message.strip().title()
        session["step"] = "phone"
        return f"👍 Hi <b>{session['name']}</b>!<br><br>📞 Enter your <b>phone number</b>:"

    # Phone - exactly 10 digits
    if session["step"] == "phone":
        phone = message.strip().replace(" ", "").replace("-", "").replace("+91", "")
        if not phone.isdigit() or len(phone) != 10:
            return "❌ Enter a valid <b>10-digit phone number</b>."
        session["phone"] = phone
        session["step"] = "email"
        return "📧 Enter your <b>email address</b>:"

    # Email + Save
    if session["step"] == "email":
        email = message.strip().lower()
        if "@" not in email or "." not in email:
            return "❌ Enter a valid <b>email address</b>."
        session["email"] = email

        lead = {
            "name":   session["name"],
            "phone":  session["phone"],
            "email":  session["email"],
            "course": session["course"],
            "time":   datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        leads_col.insert_one(lead)
        user_sessions.pop(user_id)

        return (
            f"🎉 <b>Thank you, {lead['name']}!</b><br><br>"
            f"✅ Registered for <b>{lead['course']}</b>.<br>"
            "📲 Our counsellor will contact you within <b>24 hours</b>.<br><br>"
            "<button onclick=\"document.getElementById('message-input').value='hello'; sendMessage();\" "
            "style='background:#F5A623; color:white; border:none; padding:10px 20px; "
            "border-radius:25px; cursor:pointer; font-family:Sora,sans-serif; "
            "font-size:0.85rem; margin-top:8px;'>🔄 Start New Chat</button>"
        )

    return "Type <b>hello</b> to get started! 👋"

# ─────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────
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

@app.route("/leads", methods=["GET"])
def view_leads():
    leads = list(leads_col.find({}, {"_id": 0}))
    return jsonify(leads)

# ─────────────────────────────────────────
# RUN
# ─────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
