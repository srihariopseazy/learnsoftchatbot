const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeBtn   = document.getElementById('close-chat');
const chatbox    = document.getElementById('chatbox');
const msgInput   = document.getElementById('message-input');

const user_id = "user_" + Math.random().toString(36).substring(2, 9);

// ── Toggle ──
chatToggle.onclick = () => {
  chatWindow.classList.toggle('open');
  if (chatWindow.classList.contains('open') && chatbox.children.length === 0) {
    setTimeout(() => autoGreet(), 400);
  }
};

closeBtn.onclick = () => chatWindow.classList.remove('open');

// ── Auto open on page load ──
window.addEventListener('load', () => {
  setTimeout(() => {
    chatWindow.classList.add('open');
    if (chatbox.children.length === 0) {
      setTimeout(() => autoGreet(), 400);
    }
  }, 1500);
});

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

const COUNTRIES = [
  {code:"+93",name:"🇦🇫 Afghanistan"},{code:"+355",name:"🇦🇱 Albania"},{code:"+213",name:"🇩🇿 Algeria"},{code:"+376",name:"🇦🇩 Andorra"},{code:"+244",name:"🇦🇴 Angola"},{code:"+54",name:"🇦🇷 Argentina"},{code:"+374",name:"🇦🇲 Armenia"},{code:"+61",name:"🇦🇺 Australia"},{code:"+43",name:"🇦🇹 Austria"},{code:"+994",name:"🇦🇿 Azerbaijan"},{code:"+1242",name:"🇧🇸 Bahamas"},{code:"+973",name:"🇧🇭 Bahrain"},{code:"+880",name:"🇧🇩 Bangladesh"},{code:"+32",name:"🇧🇪 Belgium"},{code:"+501",name:"🇧🇿 Belize"},{code:"+229",name:"🇧🇯 Benin"},{code:"+975",name:"🇧🇹 Bhutan"},{code:"+591",name:"🇧🇴 Bolivia"},{code:"+387",name:"🇧🇦 Bosnia"},{code:"+267",name:"🇧🇼 Botswana"},{code:"+55",name:"🇧🇷 Brazil"},{code:"+673",name:"🇧🇳 Brunei"},{code:"+359",name:"🇧🇬 Bulgaria"},{code:"+226",name:"🇧🇫 Burkina Faso"},{code:"+257",name:"🇧🇮 Burundi"},{code:"+855",name:"🇰🇭 Cambodia"},{code:"+237",name:"🇨🇲 Cameroon"},{code:"+1",name:"🇨🇦 Canada"},{code:"+236",name:"🇨🇫 Central African Republic"},{code:"+235",name:"🇹🇩 Chad"},{code:"+56",name:"🇨🇱 Chile"},{code:"+86",name:"🇨🇳 China"},{code:"+57",name:"🇨🇴 Colombia"},{code:"+242",name:"🇨🇬 Congo"},{code:"+506",name:"🇨🇷 Costa Rica"},{code:"+385",name:"🇭🇷 Croatia"},{code:"+53",name:"🇨🇺 Cuba"},{code:"+357",name:"🇨🇾 Cyprus"},{code:"+420",name:"🇨🇿 Czech Republic"},{code:"+45",name:"🇩🇰 Denmark"},{code:"+253",name:"🇩🇯 Djibouti"},{code:"+1809",name:"🇩🇴 Dominican Republic"},{code:"+593",name:"🇪🇨 Ecuador"},{code:"+20",name:"🇪🇬 Egypt"},{code:"+503",name:"🇸🇻 El Salvador"},{code:"+291",name:"🇪🇷 Eritrea"},{code:"+372",name:"🇪🇪 Estonia"},{code:"+251",name:"🇪🇹 Ethiopia"},{code:"+679",name:"🇫🇯 Fiji"},{code:"+358",name:"🇫🇮 Finland"},{code:"+33",name:"🇫🇷 France"},{code:"+241",name:"🇬🇦 Gabon"},{code:"+995",name:"🇬🇪 Georgia"},{code:"+49",name:"🇩🇪 Germany"},{code:"+233",name:"🇬🇭 Ghana"},{code:"+30",name:"🇬🇷 Greece"},{code:"+502",name:"🇬🇹 Guatemala"},{code:"+224",name:"🇬🇳 Guinea"},{code:"+592",name:"🇬🇾 Guyana"},{code:"+509",name:"🇭🇹 Haiti"},{code:"+504",name:"🇭🇳 Honduras"},{code:"+36",name:"🇭🇺 Hungary"},{code:"+354",name:"🇮🇸 Iceland"},{code:"+91",name:"🇮🇳 India"},{code:"+62",name:"🇮🇩 Indonesia"},{code:"+98",name:"🇮🇷 Iran"},{code:"+964",name:"🇮🇶 Iraq"},{code:"+353",name:"🇮🇪 Ireland"},{code:"+972",name:"🇮🇱 Israel"},{code:"+39",name:"🇮🇹 Italy"},{code:"+1876",name:"🇯🇲 Jamaica"},{code:"+81",name:"🇯🇵 Japan"},{code:"+962",name:"🇯🇴 Jordan"},{code:"+7",name:"🇰🇿 Kazakhstan"},{code:"+254",name:"🇰🇪 Kenya"},{code:"+965",name:"🇰🇼 Kuwait"},{code:"+996",name:"🇰🇬 Kyrgyzstan"},{code:"+856",name:"🇱🇦 Laos"},{code:"+371",name:"🇱🇻 Latvia"},{code:"+961",name:"🇱🇧 Lebanon"},{code:"+231",name:"🇱🇷 Liberia"},{code:"+218",name:"🇱🇾 Libya"},{code:"+370",name:"🇱🇹 Lithuania"},{code:"+352",name:"🇱🇺 Luxembourg"},{code:"+261",name:"🇲🇬 Madagascar"},{code:"+265",name:"🇲🇼 Malawi"},{code:"+60",name:"🇲🇾 Malaysia"},{code:"+960",name:"🇲🇻 Maldives"},{code:"+223",name:"🇲🇱 Mali"},{code:"+356",name:"🇲🇹 Malta"},{code:"+222",name:"🇲🇷 Mauritania"},{code:"+230",name:"🇲🇺 Mauritius"},{code:"+52",name:"🇲🇽 Mexico"},{code:"+373",name:"🇲🇩 Moldova"},{code:"+377",name:"🇲🇨 Monaco"},{code:"+976",name:"🇲🇳 Mongolia"},{code:"+382",name:"🇲🇪 Montenegro"},{code:"+212",name:"🇲🇦 Morocco"},{code:"+258",name:"🇲🇿 Mozambique"},{code:"+95",name:"🇲🇲 Myanmar"},{code:"+264",name:"🇳🇦 Namibia"},{code:"+977",name:"🇳🇵 Nepal"},{code:"+31",name:"🇳🇱 Netherlands"},{code:"+64",name:"🇳🇿 New Zealand"},{code:"+505",name:"🇳🇮 Nicaragua"},{code:"+227",name:"🇳🇪 Niger"},{code:"+234",name:"🇳🇬 Nigeria"},{code:"+47",name:"🇳🇴 Norway"},{code:"+968",name:"🇴🇲 Oman"},{code:"+92",name:"🇵🇰 Pakistan"},{code:"+507",name:"🇵🇦 Panama"},{code:"+675",name:"🇵🇬 Papua New Guinea"},{code:"+595",name:"🇵🇾 Paraguay"},{code:"+51",name:"🇵🇪 Peru"},{code:"+63",name:"🇵🇭 Philippines"},{code:"+48",name:"🇵🇱 Poland"},{code:"+351",name:"🇵🇹 Portugal"},{code:"+974",name:"🇶🇦 Qatar"},{code:"+40",name:"🇷🇴 Romania"},{code:"+7",name:"🇷🇺 Russia"},{code:"+250",name:"🇷🇼 Rwanda"},{code:"+966",name:"🇸🇦 Saudi Arabia"},{code:"+221",name:"🇸🇳 Senegal"},{code:"+381",name:"🇷🇸 Serbia"},{code:"+248",name:"🇸🇨 Seychelles"},{code:"+232",name:"🇸🇱 Sierra Leone"},{code:"+65",name:"🇸🇬 Singapore"},{code:"+421",name:"🇸🇰 Slovakia"},{code:"+386",name:"🇸🇮 Slovenia"},{code:"+252",name:"🇸🇴 Somalia"},{code:"+27",name:"🇿🇦 South Africa"},{code:"+82",name:"🇰🇷 South Korea"},{code:"+211",name:"🇸🇸 South Sudan"},{code:"+34",name:"🇪🇸 Spain"},{code:"+94",name:"🇱🇰 Sri Lanka"},{code:"+249",name:"🇸🇩 Sudan"},{code:"+597",name:"🇸🇷 Suriname"},{code:"+46",name:"🇸🇪 Sweden"},{code:"+41",name:"🇨🇭 Switzerland"},{code:"+963",name:"🇸🇾 Syria"},{code:"+886",name:"🇹🇼 Taiwan"},{code:"+992",name:"🇹🇯 Tajikistan"},{code:"+255",name:"🇹🇿 Tanzania"},{code:"+66",name:"🇹🇭 Thailand"},{code:"+228",name:"🇹🇬 Togo"},{code:"+676",name:"🇹🇴 Tonga"},{code:"+1868",name:"🇹🇹 Trinidad and Tobago"},{code:"+216",name:"🇹🇳 Tunisia"},{code:"+90",name:"🇹🇷 Turkey"},{code:"+993",name:"🇹🇲 Turkmenistan"},{code:"+256",name:"🇺🇬 Uganda"},{code:"+380",name:"🇺🇦 Ukraine"},{code:"+971",name:"🇦🇪 UAE"},{code:"+44",name:"🇬🇧 UK"},{code:"+1",name:"🇺🇸 USA"},{code:"+598",name:"🇺🇾 Uruguay"},{code:"+998",name:"🇺🇿 Uzbekistan"},{code:"+58",name:"🇻🇪 Venezuela"},{code:"+84",name:"🇻🇳 Vietnam"},{code:"+967",name:"🇾🇪 Yemen"},{code:"+260",name:"🇿🇲 Zambia"},{code:"+263",name:"🇿🇼 Zimbabwe"}
];

