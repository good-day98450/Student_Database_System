// -------------------- NOTICE BOARD --------------------
const noticeForm = document.getElementById("noticeForm");
const noticeBoard = document.getElementById("noticeBoard");

let notices = JSON.parse(localStorage.getItem("notices")) || [];

function renderNotices() {
  noticeBoard.innerHTML = notices.length
    ? notices.map(n => `
        <div class="notice">
          <h3>${n.title}</h3>
          <p>${n.content}</p>
          <small>🕒 Posted on: ${n.date}</small>
        </div>
      `).join("")
    : "<p>No announcements yet.</p>";
}

noticeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("noticeTitle").value.trim();
  const content = document.getElementById("noticeContent").value.trim();

  if (!title || !content) return alert("Please fill in all notice fields!");

  const newNotice = {
    title,
    content,
    date: new Date().toLocaleString(),
  };

  notices.unshift(newNotice); // add to top
  localStorage.setItem("notices", JSON.stringify(notices));
  noticeForm.reset();
  renderNotices();
});

// -------------------- CONTACT / HELP --------------------
const contactForm = document.getElementById("contactForm");
const contactResponse = document.getElementById("contactResponse");
let messages = JSON.parse(localStorage.getItem("messages")) || [];

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const msg = document.getElementById("contactMsg").value.trim();

  if (!name || !email || !msg) return alert("Please fill all contact fields!");

  const newMessage = { name, email, msg, time: new Date().toLocaleString() };
  messages.push(newMessage);
  localStorage.setItem("messages", JSON.stringify(messages));

  contactResponse.textContent = "✅ Message sent successfully!";
  contactResponse.style.color = "green";
  contactForm.reset();
});

// Initial load
renderNotices();
