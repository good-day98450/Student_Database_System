// Simulated backend data (you can replace with localStorage or server data)
const students = [
  { id: 1, name: "Amit Kumar", course: "BCA", year: "2nd" },
  { id: 2, name: "Sakshi Kumari", course: "BSc", year: "1st" },
  { id: 3, name: "Saisha Sharma", course: "BBA", year: "3rd" },
];

const attendance = [
  { name: "Amit Kumar", totalDays: 200, presentDays: 180 },
  { name: "Sakshi Kumari", totalDays: 180, presentDays: 170 },
  { name: "Saisha Sharma", totalDays: 190, presentDays: 160 },
];

const performance = [
  { name: "Amit Kumar", avgMarks: 85 },
  { name: "Sakshi Kumari", avgMarks: 78 },
  { name: " Saisha Sharma", avgMarks: 65 },
];

const fees = [
  { name: "Amit Kumar", totalFee: 30000, paid: 30000 },
  { name: "Sakshi Kumari", totalFee: 28000, paid: 20000 },
  { name: "Saisha Sharma", totalFee: 35000, paid: 35000 },
];

// 📋 1️⃣ Student List Report
function generateStudentReport() {
  const container = document.getElementById("studentReport");
  container.innerHTML = `
    <table>
      <tr><th>ID</th><th>Name</th><th>Course</th><th>Year</th></tr>
      ${students.map(s => `
        <tr>
          <td>${s.id}</td>
          <td>${s.name}</td>
          <td>${s.course}</td>
          <td>${s.year}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

// 📅 2️⃣ Attendance Report
function generateAttendanceReport() {
  const container = document.getElementById("attendanceReport");
  container.innerHTML = `
    <table>
      <tr><th>Name</th><th>Total Days</th><th>Present Days</th><th>Attendance %</th></tr>
      ${attendance.map(a => `
        <tr>
          <td>${a.name}</td>
          <td>${a.totalDays}</td>
          <td>${a.presentDays}</td>
          <td>${((a.presentDays / a.totalDays) * 100).toFixed(2)}%</td>
        </tr>
      `).join("")}
    </table>
  `;
}

// 🎓 3️⃣ Academic Performance Report
function generatePerformanceReport() {
  const container = document.getElementById("performanceReport");
  container.innerHTML = `
    <table>
      <tr><th>Name</th><th>Average Marks</th><th>Grade</th></tr>
      ${performance.map(p => {
        let grade = p.avgMarks >= 90 ? "A+" : p.avgMarks >= 75 ? "A" : p.avgMarks >= 60 ? "B" : "C";
        return `
          <tr>
            <td>${p.name}</td>
            <td>${p.avgMarks}</td>
            <td>${grade}</td>
          </tr>
        `;
      }).join("")}
    </table>
  `;
}

// 💰 4️⃣ Fee Collection Report
function generateFeeReport() {
  const container = document.getElementById("feeReport");
  container.innerHTML = `
    <table>
      <tr><th>Name</th><th>Total Fee</th><th>Paid</th><th>Status</th></tr>
      ${fees.map(f => {
        const status = f.paid >= f.totalFee ? "✅ Paid" : "❌ Pending";
        return `
          <tr>
            <td>${f.name}</td>
            <td>₹${f.totalFee}</td>
            <td>₹${f.paid}</td>
            <td>${status}</td>
          </tr>
        `;
      }).join("")}
    </table>
  `;
}