// ── State ──
let currentStep = "start";
let selectedCourse = "";
let userName = "";
let userPhone = "";
let userEmail = "";
let userCity = "";
let userState = "";
let userCountry = "";

// ── Auto Greet ──
async function autoGreet() {
  showTyping();
  await delay(800);
  removeTyping();
  addBotMessage("👋 <b>Welcome to LearnSoft!</b> 🎓<br>500K+ professionals trained · 200+ IT courses.<br><br>Please select a course category:");
  await delay(300);
  showCategoryButtons();
}

// ── Category Buttons ──
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

async function onCategoryClick(key, name) {
  addUserMessage(name);
  showTyping();
  await delay(600);
  removeTyping();
  showCourseButtons(key, name);
}

// ── Course Buttons ──
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

// ── Phone Step ──
function showPhoneStep() {
  const msg = document.createElement('div');
  msg.className = 'message bot';
  const av = createBotAvatar();
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `📞 Select your <b>country code</b> and enter your <b>phone number</b>:`;
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:flex; gap:6px; margin-top:10px; align-items:center; flex-wrap:wrap;';
  const select = document.createElement('select');
  select.style.cssText = 'padding:8px 6px; border:1.5px solid #F5A623; border-radius:12px; font-family:Sora,sans-serif; font-size:0.76rem; background:white; color:#222; cursor:pointer; max-width:155px;';
  COUNTRIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = `${c.name} (${c.code})`;
    if (c.code === '+91') opt.selected = true;
    select.appendChild(opt);
  });
  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.placeholder = 'Phone number';
  phoneInput.style.cssText = 'flex:1; padding:8px 12px; border:1.5px solid #F5A623; border-radius:12px; font-family:Sora,sans-serif; font-size:0.85rem; outline:none; min-width:90px;';
  const submitBtn = document.createElement('button');
  submitBtn.textContent = '➤';
  submitBtn.style.cssText = 'background:#F5A623; color:white; border:none; border-radius:50%; width:36px; height:36px; cursor:pointer; font-size:16px; flex-shrink:0;';
  submitBtn.onclick = () => submitPhone(phoneInput.value, select.value);
  phoneInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitPhone(phoneInput.value, select.value); });
  wrapper.appendChild(select);
  wrapper.appendChild(phoneInput);
  wrapper.appendChild(submitBtn);
  bubble.appendChild(wrapper);
  msg.appendChild(av);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
  setTimeout(() => phoneInput.focus(), 100);
}

