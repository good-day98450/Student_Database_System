// Local Storage setup for notifications
const notificationForm = document.getElementById("notificationForm");
const notificationList = document.getElementById("notificationList");

let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

// Display notifications
function renderNotifications() {
  notificationList.innerHTML = notifications.length
    ? notifications.map(note => `
        <div class="note">
          <h3>${note.title}</h3>
          <p>${note.message}</p>
          <small>📅 ${note.date}</small>
        </div>
      `).join("")
    : "<p>No announcements yet.</p>";
}

// Handle new notification post
notificationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("noteTitle").value.trim();
  const message = document.getElementById("noteMessage").value.trim();

  if (!title || !message) return alert("Please enter both title and message!");

  const newNote = {
    title,
    message,
    date: new Date().toLocaleString()
  };

  notifications.unshift(newNote);
  localStorage.setItem("notifications", JSON.stringify(notifications));

  notificationForm.reset();
  renderNotifications();
});

// Initial render
renderNotifications();
