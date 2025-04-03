// script.js
class TodoApp {
    constructor() {
      this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      this.darkMode = localStorage.getItem('darkMode') === 'true';
      this.init();
    }
  
    init() {
      this.renderCalendar();
      this.renderTasks();
      this.updateProgress();
      this.toggleDarkMode(this.darkMode);
      this.addEventListeners();
    }
  
    addEventListeners() {
      document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.addTask();
      });
  
      document.getElementById('filterDate').addEventListener('change', (e) => {
        this.filterTasksByDate(e.target.value);
      });
  
      document.querySelector('.dark-mode-btn').addEventListener('click', () => {
        this.toggleDarkMode();
      });
    }
  
    addTask() {
      const taskInput = document.getElementById('taskInput');
      const priority = document.getElementById('prioritySelect').value;
      const date = document.getElementById('taskDate').value;
  
      if (taskInput.value.trim()) {
        this.tasks.push({
          id: Date.now(),
          text: taskInput.value.trim(),
          priority,
          date,
          completed: false,
          createdAt: new Date().toISOString()
        });
  
        taskInput.value = '';
        this.saveTasks();
        this.renderTasks();
        this.updateProgress();
      }
    }
  
    renderTasks(filterDate = '') {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
  
      const filteredTasks = filterDate 
        ? this.tasks.filter(task => task.date === filterDate)
        : this.tasks;
  
      filteredTasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
          <div class="task-content">
            <div class="priority-indicator priority-${task.priority}"></div>
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
              onchange="todoApp.toggleTask(${task.id})">
            <span>${task.text}</span>
            <span class="task-date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18"/>
              </svg>
              ${new Date(task.date).toLocaleDateString()}
            </span>
          </div>
          <div class="task-actions">
            <button class="btn btn-icon" onclick="todoApp.editTask(${task.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
            </button>
            <button class="btn btn-icon" onclick="todoApp.deleteTask(${task.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        `;
        taskList.appendChild(taskElement);
      });
    }
  
    toggleTask(id) {
      this.tasks = this.tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
      );
      this.saveTasks();
      this.updateProgress();
    }
  
    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.saveTasks();
      this.renderTasks();
      this.updateProgress();
    }
  
    editTask(id) {
      const task = this.tasks.find(task => task.id === id);
      const newText = prompt('Edit task:', task.text);
      if (newText) {
        task.text = newText.trim();
        this.saveTasks();
        this.renderTasks();
      }
    }
  
    filterTasksByDate(date) {
      this.renderTasks(date);
    }
  
    updateProgress() {
      const completed = this.tasks.filter(task => task.completed).length;
      const progress = (completed / this.tasks.length) * 100 || 0;
      document.getElementById('progressFill').style.width = `${progress}%`;
    }
  
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
    }
  
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  
    renderCalendar() {
      const calendarGrid = document.getElementById('calendarGrid');
      const date = new Date();
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      
      calendarGrid.innerHTML = '';
      
      for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        dayElement.onclick = () => this.filterTasksByDate(
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        );
        calendarGrid.appendChild(dayElement);
      }
    }
  }
  
  // Initialize app
  const todoApp = new TodoApp();