async function submitPhone(number, countryCode) {
  const digits = number.replace(/[\s\-\(\)]/g, '');
  if (digits.length < 5 || !/^\d+$/.test(digits)) {
    addBotMessage("❌ Please enter a valid phone number.");
    return;
  }
  userPhone = `${countryCode} ${digits}`;
  addUserMessage(userPhone);
  currentStep = "email";
  showTyping();
  await delay(600);
  removeTyping();
  addBotMessage("📧 Please enter your <b>email address</b>:");
  msgInput.focus();
}

// ── Location Step ──
function showLocationStep() {
  const msg = document.createElement('div');
  msg.className = 'message bot';
  const av = createBotAvatar();
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `📍 Please fill in your <b>location details</b>:`;
  const form = document.createElement('div');
  form.style.cssText = 'display:flex; flex-direction:column; gap:8px; margin-top:10px;';
  const inputStyle = 'padding:8px 12px; border:1.5px solid #F5A623; border-radius:12px; font-family:Sora,sans-serif; font-size:0.83rem; outline:none; width:100%;';
  const cityInput = document.createElement('input');
  cityInput.placeholder = '🏙️ City';
  cityInput.style.cssText = inputStyle;
  const stateInput = document.createElement('input');
  stateInput.placeholder = '🗺️ State / Province';
  stateInput.style.cssText = inputStyle;
  const countrySelect = document.createElement('select');
  countrySelect.style.cssText = inputStyle + 'cursor:pointer; background:white; color:#222;';
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '🌍 Select Country';
  countrySelect.appendChild(defaultOpt);
  COUNTRIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name.replace(/^.{1,4}\s/, '');
    opt.textContent = c.name;
    if (c.code === '+91') opt.selected = true;
    countrySelect.appendChild(opt);
  });
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit ➤';
  submitBtn.style.cssText = 'background:#F5A623; color:white; border:none; border-radius:20px; padding:10px 20px; cursor:pointer; font-family:Sora,sans-serif; font-size:0.85rem; margin-top:4px;';
  submitBtn.onclick = () => submitLocation(cityInput.value, stateInput.value, countrySelect.value);
  form.appendChild(cityInput);
  form.appendChild(stateInput);
  form.appendChild(countrySelect);
  form.appendChild(submitBtn);
  bubble.appendChild(form);
  msg.appendChild(av);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
  setTimeout(() => cityInput.focus(), 100);
}

