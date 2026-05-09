// script.js - Versi Diperbaiki
const dateInput = document.getElementById('attendanceDate');
const studentNameInput = document.getElementById('studentName');
const addStudentBtn = document.getElementById('addStudentBtn');
const studentList = document.getElementById('studentList');
const summary = document.getElementById('summary');

let students = JSON.parse(localStorage.getItem('students')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || {};

// Set tanggal hari ini
if (!dateInput.value) {
  dateInput.valueAsDate = new Date();
}

function saveData() {
  localStorage.setItem('students', JSON.stringify(students));
  localStorage.setItem('attendance', JSON.stringify(attendance));
}

function renderStudents() {
  studentList.innerHTML = '';
  const currentDate = dateInput.value;

  if (students.length === 0) {
    studentList.innerHTML = '<p style="text-align:center; color:#666; padding:20px;">Belum ada siswa. Tambahkan siswa di atas.</p>';
    renderSummary();
    return;
  }

  students.forEach((student, index) => {
    const currentAttendance = attendance[currentDate] || {};
    const status = currentAttendance[student] || 'alfa';

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

    // Tombol status absensi
    div.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!attendance[currentDate]) attendance[currentDate] = {};
        attendance[currentDate][student] = btn.dataset.status;
        saveData();
        renderStudents();
      });
    });

    // Tombol hapus siswa
    div.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Yakin hapus siswa "${student}"?`)) {
        students.splice(index, 1);
        // Hapus data absensi siswa tersebut
        Object.keys(attendance).forEach(date => {
          delete attendance[date][student];
        });
        saveData();
        renderStudents();
      }
    });

    studentList.appendChild(div);
  });

  renderSummary();
}

function renderSummary() {
  const currentDate = dateInput.value;
  const todayAttendance = attendance[currentDate] || {};
  
  let hadir = 0, sakit = 0, izin = 0, alfa = students.length;

  students.forEach(student => {
    const status = todayAttendance[student];
    if (status === 'hadir') hadir++;
    else if (status === 'sakit') sakit++;
    else if (status === 'izin') izin++;
  });
  alfa = students.length - hadir - sakit - izin;

  summary.innerHTML = `
    <strong>Ringkasan Absensi ${currentDate || 'Hari Ini'}:</strong><br><br>
    ✅ Hadir: <b>${hadir}</b> | 
    🤒 Sakit: <b>${sakit}</b> | 
    📝 Izin: <b>${izin}</b> | 
    ❌ Alfa: <b>${alfa}</b><br>
    <b>Total Siswa: ${students.length}</b>
  `;
}

// === EVENT LISTENER ===
addStudentBtn.addEventListener('click', addStudent);

function addStudent() {
  const name = studentNameInput.value.trim();
  
  if (name === '') {
    alert('Nama siswa tidak boleh kosong!');
    return;
  }
  
  if (students.includes(name)) {
    alert('Siswa dengan nama ini sudah ada!');
    return;
  }

  students.push(name);
  saveData();
  studentNameInput.value = '';
  renderStudents();
}

// Enter key
studentNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addStudent();
});

dateInput.addEventListener('change', renderStudents);

// Render pertama kali
renderStudents();
