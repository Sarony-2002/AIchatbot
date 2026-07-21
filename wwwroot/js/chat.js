const panel = document.getElementById("chat-panel");
const launcher = document.getElementById("chat-launcher");
const closeButton = document.getElementById("chat-close");
const msgs = document.getElementById("messages");
const input = document.getElementById("message");
const sendButton = document.getElementById("send");
const faqPanel = document.getElementById("faq-panel");
const faqTitle = document.getElementById("faq-title");
const faqButtonsContainer = document.getElementById("faq-buttons");
const topicButtonsContainer = document.getElementById("topic-buttons");
const changeTopicButton = document.getElementById("change-topic");

const topicDisplay = [
  {
    label: " المركز والخدمات",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true"><path d="M4 20h16"/><path d="M6 20V8l6-4 6 4v12"/><path d="M9 20v-6h6v6"/></svg>`
  },
  {
    label: "الطلبات والحسابات",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true"><path d="M6 3h12l2 4v14H4V7z"/><path d="M6 7h12"/><path d="M9 12h6"/><path d="M9 16h4"/></svg>`
  },
  {
    label: "الدعم الفني والتواصل",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true"><path d="M4 12a8 8 0 0 1 16 0"/><path d="M4 12v4a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2Z"/><path d="M20 12v4a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2Z"/><path d="M13 20h3a4 4 0 0 0 4-4"/></svg>`
  }
];

let allFaqs = [];
let categories = [];
let activeCategory = null;

function appendMessage(className, text) {
  const message = document.createElement("div");
  message.className = className;
  message.textContent = text;
  msgs.appendChild(message);
  msgs.scrollTop = msgs.scrollHeight;
}

function setPanelOpen(isOpen) {
  panel.classList.toggle("is-open", isOpen);
  launcher.classList.toggle("is-hidden", isOpen);
  panel.setAttribute("aria-hidden", String(!isOpen));
  launcher.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    requestAnimationFrame(() => input.focus());
  }
}

// Add these two new helper functions to control the layout states cleanly
function showTypingIndicator() {
  // Check if it already exists to prevent duplicate bubbles
  if (document.getElementById("typing-loader")) return;

  const indicator = document.createElement("div");
  indicator.id = "typing-loader";
  indicator.className = "typing-indicator"; // Connects to our CSS layout rules

  // Create the 3 dancing dots
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    indicator.appendChild(dot);
  }

  msgs.appendChild(indicator);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typing-loader");
  if (indicator) {
    indicator.remove();
  }
}

// ─── UPDATE YOUR EXISTING SEND METHOD TO LOOK LIKE THIS ───
async function send(text) {
  const message = text?.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  // 👉 1. Show the typing animation immediately as soon as user submits text
  showTypingIndicator();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, category: activeCategory })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // 👉 2. Remove the loader animation right before rendering the real text response
    removeTypingIndicator();
    appendMessage("bot", data.response ?? data);

  } catch (error) {
    // 👉 3. Clean up the loader if a server connection issue happens
    removeTypingIndicator();
    appendMessage("bot", "Server connection failed.");
    console.error(error);
  }
}

function sendCurrent() {
  send(input.value);
}

async function loadFaqs() {
  try {
    const response = await fetch("/api/chat/faqs");
    if (!response.ok) return;

    allFaqs = await response.json();
    categories = [...new Set(allFaqs.map(faq => faq.category))];
    renderTopicButtons();
  } catch (error) {
    console.warn("Unable to load FAQ buttons", error);
  }
}

function renderTopicButtons() {
  topicButtonsContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const display = topicDisplay[index] ?? {
      label: `Topic ${index + 1}`,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 10a3 3 0 1 1 5 2c-1 .7-2 1.5-2 3"/><path d="M12 18h.01"/></svg>`
    };
    const button = document.createElement("button");
    button.type = "button";
    button.className = "topic-button";
    button.dataset.topic = category;
    button.setAttribute("aria-label", display.label);

    const icon = document.createElement("span");
    icon.className = "topic-icon";
    icon.innerHTML = display.icon;

    const text = document.createElement("span");
    text.className = "topic-text";
    text.textContent = display.label;

    button.append(icon, text);
    button.addEventListener("click", () => selectTopic(category, display.label, button));
    topicButtonsContainer.appendChild(button);
  });
}

function selectTopic(category, label, button) {
  activeCategory = category;
  document.querySelectorAll(".topic-button").forEach(item => {
    item.classList.toggle("active", item === button);
  });
  faqTitle.textContent = `أسئلة ${label} `;
  renderFaqButtons();
  faqPanel.hidden = false;
//   appendMessage("bot", `Here are the ${label.toLowerCase()} questions. If yours is not listed, type it below.`);
}

function renderFaqButtons() {
  const list = allFaqs.filter(faq => faq.category === activeCategory);
  faqButtonsContainer.innerHTML = "";

  list.forEach(faq => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "faq-button";
    button.textContent = faq.question;
    button.addEventListener("click", () => send(faq.question));
    faqButtonsContainer.appendChild(button);
  });
}

function resetTopic() {
  activeCategory = null;
  document.querySelectorAll(".topic-button").forEach(button => button.classList.remove("active"));
  faqPanel.hidden = true;
  faqButtonsContainer.innerHTML = "";
  input.focus();
}

launcher.addEventListener("click", () => setPanelOpen(true));
closeButton.addEventListener("click", () => setPanelOpen(false));
changeTopicButton.addEventListener("click", resetTopic);
sendButton.addEventListener("click", sendCurrent);
input.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendCurrent();
  }
});

loadFaqs();
