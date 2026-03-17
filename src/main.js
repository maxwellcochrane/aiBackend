const messagesEl = document.getElementById('chat-messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

let threadId = null;
let busy = false;

function addMessage(role, text) {
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
  sendBtn.disabled = val;
  input.disabled = val;
}

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
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
      body: JSON.stringify({ message: text, threadId }),
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
