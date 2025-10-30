// Tab switching code
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');

    if (btn.dataset.tab === 'blog') {
      loadBlog();
    }
  });
});

// Chat demo
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

// --- Blog tab variables ---
const blogListContainer = document.getElementById('blogList');
const paginationContainer = document.getElementById('pagination');

const numposts = 18; // posts per page
let currentPage = 1;
let totalPosts = 0;
let blogData = [];

// Đọc nhãn từ URL hoặc set mặc định "The Caribbean"
const urlParams = new URLSearchParams(window.location.search);
const labelParam = urlParams.get('label') || "The%20Caribbean";
const labelName = decodeURIComponent(labelParam);

// Callback JSONP
window.showLabelPosts = function(json) {
  if (!json.feed) return;

  blogData = json.feed.entry || [];
  totalPosts = json.feed.openSearch$totalResults ? parseInt(json.feed.openSearch$totalResults.$t) : blogData.length;
  
  renderBlog();
  renderPagination();
}

function renderBlog() {
  if (!blogData.length) {
    blogListContainer.innerHTML = '<li>No posts found for label: ' + labelName + '</li>';
    paginationContainer.innerHTML = '';
    return;
  }
  const startIndex = (currentPage - 1) * numposts;
  const endIndex = Math.min(startIndex + numposts, blogData.length);
  let output = '';
  for (let i = startIndex; i < endIndex; i++) {
    const entry = blogData[i];
    const postTitle = entry.title.$t;
    let postUrl = '#';
    for (let k = 0; k < entry.link.length; k++) {
      if (entry.link[k].rel === 'alternate') {
        postUrl = entry.link[k].href;
        break;
      }
    }
    let postImage = '';
    if (entry.media$thumbnail) {
      postImage = entry.media$thumbnail.url.replace(/\/s[0-9]+-c\//, "/w300-h200-c/");
    } else if (entry.content && entry.content.$t) {
      const imgMatch = entry.content.$t.match(/<img[^>]+src=["'](.*?)["']/i);
      if (imgMatch && imgMatch[1]) {
        postImage = "https://imgproxy.balv-airdrop.workers.dev/?url=" + encodeURIComponent(imgMatch[1]) + "&auto=format,compress&q=72&fit=crop";
      }
    }
    const postSummary = entry.summary ? entry.summary.$t.replace(/<[^>]+>/g, "").substring(0, 100) + "..." : "";

    output += `<li class="label-post">
      ${postImage ? `<a href="${postUrl}" target="_blank"><img src="${postImage}" alt="${postTitle}" /></a>` : ''}
      <h3><a href="${postUrl}" target="_blank">${postTitle}</a></h3>
      <p>${postSummary}</p>
    </li>`;
  }
  blogListContainer.innerHTML = output;
}

function renderPagination() {
  const totalPages = Math.ceil(totalPosts / numposts);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }
  paginationContainer.innerHTML = `
    <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
  `;
}

window.changePage = function(page) {
  const totalPages = Math.ceil(totalPosts / numposts);
  if(page < 1 || page > totalPages) return;
  currentPage = page;
  window.scrollTo({top: 0, behavior: 'smooth'});
  loadBlog();
}

function loadBlog() {
  // Remove old script if any
  const oldScript = document.querySelector('script[data-label-script]');
  if (oldScript) oldScript.remove();

  const startIndex = (currentPage - 1) * numposts + 1;
  const script = document.createElement('script');
  script.setAttribute('data-label-script', 'true');
  script.src = `/feeds/posts/default/-/${encodeURIComponent(labelName)}?max-results=${numposts}&start-index=${startIndex}&orderby=published&alt=json-in-script&callback=showLabelPosts`;
  document.body.appendChild(script);
}

// Nếu tab blog đang active lúc load trang, gọi load blog ngay
if (document.querySelector('.tab-btn.active')?.dataset.tab === 'blog') {
  loadBlog();
}
