const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeBtn   = document.getElementById('close-chat');
const chatbox    = document.getElementById('chatbox');
const badge      = document.getElementById('notif-badge');
const msgInput   = document.getElementById('message-input');

const user_id = "user_" + Math.random().toString(36).substring(2, 9);

// ── Toggle ──
chatToggle.onclick = () => {
  chatWindow.classList.toggle('open');
  badge.style.display = 'none';
  if (chatWindow.classList.contains('open') && chatbox.children.length === 0) {
    setTimeout(() => autoGreet(), 400);
  }
};

closeBtn.onclick = () => chatWindow.classList.remove('open');

// ── Course Data ──
const CATEGORIES = {
  "1": { name: "☁️ Cloud Computing", courses: ["AWS", "Azure", "Google Cloud", "AZ-104: Azure Administrator", "AZ-900: Azure Fundamentals", "AZ-305: Azure Solutions Architect", "AZ-140: Azure Virtual Desktop", "DP-900: Azure Data Fundamentals"] },
  "2": { name: "⚙️ DevOps", courses: ["Jenkins", "Terraform", "Kubernetes", "Docker", "DevSecOps", "Ansible", "GitLab CI/CD", "Linux"] },
  "3": { name: "💻 Development", courses: ["ReactJS", "NodeJS", "Flutter", "UI/UX Design", "Python", "Full Stack Development", "Angular", "Django"] },
  "4": { name: "📊 Data Engineering", courses: ["Data Science", "Power BI", "Tableau", "SQL", "Apache Spark", "Snowflake", "Azure Data Factory", "Databricks"] },
  "5": { name: "🤖 AI & Machine Learning", courses: ["Machine Learning", "Deep Learning", "NLP", "Generative AI", "TensorFlow", "LLM & ChatGPT", "Computer Vision", "MLOps"] },
  "6": { name: "🔐 IAM & Security", courses: ["CyberArk", "SailPoint", "Okta", "BeyondTrust", "ForgeRock", "Ping Identity", "Azure AD", "AWS IAM"] },
  "7": { name: "🧪 Testing", courses: ["Selenium", "Manual Testing", "API Testing", "Playwright", "Cypress", "JMeter", "Postman", "JIRA"] },
  "8": { name: "📦 ERP", courses: ["SAP", "Salesforce", "ServiceNow", "Workday", "Oracle ERP", "SAP S/4HANA", "Microsoft Dynamics", "SAP FICO"] }
};

// ── State ──
let currentStep = "start";
let selectedCourse = "";
let userName = "";
let userPhone = "";

// ── Auto Greet ──
async function autoGreet() {
  showTyping();
  await delay(800);
  removeTyping();
  addBotMessage("👋 <b>Welcome to LearnSoft!</b> 🎓<br>500K+ professionals trained · 200+ IT courses.<br><br>Please select a course category:");
  await delay(300);
  showCategoryButtons();
}

// ── Show Category Buttons ──
function showCategoryButtons() {
  const msg = document.createElement('div');
  msg.className = 'message bot';

  const av = createBotAvatar();

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const grid = document.createElement('div');
  grid.style.cssText = 'display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;';

  Object.entries(CATEGORIES).forEach(([key, val]) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = val.name;
    btn.onclick = () => onCategoryClick(key, val.name);
    grid.appendChild(btn);
  });

  bubble.appendChild(grid);
  msg.appendChild(av);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
  currentStep = "category";
}

// ── Category Clicked ──
async function onCategoryClick(key, name) {
  addUserMessage(name);
  showTyping();
  await delay(600);
  removeTyping();
  showCourseButtons(key, name);
}

// ── Show Course Buttons ──
function showCourseButtons(key, categoryName) {
  const courses = CATEGORIES[key].courses;

  const msg = document.createElement('div');
  msg.className = 'message bot';
  const av = createBotAvatar();

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `<b>${categoryName}</b> — Select a course:`;

  const grid = document.createElement('div');
  grid.style.cssText = 'display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;';

  courses.forEach(course => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = course;
    btn.onclick = () => onCourseClick(course);
    grid.appendChild(btn);
  });

  const backBtn = document.createElement('button');
  backBtn.className = 'option-btn back-btn';
  backBtn.textContent = '← Back';
  backBtn.onclick = async () => {
    addUserMessage('← Back');
    showTyping();
    await delay(500);
    removeTyping();
    addBotMessage('📚 Please select a course category:');
    await delay(200);
    showCategoryButtons();
  };
  grid.appendChild(backBtn);

  bubble.appendChild(grid);
  msg.appendChild(av);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
  currentStep = "course";
}

