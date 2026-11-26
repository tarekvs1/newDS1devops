
// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

// Application data
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save tasks in LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update dashboard statistics
function updateStatistics() {

    totalTasks.textContent = tasks.length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;
}

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");
        taskElement.className = "task-item";

        // Task information
        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        // Task title
        const title = document.createElement("span");
        title.className = "task-title";

        if (task.completed) {
            title.classList.add("completed");
        }

        title.textContent = task.title;

        // Priority
        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;
        priority.textContent = task.priority;

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        // Assemble task
        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(title);
        taskInfo.appendChild(priority);

        taskElement.appendChild(taskInfo);
        taskElement.appendChild(deleteButton);

        taskList.appendChild(taskElement);
    });

    updateStatistics();
}

// Add a new task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";
    priorityInput.value = "Medium";

    displayTasks();
});

// Complete or uncomplete a task
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

// Delete a task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

// Filter tasks
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();
    });
});

// Initial application loading
displayTasks();
