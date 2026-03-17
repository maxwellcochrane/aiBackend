const loginScreen = document.getElementById('login-screen');
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');
const app = document.getElementById('app');
const messagesEl = document.getElementById('chat-messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const welcome = document.getElementById('welcome');

let threadId = null;
let busy = false;
let sessionPassword = sessionStorage.getItem('sp') || '';

if (sessionPassword) showChat();

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pw = passwordInput.value;
  loginError.hidden = true;

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hello', password: pw }),
    });
    if (res.status === 401) {
      loginError.hidden = false;
      return;
    }
    const data = await res.json();
    sessionPassword = pw;
    sessionStorage.setItem('sp', pw);
    threadId = data.threadId;
    showChat();
    if (welcome) welcome.remove();
    addMessage('assistant', data.reply);
  } catch {
    loginError.textContent = 'Connection error';
    loginError.hidden = false;
  }
});

function showChat() {
  loginScreen.hidden = true;
  app.hidden = false;
  input.focus();
}

function addMessage(role, text) {
  if (welcome) welcome.remove();

  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.id = 'typing';
  div.innerHTML = '<span></span><span></span><span></span>';
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTyping() {
  document.getElementById('typing')?.remove();
}

function setBusy(val) {
  busy = val;
  updateSendButton();
  input.disabled = val;
}

function updateSendButton() {
  sendBtn.disabled = busy || !input.value.trim();
}

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  updateSendButton();
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!busy && input.value.trim()) form.requestSubmit();
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || busy) return;

  addMessage('user', text);
  input.value = '';
  input.style.height = 'auto';
  setBusy(true);
  showTyping();

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, threadId, password: sessionPassword }),
    });

    const data = await res.json();
    hideTyping();

    if (!res.ok) throw new Error(data.error || 'Request failed');

    threadId = data.threadId;
    addMessage('assistant', data.reply);
  } catch (err) {
    hideTyping();
    addMessage('error', `Something went wrong: ${err.message}`);
  } finally {
    setBusy(false);
    input.focus();
  }
});

input.focus();
