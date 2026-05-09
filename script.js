const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const count = document.getElementById('count');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span>${task.text}</span>
      <button class="delete-btn">Hapus</button>
    `;

    // Checkbox
    li.querySelector('input').addEventListener('change', () => {
      tasks[index].completed = !tasks[index].completed;
      saveAndRender();
    });

    // Delete button
    li.querySelector('.delete-btn').addEventListener('click', () => {
      tasks.splice(index, 1);
      saveAndRender();
    });

    taskList.appendChild(li);
  });
  count.textContent = tasks.length;
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text !== '') {
    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveAndRender();
  }
});

// Enter key support
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

// Render pertama kali
renderTasks();