async function submitLocation(city, state, country) {
  if (!city.trim() || !state.trim() || !country) {
    addBotMessage("❌ Please fill in all location fields.");
    return;
  }
  userCity = city.trim();
  userState = state.trim();
  userCountry = country;
  addUserMessage(`📍 ${userCity}, ${userState}, ${userCountry}`);
  showTyping();
  await delay(600);
  removeTyping();
  try {
    await fetch('/save_lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName, phone: userPhone, email: userEmail, course: selectedCourse, city: userCity, state: userState, country: userCountry })
    });
  } catch (e) {}
  currentStep = "done";
  showThankYou();
}

// ── Send Text ──
async function sendMessage() {
  const message = msgInput.value.trim();
  if (!message) return;
  if (currentStep === "phone" || currentStep === "location" || currentStep === "category" || currentStep === "course") return;
  addUserMessage(message);
  msgInput.value = '';
  showTyping();
  await delay(600);
  removeTyping();
  if (currentStep === "name") {
    if (message.length < 2) { addBotMessage("❌ Please enter your <b>full name</b>."); return; }
    userName = message.trim().replace(/\b\w/g, c => c.toUpperCase());
    currentStep = "phone";
    showPhoneStep();
  } else if (currentStep === "email") {
    if (!message.includes('@') || !message.includes('.')) { addBotMessage("❌ Please enter a valid <b>email address</b>."); return; }
    userEmail = message.trim().toLowerCase();
    currentStep = "location";
    showLocationStep();
  } else {
    startNewChat();
  }
}

// ── Thank You ──
function showThankYou() {
  const msg = document.createElement('div');
  msg.className = 'message bot';
  const av = createBotAvatar();
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `🎉 <b>Thank you, ${userName}!</b><br><br>✅ Registered for <b>${selectedCourse}</b>.<br>📍 ${userCity}, ${userState}, ${userCountry}<br>📲 Our counsellor will contact you within <b>24 hours</b>.`;
  const btn = document.createElement('button');
  btn.style.cssText = 'background:#F5A623; color:white; border:none; padding:10px 20px; border-radius:25px; cursor:pointer; font-family:Sora,sans-serif; font-size:0.85rem; margin-top:12px; display:block;';
  btn.textContent = '🔄 Start New Chat';
  btn.onclick = startNewChat;
  bubble.appendChild(btn);
  msg.appendChild(av);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// ── Start New Chat ──
function startNewChat() {
  chatbox.innerHTML = '';
  currentStep = "start";
  selectedCourse = userName = userPhone = userEmail = userCity = userState = userCountry = "";
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
  const t = document.createElement('div');
  t.className = 'message bot';
  t.id = 'typing-indicator';
  const av = createBotAvatar();
  const dots = document.createElement('div');
  dots.className = 'bubble typing-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';
  t.appendChild(av);
  t.appendChild(dots);
  chatbox.appendChild(t);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

msgInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
