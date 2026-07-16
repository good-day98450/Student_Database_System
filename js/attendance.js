// Elements
const attendanceForm = document.getElementById("attendanceForm");
const attendanceBody = document.getElementById("attendanceBody");
const filterMonth = document.getElementById("filterMonth");
const summaryText = document.getElementById("summaryText");

// LocalStorage
let attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

// Render Function
function renderAttendance(records = attendanceRecords) {
  attendanceBody.innerHTML = "";

  if (records.length === 0) {
    attendanceBody.innerHTML = "<tr><td colspan='4'>No attendance data available.</td></tr>";
    summaryText.textContent = "No data available yet.";
    return;
  }

  let presentCount = 0, absentCount = 0;

  records.forEach((record, index) => {
    if (record.status === "Present") presentCount++;
    else absentCount++;

    attendanceBody.innerHTML += `
      <tr>
        <td>${record.name}</td>
        <td>${record.date}</td>
        <td>${record.status}</td>
        <td>
          <button class="action-btn delete-btn" onclick="deleteRecord(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  summaryText.textContent = `Total Records: ${records.length} | Present: ${presentCount} | Absent: ${absentCount}`;
}

// Save New Attendance
attendanceForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const date = document.getElementById("attendanceDate").value;
  const status = document.getElementById("attendanceStatus").value;

  if (!name || !date || !status) {
    alert("Please fill all fields!");
    return;
  }

  attendanceRecords.push({ name, date, status });
  localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));

  attendanceForm.reset();
  renderAttendance();
});

// Delete Record
function deleteRecord(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    attendanceRecords.splice(index, 1);
    localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
    renderAttendance();
    
    
  }
}

// Filter by Month
function filterByMonth() {
  const selectedMonth = filterMonth.value;
  if (!selectedMonth) {
    renderAttendance();
    return;
  }

  const filtered = attendanceRecords.filter(rec => rec.date.startsWith(selectedMonth));
  renderAttendance(filtered);
}

// Export to CSV
function exportAttendance() {
  if (attendanceRecords.length === 0) {
    alert("No attendance data to export!");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Name,Date,Status\n";
  attendanceRecords.forEach(r => {
    csvContent += `${r.name},${r.date},${r.status}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "attendance_records.csv";
  link.click();
}

// Initial Render
renderAttendance();
