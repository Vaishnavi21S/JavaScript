const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("messageInput");
const themeToggle = document.getElementById("themeToggle");

// Send a message
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  messageInput.value = "";

  showTyping();

  setTimeout(() => {
    removeTyping();
    simulateBotReply(text);
  }, 1500);
}

// Show a message with avatar
function appendMessage(sender, text, timestamp = null) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("message", sender);

  const time = timestamp || new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Avatar emoji for user and bot
  const avatarContent = sender === "user" ? "😊" : "🤖";

  messageEl.innerHTML = `
    <div class="avatar">${avatarContent}</div>
    <div>
      <div>${text}</div>
      <div class="timestamp">${time}</div>
    </div>
  `;

  chatBox.appendChild(messageEl);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (sender !== "typing") {
    saveMessage({ sender, text, time });
  }
}

// Simulated bot reply
function simulateBotReply(userText) {
  const replies = [
    "That's interesting!",
    "Tell me more.",
    "I'm just a bot, but I'm listening!",
    "Hmm 🤔",
    "Cool! 😎",
  ];
  const reply = replies[Math.floor(Math.random() * replies.length)];
  appendMessage("bot", reply);
}

// Typing indicator
function showTyping() {
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "message bot";
  typing.innerHTML = `<div><em>Bot is typing...</em></div>`;
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// Save message to localStorage
function saveMessage(msg) {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push(msg);
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Load saved messages
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("chatHistory")) || [];
  messages.forEach((msg) => {
    appendMessage(msg.sender, msg.text, msg.time);
  });
}

// Clear chat
function clearChat() {
  localStorage.removeItem("chatHistory");
  chatBox.innerHTML = "";
}

// Download chat
function downloadChat() {
  const messages = JSON.parse(localStorage.getItem("chatHistory")) || [];
  let content = messages
    .map((m) => `[${m.time}] ${m.sender}: ${m.text}`)
    .join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "chat.txt";
  link.click();
}

// Emoji picker
document.querySelectorAll(".emoji-picker span").forEach((emoji) => {
  emoji.addEventListener("click", () => {
    messageInput.value += emoji.textContent;
    messageInput.focus();
  });
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

// Enter key sends message
messageInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Load theme and messages on start
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
  loadMessages();
};
document.getElementById("homeButton").addEventListener("click", () => {
  window.location.href = "index.html"; // or your actual homepage file
});
