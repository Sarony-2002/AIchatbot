const chatbotWidget = document.getElementById('chatbotWidget');
const chatbotLauncher = document.getElementById('chatbotLauncher');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const messagesContainer = document.getElementById('messages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

const categories = [
  {
    id: 'center',
    title: 'About the Center',
    description: 'Learn about center services, capabilities, and user benefits.',
    questions: [
      'What is the Advanced Engineering Center?',
      'What services does the center provide?',
      'Who can benefit from the platform?'
    ]
  },
  {
    id: 'orders',
    title: 'Orders & Accounts',
    description: 'Get help with accounts, requests, and order tracking.',
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
    description: 'Find answers for technical issues and platform assistance.',
    questions: [
      'How can I contact support?',
      'Is my project data secure?',
      'What should I do if I encounter an issue?'
    ]
  }
];

const chatState = {
  open: false,
  history: []
};

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createAssistantMessage(text, actionsHtml = '') {
  const message = document.createElement('div');
  message.className = 'message assistant';
  message.innerHTML = `<p>${text}</p>${actionsHtml ? `<div class="action-buttons">${actionsHtml}</div>` : ''}`;
  return message;
}

function createUserMessage(text) {
  const message = document.createElement('div');
  message.className = 'message user';
  message.textContent = text;
  return message;
}

function renderButtonGroup(items, type) {
  return items
    .map(item => {
      if (type === 'category') {
        return `
          <button type="button" class="action-button" data-category="${item.id}">
            <strong>${item.title}</strong>
            <span>${item.description}</span>
          </button>
        `;
      }

      return `
        <button type="button" class="action-button" data-question="${escapeHtml(item)}">
          ${escapeHtml(item)}
        </button>
      `;
    })
    .join('');
}

function appendMessage(element) {
  messagesContainer.appendChild(element);
  autoScroll();
}

function autoScroll() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function saveHistory(role, text) {
  chatState.history.push({ role, text });
}

function restoreHistory() {
  messagesContainer.innerHTML = '';

  if (!chatState.history.length) {
    renderWelcomeState();
    return;
  }

  chatState.history.forEach(entry => {
    if (entry.role === 'assistant') {
      appendMessage(createAssistantMessage(entry.text));
    } else {
      appendMessage(createUserMessage(entry.text));
    }
  });
}

function renderWelcomeState() {
  const welcomeText =
    '👋 Welcome! I\'m your AI Assistant. You can ask me anything about the platform. For faster answers, choose a category below or type your question.';
  const categoryHtml = renderButtonGroup(categories, 'category');
  appendMessage(createAssistantMessage(welcomeText, categoryHtml));
}

function openChat() {
  chatState.open = true;
  chatbotPanel.classList.add('open');
  chatbotPanel.setAttribute('aria-hidden', 'false');
  restoreHistory();
  requestAnimationFrame(() => chatInput.focus());
}

function closeChat() {
  chatState.open = false;
  chatbotPanel.classList.remove('open');
  chatbotPanel.setAttribute('aria-hidden', 'true');
}

function setLoadingState(isLoading) {
  const loading = document.getElementById('loadingMessage');

  if (isLoading && !loading) {
    const loader = document.createElement('div');
    loader.className = 'message loading';
    loader.id = 'loadingMessage';
    loader.textContent = 'Loading...';
    appendMessage(loader);
  }

  if (!isLoading && loading) {
    loading.remove();
  }
}

async function sendMessage(messageText) {
  if (!messageText) return;

  appendMessage(createUserMessage(messageText));
  saveHistory('user', messageText);
  chatInput.value = '';
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
    appendMessage(createAssistantMessage(assistantText));
    saveHistory('assistant', assistantText);
  } catch (error) {
    setLoadingState(false);
    const errorText = 'Sorry, the assistant is unavailable. Please try again later.';
    appendMessage(createAssistantMessage(errorText));
    saveHistory('assistant', errorText);
    console.error(error);
  }
}

function handleMessageAction(event) {
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) {
    const categoryId = categoryButton.dataset.category;
    const category = categories.find(item => item.id === categoryId);
    if (!category) return;

    appendMessage(createUserMessage(category.title));
    saveHistory('user', category.title);
    const faqHtml = renderButtonGroup(category.questions, 'faq');
    appendMessage(createAssistantMessage(`Choose a question from ${category.title}:`, faqHtml));
    return;
  }

  const faqButton = event.target.closest('[data-question]');
  if (faqButton) {
    const questionText = faqButton.dataset.question;
    sendMessage(questionText);
  }
}

chatbotLauncher.addEventListener('click', () => {
  chatState.open ? closeChat() : openChat();
});

chatbotClose.addEventListener('click', closeChat);
messagesContainer.addEventListener('click', handleMessageAction);

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
    // intentionally keep the panel visible while open.
  }
});
