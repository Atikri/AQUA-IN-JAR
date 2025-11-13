(function() {
  'use strict';

  const STORAGE_KEY = 'aqua-todo-list';
  let todos = [];

  // Load todos from localStorage
  function loadTodos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        todos = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load todos:', e);
      todos = [];
    }
  }

  // Save todos to localStorage
  function saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos:', e);
    }
  }

  // Generate unique ID
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Create todo item element
  function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item checkbox-item' + (todo.completed ? ' completed' : '');
    li.dataset.id = todo.id;

    const checkboxId = 'todo-' + todo.id;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.name = 'todo';
    checkbox.value = 'todo';
    checkbox.classList.add('jelly');
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', todo.text);
    checkbox.addEventListener('change', function() {
      toggleTodo(todo.id);
    });

    const cbx = document.createElement('span');
    cbx.className = 'cbx';
    cbx.setAttribute('tabindex', '0');
    cbx.addEventListener('click', function() {
      checkbox.click();
    });
    cbx.addEventListener('keydown', function(e) {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        checkbox.click();
      }
    });

    const label = document.createElement('label');
    label.className = 'lbl todo-text';
    label.htmlFor = checkboxId;
    label.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete-btn';
    deleteBtn.textContent = '删除';
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      deleteTodo(todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(cbx);
    li.appendChild(label);
    li.appendChild(deleteBtn);

    return li;
  }

  // Render todos
  function renderTodos() {
    const container = document.getElementById('todo-app');
    if (!container) return;

    const list = container.querySelector('.todo-list');
    if (!list) return;

    list.innerHTML = '';

    if (todos.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'todo-empty';
      empty.textContent = '还没有待办事项，添加一个开始吧~';
      list.appendChild(empty);
      return;
    }

    todos.forEach(todo => {
      list.appendChild(createTodoElement(todo));
    });

    updateStats();
  }

  // Update statistics
  function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;

    const statsEl = document.querySelector('.todo-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <span>总计: ${total}</span>
        <span>已完成: ${completed}</span>
        <span>待完成: ${remaining}</span>
      `;
    }
  }

  // Add new todo
  function addTodo(text) {
    if (!text || !text.trim()) return;

    const todo = {
      id: generateId(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    };

    todos.unshift(todo);
    saveTodos();
    renderTodos();
  }

  // Toggle todo completion
  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    }
  }

  // Delete todo
  function deleteTodo(id) {
    if (confirm('确定要删除这个任务吗？')) {
      todos = todos.filter(t => t.id !== id);
      saveTodos();
      renderTodos();
    }
  }

  // Clear completed todos
  function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
      alert('没有已完成的任务');
      return;
    }

    if (confirm(`确定要删除 ${completedCount} 个已完成的任务吗？`)) {
      todos = todos.filter(t => !t.completed);
      saveTodos();
      renderTodos();
    }
  }

  // Initialize app
  function init() {
    const container = document.getElementById('todo-app');
    if (!container) return;

    // Create HTML structure
    container.innerHTML = `
      <div class="todo-header">
        <h2>📝 待办清单</h2>
      </div>
      <div class="todo-input-container">
        <input type="text" class="todo-input" placeholder="输入新的待办事项..." id="todo-input">
        <button class="todo-add-btn" id="todo-add-btn">添加</button>
      </div>
      <div class="todo-stats"></div>
      <ul class="todo-list"></ul>
      <div class="todo-actions">
        <button class="todo-clear-btn" id="todo-clear-btn">清空已完成</button>
      </div>
    `;

    // Load and render todos
    loadTodos();
    renderTodos();

    // Bind events
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('todo-add-btn');
    const clearBtn = document.getElementById('todo-clear-btn');

    function handleAdd() {
      const text = input.value;
      if (text.trim()) {
        addTodo(text);
        input.value = '';
        input.focus();
      }
    }

    addBtn.addEventListener('click', handleAdd);
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleAdd();
      }
    });

    clearBtn.addEventListener('click', clearCompleted);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

