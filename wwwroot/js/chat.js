const msgs = document.getElementById("messages");
const input = document.getElementById("message");
const faqButtonsContainer = document.getElementById("faq-buttons");
const topicButtons = document.querySelectorAll(".topic-button");
const changeTopicButton = document.getElementById("change-topic");

let allFaqs = [];
let activeCategory = null;

function appendMessage(className, text) {
  msgs.innerHTML += `<div class="${className}">${text}</div>`;
  msgs.scrollTop = msgs.scrollHeight;
}

async function send(text) {
  const message = text?.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, category: activeCategory })
    });

    const data = await response.json();
    appendMessage("bot", data.response ?? data);
  } catch (error) {
    appendMessage("bot", "Server connection failed.");
    console.error(error);
  }
}

function sendCurrent() {
  send(input.value);
}

async function loadFaqs() {
  try {
    const response = await fetch("/questions.json");
    if (!response.ok) return;

    allFaqs = await response.json();
    renderFaqButtons(allFaqs);
  } catch (error) {
    console.warn("Unable to load FAQ buttons", error);
  }
}

function renderFaqButtons(faqs) {
  if (!faqButtonsContainer) return;

  const list = activeCategory
    ? faqs.filter(f => f.category === activeCategory)
    : faqs;

  faqButtonsContainer.innerHTML = "";
  list.slice(0, 12).forEach(faq => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "faq-button";
    button.textContent = faq.question;
    button.addEventListener("click", () => send(faq.question));
    faqButtonsContainer.appendChild(button);
  });
}

// Topic buttons set the active category (used for backend matching and to
// narrow the FAQ suggestions below), rather than just prefilling the input.
topicButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.topic;
    topicButtons.forEach(b => b.classList.toggle("active", b === button));
    renderFaqButtons(allFaqs);
    input.focus();
  });
});

changeTopicButton?.addEventListener("click", () => {
  activeCategory = null;
  topicButtons.forEach(b => b.classList.remove("active"));
  renderFaqButtons(allFaqs);
  input.value = "";
  input.focus();
});

document.getElementById("send").onclick = sendCurrent;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendCurrent();
});

loadFaqs();