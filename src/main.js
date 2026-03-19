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

const loginBtn = document.getElementById('login-btn');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pw = passwordInput.value;
  loginError.hidden = true;
  loginBtn.disabled = true;
  loginBtn.dataset.text = loginBtn.textContent;
  loginBtn.textContent = '';
  loginBtn.classList.add('loading');

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verifyOnly: true, password: pw }),
    });
    if (res.status === 401) {
      loginError.hidden = false;
      return;
    }
    sessionPassword = pw;
    sessionStorage.setItem('sp', pw);
    showChat();
  } catch {
    loginError.textContent = 'Connection error';
    loginError.hidden = false;
  } finally {
    loginBtn.disabled = false;
    loginBtn.classList.remove('loading');
    loginBtn.textContent = loginBtn.dataset.text || 'Continue';
  }
});

function showChat() {
  loginScreen.hidden = true;
  app.hidden = false;
  input.focus();
}

function isDelayed(expected, scheduled) {
  return !!(expected && scheduled && expected !== scheduled);
}

function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes < 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function createJourneyCardsElement(journeyCards) {
  const wrapper = document.createElement('div');
  wrapper.className = 'journey-cards';

  for (const card of journeyCards) {
    const cardEl = document.createElement('article');
    cardEl.className = 'journey-card';

    const title = document.createElement('div');
    title.className = 'journey-card-title';
    title.textContent = `${card.o || '?'} \u2192 ${card.d || '?'}`;
    cardEl.appendChild(title);

    const times = document.createElement('div');
    times.className = 'journey-card-times';

    const depDelayed = isDelayed(card.etd, card.std);
    const arrDelayed = isDelayed(card.eta, card.sta);

    const departure = document.createElement('span');
    departure.textContent = depDelayed ? `${card.std} \u2192 ${card.etd}` : (card.std || '');
    if (depDelayed) departure.classList.add('delayed');

    const arrow = document.createElement('span');
    arrow.className = 'journey-arrow';
    arrow.textContent = ' \u2192 ';

    const arrival = document.createElement('span');
    arrival.textContent = arrDelayed ? `${card.sta} \u2192 ${card.eta}` : (card.sta || '');
    if (arrDelayed) arrival.classList.add('delayed');

    times.append(departure, arrow, arrival);
    cardEl.appendChild(times);

    const meta = document.createElement('div');
    meta.className = 'journey-card-meta';

    const platform = card.op ? `Plat ${card.op}` : 'Plat TBC';
    const changes = card.c ?? 0;
    const changesText = `${changes} change${changes === 1 ? '' : 's'}`;
    const duration = formatDuration(card.m);

    meta.textContent = `${platform} · ${changesText}${duration ? ` · ${duration}` : ''}`;
    cardEl.appendChild(meta);

    wrapper.appendChild(cardEl);
  }

  return wrapper;
}

function addMessage(role, text, links, journeyCards) {
  if (welcome) welcome.remove();

  const div = document.createElement('div');
  div.className = `message ${role}`;
  if (text) div.textContent = text;

  if (links && links.length > 0) {
    const linksContainer = document.createElement('div');
    linksContainer.className = 'message-links';

    for (const link of links) {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'action-link';
      a.textContent = link.label;
      a.title = link.description || '';
      linksContainer.appendChild(a);
    }

    div.appendChild(linksContainer);
  }

  if (role === 'assistant' && Array.isArray(journeyCards) && journeyCards.length > 0) {
    div.appendChild(createJourneyCardsElement(journeyCards));
  }

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
    const cards = data?.ui?.type === 'journey_cards' ? data.ui.data : data.journeyCards;
    addMessage('assistant', data.reply, data.links, cards);
  } catch (err) {
    hideTyping();
    addMessage('error', `Something went wrong: ${err.message}`);
  } finally {
    setBusy(false);
    input.focus();
  }
});

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    document.documentElement.style.setProperty(
      '--vh', `${window.visualViewport.height}px`
    );
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });
}

input.addEventListener('focus', () => {
  setTimeout(() => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, 300);
});

input.focus();
