/* =========================================================
   COS 106 TERM PROJECT — Michael George
   main.js
   Covers: event handling, DOM manipulation, form validation,
   dynamic content updates, arrays/functions, interactive
   task management (Academic Planner).
   ========================================================= */

/* ---------- NAVIGATION ---------- */

function initNav() {
  // Highlight the current page's tab based on the URL
  const links = document.querySelectorAll('nav.tabbar a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('nav.tabbar ul');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      const isOpen = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu automatically once a link is chosen (mobile UX)
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }
}

/* ---------- ACADEMIC PLANNER ---------- */

const STORAGE_KEY = 'cos106_planner_tasks';
let tasks = [];

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  tasks = saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  if (taskText === '') {
    alert('Please enter a task before adding it.');
    taskInput.focus();
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  taskInput.value = '';
  taskInput.focus();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  const stats = document.getElementById('plannerStats');
  if (!taskList) return;

  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="task-empty">No tasks yet — add your first academic task above.</li>';
  } else {
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const completeBtn = document.createElement('button');
      completeBtn.className = 'complete-btn';
      completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
      completeBtn.addEventListener('click', () => toggleTask(task.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      actions.appendChild(completeBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(span);
      li.appendChild(actions);
      taskList.appendChild(li);
    });
  }

  if (stats) {
    const completedCount = tasks.filter(t => t.completed).length;
    stats.innerHTML = `<strong>${completedCount}</strong> of <strong>${tasks.length}</strong> tasks completed`;
  }
}

function initPlanner() {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;

  loadTasks();
  renderTasks();

  const addBtn = document.getElementById('addTaskBtn');
  const taskInput = document.getElementById('taskInput');

  if (addBtn) addBtn.addEventListener('click', addTask);
  if (taskInput) {
    taskInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') addTask();
    });
  }
}

/* ---------- CONTACT FORM VALIDATION ---------- */

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhone(phone) {
  const digitsOnly = phone.replace(/[\s\-()]/g, '');
  return /^[0-9]+$/.test(digitsOnly);
}

function clearFieldError(input, errorEl) {
  input.classList.remove('error');
  errorEl.textContent = '';
}

function setFieldError(input, errorEl, message) {
  input.classList.add('error');
  errorEl.textContent = message;
}

function validateForm(event) {
  event.preventDefault();
  let isValid = true;

  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message')
  };

  const errors = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    message: document.getElementById('messageError')
  };

  Object.keys(fields).forEach(key => clearFieldError(fields[key], errors[key]));

  if (fields.name.value.trim() === '') {
    setFieldError(fields.name, errors.name, 'Name is required.');
    isValid = false;
  }

  if (fields.email.value.trim() === '') {
    setFieldError(fields.email, errors.email, 'Email address is required.');
    isValid = false;
  } else if (!isValidEmail(fields.email.value.trim())) {
    setFieldError(fields.email, errors.email, 'Enter a valid email address, e.g. name@example.com.');
    isValid = false;
  }

  if (fields.phone.value.trim() === '') {
    setFieldError(fields.phone, errors.phone, 'Phone number is required.');
    isValid = false;
  } else if (!isValidPhone(fields.phone.value.trim())) {
    setFieldError(fields.phone, errors.phone, 'Phone number should contain digits only.');
    isValid = false;
  }

  if (fields.message.value.trim() === '') {
    setFieldError(fields.message, errors.message, 'Please enter a message.');
    isValid = false;
  }

  const successMessage = document.getElementById('successMessage');

  if (isValid) {
    successMessage.classList.add('show');
    document.getElementById('contactForm').reset();
    setTimeout(() => successMessage.classList.remove('show'), 5000);
  } else {
    successMessage.classList.remove('show');
  }

  return false;
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', validateForm);
}

/* ---------- INIT ---------- */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initPlanner();
  initContactForm();
});      li.className = 'task-item' + (task.completed ? ' completed' : '');

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const completeBtn = document.createElement('button');
      completeBtn.className = 'complete-btn';
      completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
      completeBtn.addEventListener('click', () => toggleTask(task.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      actions.appendChild(completeBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(span);
      li.appendChild(actions);
      taskList.appendChild(li);
    });
  }

  if (stats) {
    const completedCount = tasks.filter(t => t.completed).length;
    stats.innerHTML = `<strong>${completedCount}</strong> of <strong>${tasks.length}</strong> tasks completed`;
  }
}

function initPlanner() {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;

  loadTasks();
  renderTasks();

  const addBtn = document.getElementById('addTaskBtn');
  const taskInput = document.getElementById('taskInput');

  if (addBtn) addBtn.addEventListener('click', addTask);
  if (taskInput) {
    taskInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') addTask();
    });
  }
}

/* ---------- CONTACT FORM VALIDATION ---------- */

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhone(phone) {
  const digitsOnly = phone.replace(/[\s\-()]/g, '');
  return /^[0-9]+$/.test(digitsOnly);
}

function clearFieldError(input, errorEl) {
  input.classList.remove('error');
  errorEl.textContent = '';
}

function setFieldError(input, errorEl, message) {
  input.classList.add('error');
  errorEl.textContent = message;
}

function validateForm(event) {
  event.preventDefault();
  let isValid = true;

  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message')
  };

  const errors = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    message: document.getElementById('messageError')
  };

  Object.keys(fields).forEach(key => clearFieldError(fields[key], errors[key]));

  if (fields.name.value.trim() === '') {
    setFieldError(fields.name, errors.name, 'Name is required.');
    isValid = false;
  }

  if (fields.email.value.trim() === '') {
    setFieldError(fields.email, errors.email, 'Email address is required.');
    isValid = false;
  } else if (!isValidEmail(fields.email.value.trim())) {
    setFieldError(fields.email, errors.email, 'Enter a valid email address, e.g. name@example.com.');
    isValid = false;
  }

  if (fields.phone.value.trim() === '') {
    setFieldError(fields.phone, errors.phone, 'Phone number is required.');
    isValid = false;
  } else if (!isValidPhone(fields.phone.value.trim())) {
    setFieldError(fields.phone, errors.phone, 'Phone number should contain digits only.');
    isValid = false;
  }

  if (fields.message.value.trim() === '') {
    setFieldError(fields.message, errors.message, 'Please enter a message.');
    isValid = false;
  }

  const successMessage = document.getElementById('successMessage');

  if (isValid) {
    successMessage.classList.add('show');
    document.getElementById('contactForm').reset();
    setTimeout(() => successMessage.classList.remove('show'), 5000);
  } else {
    successMessage.classList.remove('show');
  }

  return false;
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', validateForm);
}

/* ---------- INIT ---------- */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initPlanner();
  initContactForm();
});
