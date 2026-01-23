const completedTaskList = document.getElementById("completed-task-list");
const unCompletedTaskList = document.getElementById("uncompleted-task-list");
const progressBar = document.getElementById("progress-bar");
let todos = [];

fetch("https://dummyjson.com/todos")
    .then(response => response.json())
    .then(data => {
        todos = data.todos;
        renderLists();
    })
    .catch(error => {
        completedTaskList.innerHTML = "<li>Failed to load tasks</li>";
        console.error(error);
    });

function renderLists() {
  renderUncompletedTasks(todos);
  renderCompletedTasks(todos);
  updateProgress(todos);
}

function renderCompletedTasks(todos) {
    completedTaskList.innerHTML = "";
    todos.forEach(task => {


        if (task.completed) {
            const li = document.createElement("li");

            const taskText = document.createElement("span");
            taskText.textContent = task.todo;

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "Undo";
            toggleBtn.addEventListener("click", () => {
            task.completed = false;
            renderLists();
            });

            li.style.backgroundColor = "#d8d8d8";
            li.style.color = "#6a6a6a";
            
            li.appendChild(taskText);
            li.appendChild(toggleBtn);
            
            completedTaskList.appendChild(li);
            
        }

    });
}

function renderUncompletedTasks(todos) {
    unCompletedTaskList.innerHTML = "";
    todos.forEach(task => {

        if (!task.completed) {
            const li = document.createElement("li");
        
            const taskText = document.createElement("span");
            taskText.textContent = task.todo;

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "Done";
            toggleBtn.addEventListener("click", () => {
            task.completed = true;
            renderLists();
            });
            
            
            li.appendChild(taskText);
            li.appendChild(toggleBtn);
            
            unCompletedTaskList.appendChild(li);
        }
    });
}

function updateProgress(todos) {
    const completed = todos.filter(t => t.completed).length;
    const percentage = (completed / todos.length) * 100;
    progressBar.style.width = percentage + "%";
}