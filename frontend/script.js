const API_URL = "http://localhost:8080/tasks";

async function loadTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();

  const taskList = document.getElementById("task-list");

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const item = document.createElement("li");

    const title = document.createElement("span");
    title.textContent = task.title;

    if (task.completed) {
      title.style.textDecoration = "line-through";
    }

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";

    completeButton.addEventListener("click", async () => {
      await fetch(`${API_URL}/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: true
        })
      });

      loadTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", async () => {
      await fetch(`${API_URL}/${task._id}`, {
        method: "DELETE"
      });

      loadTasks();
    });

    item.appendChild(title);
    item.appendChild(completeButton);
    item.appendChild(deleteButton);

    taskList.appendChild(item);
  });
}

async function addTask() {
  const input = document.getElementById("task-input");

  const title = input.value;

  if (!title) {
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title
    })
  });

  input.value = "";

  loadTasks();
}

document
  .getElementById("add-btn")
  .addEventListener("click", addTask);

loadTasks();