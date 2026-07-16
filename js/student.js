let students = JSON.parse(localStorage.getItem("students")) || [];

const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("search");

// Display students in the table
function displayStudents(list = students) {
  tableBody.innerHTML = "";
  if (list.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='6'>No students found</td></tr>";
    return;
  }

  list.forEach((student, index) => {
    const row = `
      <tr>
        <td><img src="${student.photo || 'https://via.placeholder.com/60'}" alt="Student"></td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.contact}</td>
        <td>${student.course}</td>
        <td>
          <button onclick="editStudent(${index})">Edit</button>
          <button onclick="deleteStudent(${index})" style="background:red;">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Add or update student
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const course = document.getElementById("course").value;
  const photo = document.getElementById("photo").value.trim();
  const editIndex = document.getElementById("editIndex").value;

  if (editIndex) {
    students[editIndex] = { name, email, contact, course, photo };
    document.getElementById("editIndex").value = "";
  } else {
    students.push({ name, email, contact, course, photo });
  }

  localStorage.setItem("students", JSON.stringify(students));
  form.reset();
  displayStudents();
});

// Edit student
function editStudent(index) {
  const student = students[index];
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("contact").value = student.contact;
  document.getElementById("course").value = student.course;
  document.getElementById("photo").value = student.photo;
  document.getElementById("editIndex").value = index;
}

// Delete student
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
  }
}

// Search / Filter students
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = students.filter(student =>
    student.name.toLowerCase().includes(keyword) ||
    student.email.toLowerCase().includes(keyword) ||
    student.course.toLowerCase().includes(keyword)
  );
  displayStudents(filtered);
});

// Initialize display
window.onload = displayStudents;
