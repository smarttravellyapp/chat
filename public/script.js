const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const chatBody = document.getElementById("chatBody");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage("user", text);
  input.value = "";

  setTimeout(() => {
    appendMessage("bot", getBotReply(text));
  }, 700);
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-message" : "bot-message";
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotReply(input) {
  const lower = input.toLowerCase();
  if (lower.includes("tour")) return "🌴 Try exploring Bali, Thailand, or Vietnam!";
  if (lower.includes("flight")) return "✈️ You can find cheap flights on our Flights tab.";
  if (lower.includes("shop")) return "🛍️ Check out our Shop tab for travel gear!";
  return "🤖 I’m a demo bot! Real API will be connected soon.";
}
