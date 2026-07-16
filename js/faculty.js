const teacherForm = document.getElementById("teacherForm");
const teacherTableBody = document.getElementById("teacherTableBody");
const searchTeacher = document.getElementById("searchTeacher");

let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

// Render Teachers Table
function renderTeachers(filter = "") {
  teacherTableBody.innerHTML = "";

  const filteredTeachers = teachers.map((t, i) => ({ ...t, originalIndex: i })) // keep track of real index
    .filter(t =>
    t.name.toLowerCase().includes(filter.toLowerCase()) ||
    t.subject.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredTeachers.length === 0) {
    teacherTableBody.innerHTML = `<tr><td colspan="5">No teachers found.</td></tr>`;
    return;
  }

  filteredTeachers.forEach((teacher) => {
    const row = `
      <tr>
        <td>${teacher.name}</td>
        <td>${teacher.subject}</td>
        <td>${teacher.contact}</td>
        <td>${teacher.assignedClass}</td>
        <td>
          <button class="edit-btn" onclick="editTeacher(${teacher.originalIndex})">Edit</button>

        </td>
      </tr>
    `;
    teacherTableBody.innerHTML += row;
  });
}

// Add Teacher
teacherForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("teacherName").value.trim();
  const subject = document.getElementById("teacherSubject").value.trim();
  const contact = document.getElementById("teacherContact").value.trim();
  const assignedClass = document.getElementById("teacherClass").value.trim();

  if (!name || !subject || !contact || !assignedClass) {
    alert("Please fill all fields!");
    return;
  }

  teachers.push({ name, subject, contact, assignedClass });
  localStorage.setItem("teachers", JSON.stringify(teachers));
  teacherForm.reset();
  renderTeachers();
});

// Edit Teacher
function editTeacher(index) {
  const teacher = teachers[index];
  document.getElementById("teacherName").value = teacher.name;
  document.getElementById("teacherSubject").value = teacher.subject;
  document.getElementById("teacherContact").value = teacher.contact;
  document.getElementById("teacherClass").value = teacher.assignedClass;

  teachers.splice(index, 1);
  localStorage.setItem("teachers", JSON.stringify(teachers));
  renderTeachers();
}

// Delete Teacher
function deleteTeacher(index) {
  if (confirm("Are you sure you want to delete this teacher?")) {
    teachers.splice(index, 1);
    localStorage.setItem("teachers", JSON.stringify(teachers));
    renderTeachers();
  }
}

// Search Filter
searchTeacher.addEventListener("input", (e) => {
  renderTeachers(e.target.value);
});

// Initial Load
renderTeachers();
