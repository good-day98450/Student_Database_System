// fee_script.js
let fees = JSON.parse(localStorage.getItem("fees")) || [];

const feeForm = document.getElementById("feeForm");
const feeTableBody = document.querySelector("#feeTable tbody");
const searchBox = document.getElementById("searchBox");
const filterStatus = document.getElementById("filterStatus");
const reportCard = document.getElementById("reportCard");
const reportContent = document.getElementById("reportContent");
const generateReportBtn = document.getElementById("generateReport");

// UTIL: save
function saveFees(){
  localStorage.setItem("fees", JSON.stringify(fees));
}

// UTIL: format date (YYYY-MM-DD -> DD MMM YYYY)
function formatDate(iso){
  if(!iso) return "-";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { day:'2-digit', month:'short', year:'numeric' });
}

// Render table with optional filter text/status
function renderTable(){
  const filterText = searchBox.value.trim().toLowerCase();
  const statusFilter = filterStatus.value; // all / paid / pending

  feeTableBody.innerHTML = "";

  const filtered = fees.filter((f) => {
    const matchText = (f.studentName + " " + f.studentClass).toLowerCase().includes(filterText);
    const matchStatus = (statusFilter === "all") ? true : f.status === statusFilter;
    return matchText && matchStatus;
  });

  if(filtered.length === 0){
    feeTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#666;padding:14px">No records found</td></tr>`;
    return;
  }

  filtered.forEach((f, idx) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHtml(f.studentName)}</td>
      <td>${escapeHtml(f.studentClass)}</td>
      <td>${formatDate(f.dueDate)}</td>
      <td>₹ ${Number(f.amount).toFixed(2)}</td>
      <td><span class="status-badge ${f.status === 'paid' ? 'paid' : 'pending'}">${f.status.toUpperCase()}</span></td>
      <td>
        <button class="action-btn edit" onclick="editRecord(${idx})">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord(${idx})">Delete</button>
        <button class="action-btn pay" onclick="mockPay(${idx})">${f.status==='paid' ? 'Refund' : 'Pay'}</button>
        <button class="action-btn toggle" onclick="toggleStatus(${idx})">${f.status==='paid' ? 'Mark Pending' : 'Mark Paid'}</button>
      </td>
    `;
    feeTableBody.appendChild(tr);
  });
}

// Escape to avoid HTML injection in demo
function escapeHtml(text){
  return text
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// Add / Update record
feeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentName = document.getElementById("studentName").value.trim();
  const studentClass = document.getElementById("studentClass").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const status = document.getElementById("status").value;
  const editIndex = document.getElementById("editIndex").value;

  if(!studentName || !studentClass || !dueDate || isNaN(amount)){
    alert("Please fill all fields correctly.");
    return;
  }

  const record = { studentName, studentClass, dueDate, amount: Number(amount), status };

  if(editIndex){
    fees[editIndex] = record;
    document.getElementById("editIndex").value = "";
  } else {
    fees.push(record);
  }

  saveFees();
  feeForm.reset();
  renderTable();
});

// Edit record: populate form
function editRecord(index){
  const r = fees[index];
  document.getElementById("studentName").value = r.studentName;
  document.getElementById("studentClass").value = r.studentClass;
  document.getElementById("dueDate").value = r.dueDate;
  document.getElementById("amount").value = r.amount;
  document.getElementById("status").value = r.status;
  document.getElementById("editIndex").value = index;
  window.scrollTo({top:0, behavior:'smooth'});
}

// Delete record
function deleteRecord(index){
  if(confirm("Delete this fee record?")){
    fees.splice(index,1);
    saveFees();
    renderTable();
  }
}

// Toggle status (paid <-> pending)
function toggleStatus(index){
  fees[index].status = fees[index].status === 'paid' ? 'pending' : 'paid';
  saveFees();
  renderTable();
}

// Mock payment integration - simulates success/failure
function mockPay(index){
  const rec = fees[index];
  if(rec.status === 'paid'){
    if(!confirm("This fee is marked PAID. Simulate refund and mark as PENDING?")) return;
    rec.status = 'pending';
    saveFees();
    renderTable();
    alert("Mock refund complete — status set to PENDING.");
    return;
  }

  // Simulate payment flow
  if(!confirm(`Proceed to simulate online payment of ₹${rec.amount.toFixed(2)} for ${rec.studentName}?`)) return;

  // simple simulated delay
  const previous = document.querySelectorAll(".action-btn.pay")[index];
  previous && (previous.textContent = "Processing...");
  setTimeout(() => {
    rec.status = 'paid';
    saveFees();
    renderTable();
    alert("Mock payment successful — status set to PAID.");
  }, 800);
}

// Generate fee report (totals)
function generateReport(){
  if(fees.length === 0){
    alert("No fee records to report.");
    return;
  }
  const total = fees.reduce((s,r)=> s + Number(r.amount), 0);
  const paidTotal = fees.filter(r=> r.status==='paid').reduce((s,r)=> s + Number(r.amount),0);
  const pendingTotal = total - paidTotal;
  const pendingCount = fees.filter(r=> r.status==='pending').length;
  const paidCount = fees.filter(r=> r.status==='paid').length;

  let html = `
    <p><b>Total Records:</b> ${fees.length}</p>
    <p><b>Total Collected:</b> ₹ ${paidTotal.toFixed(2)} (${paidCount} records)</p>
    <p><b>Total Pending:</b> ₹ ${pendingTotal.toFixed(2)} (${pendingCount} records)</p>
    <hr />
    <h3>Pending List</h3>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:#f0f4ff"><th>Student</th><th>Class</th><th>Due</th><th>Amount</th></tr></thead>
      <tbody>
      ${fees.filter(r=> r.status==='pending').map(r=> `<tr><td>${escapeHtml(r.studentName)}</td><td>${escapeHtml(r.studentClass)}</td><td>${formatDate(r.dueDate)}</td><td>₹ ${r.amount.toFixed(2)}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
  reportContent.innerHTML = html;
  reportCard.style.display = "block";
  reportCard.scrollIntoView({behavior:'smooth'});
}

// Search & filter events
searchBox.addEventListener("input", renderTable);
filterStatus.addEventListener("change", renderTable);
generateReportBtn.addEventListener("click", generateReport);

// initialize demo data if empty (optional demo)
if(fees.length === 0){
  // Uncomment the block below to auto-seed demo data on first run
  /*
  fees = [
    { studentName:"Aarav Sharma", studentClass:"BCA 1st", dueDate:"2025-08-15", amount:25000, status:"pending" },
    { studentName:"Meera Singh", studentClass:"B.Tech 2nd", dueDate:"2025-07-01", amount:30000, status:"paid" },
    { studentName:"Rohit Kumar", studentClass:"MCA 1st", dueDate:"2025-09-10", amount:28000, status:"pending" }
  ];
  saveFees();
  */
}

renderTable();
