// Switch tabs
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

// Simple chat demo (local)
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

// Fetch Hive Blog RSS (demo 10 posts)
const blogList = document.getElementById('blogList');
const loadMoreBtn = document.getElementById('loadMore');
let page = 0, posts = [];

async function loadBlog() {
  if (posts.length === 0) {
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://hive.blog/@rentmoney/feed');
    const data = await res.json();
    posts = data.items || [];
  }

  const slice = posts.slice(page * 10, (page + 1) * 10);
  slice.forEach(p => {
    const li = document.createElement('li');
    li.className = 'blog-item';
    li.innerHTML = `<a href="${p.link}" target="_blank">${p.title}</a>`;
    blogList.appendChild(li);
  });

  page++;
  if (page * 10 >= posts.length) loadMoreBtn.style.display = 'none';
}
loadMoreBtn.addEventListener('click', loadBlog);
loadBlog();