// ── Course Clicked ──
async function onCourseClick(course) {
  selectedCourse = course;
  addUserMessage(course);
  currentStep = "name";
  showTyping();
  await delay(600);
  removeTyping();
  addBotMessage(`✅ Great choice! You selected <b>${course}</b>.<br><br>Please enter your <b>full name</b>:`);
  msgInput.focus();
}

// ── Send Text (name/phone/email) ──
async function sendMessage() {
  const message = msgInput.value.trim();
  if (!message) return;

  addUserMessage(message);
  msgInput.value = '';

  showTyping();
  await delay(600);
  removeTyping();

  if (currentStep === "name") {
    if (message.length < 2) {
      addBotMessage("❌ Please enter your <b>full name</b>.");
      return;
    }
    userName = message.trim().replace(/\b\w/g, c => c.toUpperCase());
    currentStep = "phone";
    addBotMessage(`👍 Hi <b>${userName}</b>!<br><br>📞 Please enter your <b>10-digit phone number</b>:`);

  } else if (currentStep === "phone") {
    const phone = message.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '').replace(/^91/, '');
if (!/^\d{10}$/.test(phone)) {
      addBotMessage("❌ Please enter a valid <b>10-digit phone number</b>.");
      return;
    }
    userPhone = phone;
    currentStep = "email";
    addBotMessage("📧 Please enter your <b>email address</b>:");

  } else if (currentStep === "email") {
    if (!message.includes('@') || !message.includes('.')) {
      addBotMessage("❌ Please enter a valid <b>email address</b>.");
      return;
    }

    try {
      await fetch('/save_lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          phone: userPhone,
          email: message.trim().toLowerCase(),
          course: selectedCourse
        })
      });
    } catch (e) {}

    currentStep = "done";
    showThankYou();

  } else {
    addBotMessage("Please click <b>Explore Courses</b> to get started! 🎓");
  }
}

// ── Thank You Message ──
function showThankYou() {
  const msg = document.createElement('div');
  msg.className = 'message bot';
  const av = createBotAvatar();

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `
    🎉 <b>Thank you, ${userName}!</b><br><br>
    ✅ Registered for <b>${selectedCourse}</b>.<br>
    📲 Our counsellor will contact you within <b>24 hours</b>.
  `;

  const newChatBtn = document.createElement('button');
  newChatBtn.style.cssText = 'background:#F5A623; color:white; border:none; padding:10px 20px; border-radius:25px; cursor:pointer; font-family:Sora,sans-serif; font-size:0.85rem; margin-top:12px; display:block;';
  newChatBtn.textContent = '🔄 Start New Chat';
  newChatBtn.onclick = startNewChat;

  bubble.appendChild(newChatBtn);
  msg.appendChild(av);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// ── Start New Chat ──
function startNewChat() {
  chatbox.innerHTML = '';
  currentStep = "start";
  selectedCourse = "";
  userName = "";
  userPhone = "";
  autoGreet();
}

// ── Helpers ──
function addBotMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'message bot';
  const av = createBotAvatar();
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = text;
  msg.appendChild(av);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function addUserMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'message user';
  const av = document.createElement('div');
  av.className = 'msg-avatar';
  av.textContent = '👤';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  msg.appendChild(av);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function createBotAvatar() {
  const av = document.createElement('div');
  av.className = 'msg-avatar';
  const img = document.createElement('img');
  img.src = '/static/logo.webp';
  img.style.cssText = 'width:100%; height:100%; object-fit:contain;';
  av.appendChild(img);
  return av;
}

function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'message bot';
  typing.id = 'typing-indicator';
  const av = createBotAvatar();
  const dots = document.createElement('div');
  dots.className = 'bubble typing-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';
  typing.appendChild(av);
  typing.appendChild(dots);
  chatbox.appendChild(typing);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

msgInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});
