const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

window.onload = () => {
  const savedDark = localStorage.getItem("darkMode");
  if (savedDark === "on") {
    document.body.classList.add("dark");
  }

  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => createTaskElement(task.text, task.completed));
};

function addTask() {
  const taskText = input.value.trim();
  if (taskText === "") return;

  createTaskElement(taskText, false);
  saveTask(taskText, false);
  input.value = "";
}

function createTaskElement(text, completed) {
  const li = document.createElement("li");
  li.setAttribute("draggable", "true");

  li.addEventListener("dragstart", dragStart);
  li.addEventListener("dragover", dragOver);
  li.addEventListener("drop", drop);

  const checkmark = document.createElement("span");
  checkmark.textContent = "✅";
  checkmark.classList.add("checkmark");
  checkmark.style.visibility = completed ? "visible" : "hidden";

  const span = document.createElement("span");
  span.textContent = text;
  span.classList.add("task-text");
  if (completed) span.classList.add("completed");

  span.onclick = () => {
    span.classList.toggle("completed");
    checkmark.style.visibility = span.classList.contains("completed") ? "visible" : "hidden";
    updateTask(text, span.classList.contains("completed"));
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.onclick = () => {
    li.remove();
    deleteTask(text);
  };

  li.appendChild(checkmark);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  list.appendChild(li);
}


input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

function filterTasks(filter) {
  const listItems = document.querySelectorAll("#taskList li");
  listItems.forEach(li => {
    const task = li.querySelector(".task-text");
    const isCompleted = task.classList.contains("completed");

    if (
      filter === "all" ||
      (filter === "completed" && isCompleted) ||
      (filter === "active" && !isCompleted)
    ) {
      li.style.display = "flex";
    } else {
      li.style.display = "none";
    }
  });
}

document.getElementById("darkModeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark ? "on" : "off");
};

function saveTask(text, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(text, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task =>
    task.text === text ? { ...task, completed } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let draggedItem = null;

function dragStart(e) {
  draggedItem = this;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (draggedItem !== this) {
    const list = this.parentNode;
    const items = Array.from(list.children);
    const draggedIndex = items.indexOf(draggedItem);
    const droppedIndex = items.indexOf(this);

    if (draggedIndex < droppedIndex) {
      list.insertBefore(draggedItem, this.nextSibling);
    } else {
      list.insertBefore(draggedItem, this);
    }

    updateOrderInStorage();
  }
}

function updateOrderInStorage() {
  const tasks = [];
  const items = document.querySelectorAll("#taskList li");
  items.forEach(li => {
    const text = li.querySelector(".task-text").textContent;
    const completed = li.querySelector(".task-text").classList.contains("completed");
    tasks.push({ text, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
