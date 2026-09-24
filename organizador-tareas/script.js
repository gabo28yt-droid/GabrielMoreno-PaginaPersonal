const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const count = document.querySelector('#task-count');
const emptyMessage = document.querySelector('#empty-message');
const clearCompletedButton = document.querySelector('#clear-completed');

let tasks = JSON.parse(localStorage.getItem('organizador-tareas') || '[]');

function saveTasks() {
  localStorage.setItem('organizador-tareas', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';
  const pending = tasks.filter((task) => !task.completed).length;
  count.textContent = `${pending} ${pending === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
  emptyMessage.hidden = tasks.length > 0;

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;
    item.innerHTML = `
      <label>
        <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Marcar tarea como completada">
        <span class="task-text"></span>
      </label>
      <button class="delete-button" type="button" aria-label="Eliminar tarea">Eliminar</button>
    `;

    item.querySelector('.task-text').textContent = task.text;
    item.querySelector('input').addEventListener('change', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });
    item.querySelector('.delete-button').addEventListener('click', () => {
      tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
      saveTasks();
      renderTasks();
    });
    list.appendChild(item);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text, completed: false });
  saveTasks();
  renderTasks();
  form.reset();
  input.focus();
});

clearCompletedButton.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
