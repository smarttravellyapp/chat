// === Tab Switching Footer ===
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// === Chat Demo ===
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  chatInput.value = '';
  setTimeout(() => addMessage("Demo reply: " + text, 'bot'), 500);
}

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// === Blog Section (Static Demo Data) ===
const blogList = document.getElementById('blogList');
const loadMoreBtn = document.getElementById('loadMore');
let page = 0;

const demoPosts = [
  { title: "Introducing SmartTravelly Chat", link: "#" },
  { title: "How to Use the Blog Tab", link: "#" },
  { title: "Responsive UI for All Devices", link: "#" },
  { title: "Integrating APIs Coming Soon", link: "#" },
  { title: "Building with GitHub + Vercel", link: "#" },
  { title: "Lightweight, Fast, and Modern UI", link: "#" },
  { title: "Tabs Layout with Centered Design", link: "#" },
  { title: "Add Dark Mode Easily", link: "#" },
  { title: "TravelApp Style Interface", link: "#" },
  { title: "Cloudflare Worker Integration", link: "#" },
  { title: "Secure Chat Demo Placeholder", link: "#" },
  { title: "Future: Hive.blog Sync Support", link: "#" }
];

function loadBlog() {
  const start = page * 5;
  const slice = demoPosts.slice(start, start + 5);
  slice.forEach(p => {
    const li = document.createElement('li');
    li.className = 'blog-item';
    li.innerHTML = `<a href="${p.link}" target="_blank">${p.title}</a>`;
    blogList.appendChild(li);
  });
  page++;
  if (page * 5 >= demoPosts.length) loadMoreBtn.style.display = 'none';
}
if(loadMoreBtn) {
  loadMoreBtn.addEventListener('click', loadBlog);
  loadBlog();
}
