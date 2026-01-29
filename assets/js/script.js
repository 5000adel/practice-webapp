const completedTaskList = document.getElementById("completed-task-list");
const unCompletedTaskList = document.getElementById("uncompleted-task-list");
const progressBar = document.getElementById("progress-bar");
const newTaskInput = document.getElementById("new-task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const helpBtn = document.getElementById("help-btn");
const helpPopup = document.getElementById("help-popup");
const jsonFeed = document.getElementById("jsonFeed");
const jsonDisplay = document.getElementById("json-display");
const jsonInfo = document.getElementById("json-info");

let todos = [];

fetch("http://localhost:3000/todos/")
    .then(res => res.json())
    .then(data => {
        todos = data;
        renderLists();
    })
    .catch(error => {
        completedTaskList.innerHTML = "<li>Failed to load tasks</li>";
        console.error(error);
    });

function renderLists() {
    unCompletedTaskList.innerHTML = "";
    completedTaskList.innerHTML = "";
    renderUncompletedTasks(todos);
    renderCompletedTasks(todos);
    updateProgress(todos);
    toggleEmptyMessage();
}


function renderCompletedTasks(todos) {
    completedTaskList.innerHTML = "";
    todos.forEach(task => {

        // Completed Tasks
        if (task.completed) {
            const li = document.createElement("li");

            const taskText = document.createElement("span");
            taskText.textContent = task.todo;

            // Undo Button
            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "Undo";
            toggleBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                fetch(`http://localhost:3000/todos/${task.id}`,{
                    method: "PATCH",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        completed:false
                    })
                })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to update task");
                    task.completed = false;
                    renderLists();
                    console.log(`Changed task to unfinished:\n"${JSON.stringify(task, null, 2)}"`);
                })
                .catch(err=>console.error(err));
                
            });

            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";

            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                console.log(`Attempting to delete task:\n"${JSON.stringify(task, null, 2)}"`);
                
                fetch(`http://localhost:3000/todos/${task.id}`, { 
                    method: "DELETE" 
                }).then(res => {
                    if (!res.ok) throw new Error("Failed to delete task");
                    todos = todos.filter(t => t.id !== task.id);
                    console.log("Task deleted")
                    li.style.display = 'none';
                    fetchTodosAndRender();
                })  
            })
            
            li.addEventListener("click",() => {
                li.classList.toggle("expanded");
            })

            li.style.backgroundColor = "#d8d8d8";
            li.style.color = "#6a6a6a";
            
            li.appendChild(taskText);
            li.appendChild(toggleBtn);
            li.appendChild(deleteBtn);
            
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
            
            // Done button
            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "Done";
            toggleBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                fetch(`http://localhost:3000/todos/${task.id}`,{
                    method: "PATCH",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        completed:true
                    })
                })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to update task");
                    task.completed = true;
                    renderLists();
                    console.log(`Changed task to finished:\n"${JSON.stringify(task, null, 2)}"`);
                })
                .catch(err=>console.error(err));
                
            });
            
            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                console.log(`Attempting to delete task:\n"${JSON.stringify(task, null, 2)}"`);
                fetch(`http://localhost:3000/todos/${task.id}`, { 
                    method: "DELETE" 
                }).then(res => {
                    if (!res.ok) throw new Error("Failed to delete task");
                    todos = todos.filter(t => t.id !== task.id);
                    console.log("Task deleted")
                    li.style.display = 'none';
                    fetchTodosAndRender();
                })
                
            })
            
            li.addEventListener("click",() => {
                li.classList.toggle("expanded");
            })

            li.appendChild(taskText);
            li.appendChild(toggleBtn);
            li.appendChild(deleteBtn);
            
            unCompletedTaskList.appendChild(li);
        }
    });
}

function updateProgress(todos) {
    const completed = todos.filter(t => t.completed).length;
    const total = todos.length;
    const percentage = (completed / total) * 100;
    progressBar.style.width = percentage + "%";

    const counter = document.getElementById("progress-counter");
    counter.textContent = `${completed} / ${total} tasks completed`;
}


function toggleEmptyMessage(){
    document.getElementById("empty-uncompleted").style.display = 
        todos.some(t => !t.completed) ? "none":"block";

    document.getElementById("empty-completed").style.display = 
        todos.some(t => t.completed) ? "none":"block";
}

// New Task Functionality
addTaskBtn.addEventListener("click", () =>{
    const taskText = newTaskInput.value.trim();
    if(!taskText) return;

    fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            todo : taskText,
            completed: false
        })
    })
    .then(res => {
        if(!res.ok) throw new Error("failed to add task");
        return res.json();
    })
    .then(newTask => {
        todos.push(newTask);
        renderLists();
        newTaskInput.value = "";
    })
    .catch(err => console.error(err));
});

//Help Popup
helpBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    helpPopup.classList.toggle("show");
});
document.addEventListener("click", (e) => {
    if(!helpPopup.contains(e.target) && e.target !== helpBtn){
        helpPopup.classList.remove("show");
    }
});

function updateJsonFeed() {
    fetch("http://localhost:3000/todos")
    .then(res => res.json())
    .then(data =>{
        jsonDisplay.textContent = JSON.stringify(data,null,2);
        jsonInfo.textContent =  "Fetching JSON data from http://localhost:3000/todos ";
        jsonInfoBlink("Fetching JSON data from http://localhost:3000/todos ");
    })
    .catch(err => {
        jsonDisplay.textContent = "Error loading JSON:\n" + err;
        jsonInfo.textContent = "Error loading JSON server"  
    });
}

function fetchTodosAndRender(){
    fetch("http://localhost:3000/todos")
    .then(res => res.json())
    .then(data => {
        todos=data;
        renderLists();
    })
}

function jsonInfoBlink(string) {
    let count=0;
    const maxDots=3;
    const interval = setInterval(() => {
        count = (count+1) % (maxDots+1);
        jsonInfo.textContent = string + ".".repeat(count);
    },500);
}
updateJsonFeed();
setInterval(updateJsonFeed, 2000);
