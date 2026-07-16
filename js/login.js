// LOGIN FUNCTION
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const message = document.getElementById("message");

  // Validation
  if (!role) {
    message.textContent = "Please select a role!";
    message.style.color = "red";
    return;
  }

  if (email === "" || password === "") {
    message.textContent = "Please enter both email and password!";
    message.style.color = "red";
    return;
  }

  // Create user session
  const user = {
    email: email,
    password: password,
    role: role,
    name: email.split("@")[0] || "User"
  };

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  // Redirect based on role
  if (role === "student") {
    window.location.href = "studentDashboard.html";
  } else if (role === "teacher") {
    window.location.href = "teacherDashboard.html";
  } else if (role === "admin") {
    window.location.href = "adminDashboard.html";
  }
});

// DASHBOARD LOAD HANDLER
if (
  window.location.pathname.includes("admin.html") ||
  window.location.pathname.includes("teacher.html") ||
  window.location.pathname.includes("student.html")
) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "index.html";
  } else {
    const nameEl = document.getElementById("userName");
    const roleEl = document.getElementById("userRole");

    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role;
  }
}

// PROFILE PAGE
if (window.location.pathname.includes("profile.html")) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) window.location.href = "index.html";

  document.getElementById("name").value = user.name;
  document.getElementById("emailProfile").value = user.email;

  document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newName = document.getElementById("name").value;
    const newPassword = document.getElementById("newPassword").value;

    const updatedUser = { ...user, name: newName };
    if (newPassword) updatedUser.password = newPassword;

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    alert("Profile updated successfully!");
  });
}

// NAVIGATION FUNCTIONS
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function goToProfile() {
  window.location.href = "profile.html";
}

function backToDashboard() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return (window.location.href = "index.html");

  if (user.role === "student") window.location.href = "student.html";
  else if (user.role === "teacher") window.location.href = "teacher.html";
  else if (user.role === "admin") window.location.href = "admin.html";
}
