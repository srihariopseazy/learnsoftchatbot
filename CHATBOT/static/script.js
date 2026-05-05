const chatToggle   = document.getElementById('chat-toggle');
const chatWindow   = document.getElementById('chat-window');
const chatbox      = document.getElementById('chatbox');
const closeBtn     = document.getElementById('close-chat');
const badge        = document.getElementById('notif-badge');
const msgInput     = document.getElementById('message-input');

// Unique session per browser tab
const user_id = "user_" + Math.random().toString(36).substring(2, 9);

// ── Toggle chat ──
chatToggle.onclick = () => {
  chatWindow.classList.toggle('open');
  badge.style.display = 'none';

  // Auto-greet on first open
  if (chatWindow.classList.contains('open') && chatbox.children.length === 0) {
    setTimeout(() => autoGreet(), 400);
  }
};

closeBtn.onclick = () => chatWindow.classList.remove('open');

// ── Auto greeting ──
async function autoGreet() {
  showTyping();
  await delay(800);
  removeTyping();
  addMessage(
    "👋 <b>Hi! Welcome to LearnSoft</b> 🎓<br><br>" +
    "I'm your course assistant. Type <b>hello</b> to explore 200+ IT courses, " +
    "or use the quick buttons below!",
    'bot'
  );
}

// ── Add message to UI ──
function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = 'message ' + sender;

  const avatarEl = document.createElement('div');
  avatarEl.className = 'msg-avatar';
  avatarEl.textContent = sender === 'bot' ? '🤖' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = text;

  msg.appendChild(avatarEl);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// ── Typing indicator ──
function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'message bot';
  typing.id = 'typing-indicator';

  const av = document.createElement('div');
  av.className = 'msg-avatar';
  av.textContent = '🤖';

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

// ── Send message ──
async function sendMessage() {
  const message = msgInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  msgInput.value = '';

  showTyping();
  await delay(700);
  removeTyping();

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, user_id })
    });

    const data = await res.json();
    addMessage(data.response, 'bot');

  } catch (err) {
    addMessage("⚠️ Server error. Please try again.", 'bot');
  }
}

// ── Quick chip ──
function sendChip(text) {
  msgInput.value = text;
  sendMessage();
}

// ── Enter key ──
msgInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

// ── Utility ──
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}