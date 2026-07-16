
    function showLogin() {
      document.getElementById("registerPage").classList.add("hidden");
      document.getElementById("loginPage").classList.remove("hidden");
    }

    function showRegister() {
      document.getElementById("loginPage").classList.add("hidden");
      document.getElementById("registerPage").classList.remove("hidden");
    }

    function register() {
      const username = document.getElementById("regUsername").value.trim();
      const password = document.getElementById("regPassword").value.trim();

      if (username === "" || password === "") {
        alert("Please fill all fields!");
        return;
      }

      if (localStorage.getItem(username)) {
        alert("User already exists!");
        return;
      }

      localStorage.setItem(username, password);
      alert("Registration successful! Please login now.");
      showLogin();
    }

    function login() {
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (localStorage.getItem(username) === password) {
        localStorage.setItem("loggedInUser", username);
        document.getElementById("userDisplay").innerText = username;
        showDashboard();
      } else {
        alert("Invalid credentials!");
      }
    }

    function logout() {
      localStorage.removeItem("loggedInUser");
      document.getElementById("dashboard").classList.add("hidden");
      showLogin();
    }

    function showDashboard() {
      document.getElementById("loginPage").classList.add("hidden");
      document.getElementById("registerPage").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      displayStudents();
    }

    // ====== Student Management ======
    function addStudent() {
      const name = document.getElementById("studentName").value.trim();
      const roll = document.getElementById("studentRoll").value.trim();
      const course = document.getElementById("studentCourse").value.trim();
      const user = localStorage.getItem("loggedInUser");

      if (!name || !roll || !course) {
        alert("Please fill all student fields!");
        return;
      }

      const key = `students_${user}`;
      const students = JSON.parse(localStorage.getItem(key)) || [];

      students.push({ name, roll, course });
      localStorage.setItem(key, JSON.stringify(students));

      document.getElementById("studentName").value = "";
      document.getElementById("studentRoll").value = "";
      document.getElementById("studentCourse").value = "";

      displayStudents();
    }

    function deleteStudent(index) {
      const user = localStorage.getItem("loggedInUser");
      const key = `students_${user}`;
      const students = JSON.parse(localStorage.getItem(key)) || [];

      students.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(students));
      displayStudents();
    }

    function displayStudents() {
      const user = localStorage.getItem("loggedInUser");
      const key = `students_${user}`;
      const students = JSON.parse(localStorage.getItem(key)) || [];
      const tbody = document.querySelector("#studentTable tbody");

      tbody.innerHTML = "";

      students.forEach((s, i) => {
        const row = `<tr>
          <td>${s.roll}</td>
          <td>${s.name}</td>
          <td>${s.course}</td>
          <td><button onclick="deleteStudent(${i})">Delete</button></td>
        </tr>`;
        tbody.innerHTML += row;
      });
    }

    // ====== Auto-login Check ======
    window.onload = () => {
      const user = localStorage.getItem("loggedInUser");
      if (user) {
        document.getElementById("userDisplay").innerText = user;
        showDashboard();
      }
    };