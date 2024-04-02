document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.querySelector('.add-task-btn');

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.innerHTML = `
                <input type="checkbox">
                <span>${taskText}</span>
                <input type="text" class="edit-input" style="display: none;">
                <button class="btn edit-btn">Edit</button>
                <button class="btn delete-btn">Delete</button>
            `;
            taskList.appendChild(taskItem);
            taskInput.value = '';
            saveTasks();
        }
    }

    function editTask(taskItem) {
        const span = taskItem.querySelector('span');
        const editInput = taskItem.querySelector('.edit-input');
        const editBtn = taskItem.querySelector('.edit-btn');

        span.style.display = 'none';
        editInput.style.display = 'inline';
        editInput.value = span.textContent;
        editInput.focus();

        editBtn.textContent = 'Save';
        editBtn.classList.add('save-btn');
        editBtn.classList.remove('edit-btn');
    }

    function saveTaskChanges(taskItem) {
        const span = taskItem.querySelector('span');
        const editInput = taskItem.querySelector('.edit-input');
        const saveBtn = taskItem.querySelector('.save-btn');

        span.textContent = editInput.value;
        span.style.display = 'inline';
        editInput.style.display = 'none';

        saveBtn.textContent = 'Edit';
        saveBtn.classList.add('edit-btn');
        saveBtn.classList.remove('save-btn');

        saveTasks();
    }

    function deleteTask(taskItem) {
        taskItem.remove();
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('.task-item').forEach(taskItem => {
            const taskText = taskItem.querySelector('span').textContent;
            const taskStatus = taskItem.querySelector('input[type="checkbox"]').checked;
            tasks.push({ text: taskText, completed: taskStatus });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <input type="text" class="edit-input" style="display: none;">
                <button class="btn edit-btn">Edit</button>
                <button class="btn delete-btn">Delete</button>
            `;
            taskList.appendChild(taskItem);
        });
    }

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', function (event) {
        const taskItem = event.target.closest('.task-item');
        if (!taskItem) return;

        if (event.target.classList.contains('edit-btn')) {
            editTask(taskItem);
        } else if (event.target.classList.contains('save-btn')) {
            saveTaskChanges(taskItem);
        } else if (event.target.classList.contains('delete-btn')) {
            deleteTask(taskItem);
        } else if (event.target.type === 'checkbox') {
            saveTasks();
        }
    });

    loadTasks();
});
