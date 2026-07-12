const msgs = document.getElementById("messages");
const input = document.getElementById("message");
const faqButtonsContainer = document.getElementById("faq-buttons");
const topicButtons = document.querySelectorAll(".topic-button");
const changeTopicButton = document.getElementById("change-topic");

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
      body: JSON.stringify({ message })
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

    const faqs = await response.json();
    renderFaqButtons(faqs);
  } catch (error) {
    console.warn("Unable to load FAQ buttons", error);
  }
}

function renderFaqButtons(faqs) {
  if (!faqButtonsContainer || !faqs?.length) return;

  faqButtonsContainer.innerHTML = "";
  faqs.slice(0, 12).forEach(faq => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "faq-button";
    button.textContent = faq.question;
    button.addEventListener("click", () => send(faq.question));
    faqButtonsContainer.appendChild(button);
  });
}

topicButtons.forEach(button => {
  button.addEventListener("click", () => {
    const topic = button.dataset.topic;
    input.value = topic;
    input.focus();
  });
});

changeTopicButton?.addEventListener("click", () => {
  input.value = "";
  input.focus();
});

document.getElementById("send").onclick = sendCurrent;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendCurrent();
});

loadFaqs();