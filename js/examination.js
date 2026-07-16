let exams = JSON.parse(localStorage.getItem("exams")) || [];

const examForm = document.getElementById("examForm");
const tbody = document.querySelector("#examTable tbody");
const searchBox = document.getElementById("searchBox");
const reportContainer = document.getElementById("reportCards");

// Calculate Grade
function getGrade(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 75) return "A";
  if (marks >= 60) return "B";
  if (marks >= 45) return "C";
  return "D";
}

// Add Exam Data
examForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const studentName = document.getElementById("studentName").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const examDate = document.getElementById("examDate").value;
  const marks = parseInt(document.getElementById("marks").value);

  if (!studentName || !subject || !examDate || isNaN(marks)) {
    alert("Please fill all fields correctly!");
    return;
  }

  const grade = getGrade(marks);

  exams.push({ studentName, subject, examDate, marks, grade });
  localStorage.setItem("exams", JSON.stringify(exams));

  examForm.reset();
  renderTable();
});

// Render Table
function renderTable(filter = "") {
  tbody.innerHTML = "";
  
  exams
    .filter(exam => exam.studentName.toLowerCase().includes(filter.toLowerCase()))
    .forEach((exam, index) => {
      tbody.innerHTML = 
        `<tr>
          <td>${exam.studentName}</td>
          <td>${exam.subject}</td>
          <td>${exam.examDate}</td>
          <td>${exam.marks}</td>
          <td>${exam.grade}</td>
          <td>
            <button onclick="editExam(${index})">✏️</button>
            <button onclick="deleteExam(${index})">🗑️</button>
          </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}
//  Edit Record 
function editExam(index) {
  const currentMarks = exams[index].marks; // 🔹 Added: store current marks in variable for clarity
  const newMarks = prompt("Enter new marks:", currentMarks);

  // 🔹 Changed condition: added .trim() check to prevent empty input
  if (newMarks !== null && newMarks.trim() !== "") {

    const marksValue = parseInt(newMarks); // 🔹 Added: store parsed marks separately

    // 🔹 New validation: ensure user enters a valid number
    if (!isNaN(marksValue)) {
      exams[index].marks = marksValue;
      exams[index].grade = getGrade(marksValue); // 🔹 Updated to use marksValue safely

      localStorage.setItem("exams", JSON.stringify(exams));
      renderTable(); 
    } else {
      alert("Please enter a valid number for marks."); // 🔹 Added: error message for invalid input
    }
  }
}

// ✅ Delete Record (same logic, but cleaner)
function deleteExam(index) {
  const confirmDelete = confirm("Are you sure you want to delete this record?"); // 🔹 Renamed variable for readability

  if (confirmDelete) {
    exams.splice(index, 1);
    localStorage.setItem("exams", JSON.stringify(exams)); 
    renderTable(); 
  }
}

// Search Functionality
searchBox.addEventListener("input", (e) => {
  renderTable(e.target.value);
});

// Generate Report Cards
document.getElementById("generateReportBtn").addEventListener("click", () => {
  if (exams.length === 0) return alert("No data to generate reports!");

  const students = [...new Set(exams.map(e => e.studentName))];
  reportContainer.innerHTML = "<h2>📑 Report Cards</h2>";

  students.forEach(student => {
    const studentExams = exams.filter(e => e.studentName === student);
    const avgMarks = (studentExams.reduce((a, b) => a + b.marks, 0) / studentExams.length).toFixed(2);
    const overallGrade = getGrade(avgMarks);

    let tableRows = studentExams.map(e => `
      <tr>
        <td>${e.subject}</td>
        <td>${e.examDate}</td>
        <td>${e.marks}</td>
        <td>${e.grade}</td>
      </tr>
    `).join("");

    reportContainer.innerHTML += `
      <div class="report-card">
        <h3>${student}</h3>
        <table>
          <tr><th>Subject</th><th>Date</th><th>Marks</th><th>Grade</th></tr>
          ${tableRows}
        </table>
        <p><b>Average Marks:</b> ${avgMarks}</p>
        <p><b>Overall Grade:</b> ${overallGrade}</p>
        <hr>
      </div>
    `;
  });
});

// Initial Render
renderTable();

