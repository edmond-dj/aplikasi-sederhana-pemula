const dateInput = document.getElementById('attendanceDate');
const studentNameInput = document.getElementById('studentName');
const addStudentBtn = document.getElementById('addStudentBtn');
const studentList = document.getElementById('studentList');
const summary = document.getElementById('summary');

// Set tanggal hari ini
dateInput.valueAsDate = new Date();

let students = JSON.parse(localStorage.getItem('students')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || {};

function saveData() {
  localStorage.setItem('students', JSON.stringify(students));
  localStorage.setItem('attendance', JSON.stringify(attendance));
}

function renderStudents() {
  studentList.innerHTML = '';
  const currentDate = dateInput.value;

  students.forEach((student, index) => {
    const status = attendance[currentDate]?.[student] || 'alfa';

    const div = document.createElement('div');
    div.className = 'student-item';
    div.innerHTML = `
      <span class="student-name">${student}</span>
      <button class="status-btn hadir ${status === 'hadir' ? 'active' : ''}" data-status="hadir">Hadir</button>
      <button class="status-btn sakit ${status === 'sakit' ? 'active' : ''}" data-status="sakit">Sakit</button>
      <button class="status-btn izin ${status === 'izin' ? 'active' : ''}" data-status="izin">Izin</button>
      <button class="status-btn alfa ${status === 'alfa' ? 'active' : ''}" data-status="alfa">Alfa</button>
      <span class="delete-btn">🗑</span>
    `;

    // Event untuk tombol status
    div.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!attendance[currentDate]) attendance[currentDate] = {};
        attendance[currentDate][student] = btn.dataset.status;
        saveData();
        renderStudents();
        renderSummary();
      });
    });

    // Event hapus siswa
    div.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Hapus siswa ${student}?`)) {
        students.splice(index, 1);
        saveData();
        renderStudents();
        renderSummary();
      }
    });

    studentList.appendChild(div);
  });

  renderSummary();
}

function renderSummary() {
  const currentDate = dateInput.value;
  const todayAttendance = attendance[currentDate] || {};
  
  let hadir = 0, sakit = 0, izin = 0, alfa = 0;
  
  Object.values(todayAttendance).forEach(status => {
    if (status === 'hadir') hadir++;
    else if (status === 'sakit') sakit++;
    else if (status === 'izin') izin++;
    else alfa++;
  });

  summary.innerHTML = `
    <strong>Ringkasan Absensi ${currentDate}:</strong><br>
    Hadir: ${hadir} | Sakit: ${sakit} | Izin: ${izin} | Alfa: ${alfa} 
    | Total: ${students.length}
  `;
}

// Event Tambah Siswa
addStudentBtn.addEventListener('click', () => {
  const name = studentNameInput.value.trim();
  if (name && !students.includes(name)) {
    students.push(name);
    saveData();
    studentNameInput.value = '';
    renderStudents();
  }
});

// Enter key support
studentNameInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addStudentBtn.click();
});

// Ganti tanggal
dateInput.addEventListener('change', renderStudents);

// Render pertama
renderStudents();
