const chatbotWidget = document.getElementById('chatbotWidget');
const chatbotLauncher = document.getElementById('chatbotLauncher');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const categoryGrid = document.getElementById('categoryGrid');
const faqGrid = document.getElementById('faqGrid');
const chatArea = document.getElementById('chatArea');
const messagesContainer = document.getElementById('messages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const welcomeState = document.getElementById('welcomeState');
const backToCategories = document.getElementById('backToCategories');

const categories = [
  {
    id: 'center',
    title: 'About the Center',
    description: 'Learn about center services and capabilities.',
    questions: [
      'What is the Advanced Engineering Center?',
      'What services does the center provide?',
      'Who can benefit from the platform?'
    ]
  },
  {
    id: 'orders',
    title: 'Orders & Accounts',
    description: 'Get help on accounts, requests, and order tracking.',
    questions: [
      'Do I need an account?',
      'How do I submit a request?',
      'What documents are required?',
      'How can I track my request?',
      'Can I cancel or modify a request?'
    ]
  },
  {
    id: 'support',
    title: 'Technical Support',
    description: 'Get help with technical issues and platform usage.',
    questions: [
      'How can I contact support?',
      'Is my project data secure?',
      'What should I do if I encounter an issue?'
    ]
  }
];

const chatState = {
  open: false,
  activeCategory: null,
  history: []
};

function renderCategories() {
  categoryGrid.innerHTML = categories
    .map(
      category => `
        <button type="button" class="category-card" data-category="${category.id}">
          <div>
            <h3>${category.title}</h3>
            <p>${category.description}</p>
          </div>
          <span class="category-tag">Category</span>
        </button>
      `
    )
    .join('');
}

function renderFaqs(categoryId) {
  const category = categories.find(item => item.id === categoryId);
  if (!category) return;

  faqGrid.innerHTML = category.questions
    .map(
      question => `
        <button type="button" class="faq-card" data-question="${escapeHtml(question)}">
          <h3>${question}</h3>
        </button>
      `
    )
    .join('');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function openChat() {
  chatState.open = true;
  chatbotPanel.classList.add('open');
  chatbotPanel.setAttribute('aria-hidden', 'false');
  renderCategories();
  welcomeState.classList.remove('hidden');
  categoryGrid.classList.remove('hidden');
  faqGrid.classList.add('hidden');
  chatArea.classList.add('hidden');
  requestAnimationFrame(() => chatInput.focus());
  restoreHistory();
}

function closeChat() {
  chatState.open = false;
  chatbotPanel.classList.remove('open');
  chatbotPanel.setAttribute('aria-hidden', 'true');
}

function renderMessage(role, text) {
  const message = document.createElement('div');
  message.className = `message ${role}`;
  message.textContent = text;
  return message;
}

function addMessage(role, content) {
  const message = renderMessage(role, content);
  messagesContainer.appendChild(message);
  autoScroll();
}

function setLoadingState(isLoading) {
  if (isLoading) {
    const loading = document.createElement('div');
    loading.className = 'message loading';
    loading.id = 'loadingMessage';
    loading.textContent = 'Loading...';
    messagesContainer.appendChild(loading);
    autoScroll();
  } else {
    const loading = document.getElementById('loadingMessage');
    if (loading) {
      loading.remove();
    }
  }
}

function autoScroll() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function saveHistory(role, text) {
  chatState.history.push({ role, text, timestamp: Date.now() });
}

function restoreHistory() {
  if (!chatState.history.length) {
    messagesContainer.innerHTML = `<div class="message empty-state">Select a category or ask a question to get started.</div>`;
    return;
  }

  messagesContainer.innerHTML = '';
  chatState.history.forEach(entry => {
    messagesContainer.appendChild(renderMessage(entry.role, entry.text));
  });
  autoScroll();
}

async function sendMessage(messageText) {
  if (!messageText) return;

  addMessage('user', messageText);
  saveHistory('user', messageText);
  chatInput.value = '';
  chatArea.classList.remove('hidden');
  welcomeState.classList.add('hidden');
  categoryGrid.classList.add('hidden');
  faqGrid.classList.add('hidden');
  setLoadingState(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    setLoadingState(false);
    const assistantText = data.response || 'I could not retrieve an answer at this time.';
    addMessage('assistant', assistantText);
    saveHistory('assistant', assistantText);
  } catch (error) {
    setLoadingState(false);
    const errorText = 'Sorry, the assistant is unavailable. Please try again later.';
    addMessage('assistant', errorText);
    saveHistory('assistant', errorText);
    console.error(error);
  }
}

function handleCategoryClick(event) {
  const card = event.target.closest('.category-card');
  if (!card) return;
  const categoryId = card.dataset.category;
  chatState.activeCategory = categoryId;
  welcomeState.classList.add('hidden');
  categoryGrid.classList.add('hidden');
  faqGrid.classList.remove('hidden');
  backToCategories.classList.remove('hidden');
  chatArea.classList.remove('hidden');
  renderFaqs(categoryId);
  autoScroll();
}

function handleFaqClick(event) {
  const button = event.target.closest('.faq-card');
  if (!button) return;
  const question = button.dataset.question;
  sendMessage(question);
}

function resetCategories() {
  chatState.activeCategory = null;
  faqGrid.classList.add('hidden');
  backToCategories.classList.add('hidden');
  categoryGrid.classList.remove('hidden');
  welcomeState.classList.remove('hidden');
  chatArea.classList.add('hidden');
}

chatbotLauncher.addEventListener('click', () => {
  chatState.open ? closeChat() : openChat();
});

chatbotClose.addEventListener('click', closeChat);
backToCategories.addEventListener('click', resetCategories);

categoryGrid.addEventListener('click', handleCategoryClick);
faqGrid.addEventListener('click', handleFaqClick);

sendButton.addEventListener('click', () => {
  const text = chatInput.value.trim();
  if (!text) return;
  sendMessage(text);
});

chatInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    sendMessage(text);
  }
});

window.addEventListener('click', event => {
  if (!chatState.open) return;
  if (!chatbotPanel.contains(event.target) && event.target !== chatbotLauncher) {
    // Keep the panel open when clicking outside to preserve visibility.
  }
});
