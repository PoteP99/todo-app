const todoInput = document.getElementById("todo-input");
const addButton = document.querySelector("#add-button");
const todoList = document.querySelector("#todo-list");
const todoContainer = document.querySelector("#todo-container");
const indicator = document.getElementById("drop-indicator");

addButton.addEventListener("click", function (e) {
  e.preventDefault();
  addTodo();
});

let allTodos = [];

let dragState = {
  id: null,
  position: "",
  target: null,
};

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length >= 1) {
    // Adding Todo //
    const todoObject = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Unique time-based ID
      text: todoText,
      completed: false,
      schedule: "",
      order: allTodos.length,
    };
    allTodos.push(todoObject);
    renderTodo();
    todoInput.value = "";
  }
}

function deleteTodo(id, todoLI) {
  todoLI.remove();
  allTodos = allTodos.filter((todo) => todo.id !== id);
  allTodos = updateTodos(allTodos);
  renderTodo();
}

function updateTodos(todoArray) {
  let sortedTodos = [...todoArray].sort((a, b) => a.order - b.order); // Sorting
  for (let i = 0; i < sortedTodos.length; i++) {
    // Re-Order incase of deletion
    sortedTodos[i].order = i;
  }
  return sortedTodos;
}

function renderTodo() {
  todoList.innerHTML = ""; // Clear List

  for (const todoObject of allTodos) {
    const todoLI = document.createElement("li");
    todoLI.className = `todo ${todoObject.completed ? "completed" : ""}`;
    todoLI.id = todoObject.id;
    todoLI.draggable = true;
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoObject.id}"/>
        <label for="${todoObject.id}" class="drag-indicator">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/></svg>
        </label>
        <label for="${todoObject.id}" class="custom-checkbox">
          <svg
            fill="var(--card-bg)"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1f1f1f"
          >
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        </label>
        <label for="${todoObject.id}" class="todo-text">${todoObject.text}</label>
        <input type="datetime-local" id="${todoObject.id}" class="schedule-input" style="opacity: 0"/>
        <button for="${todoObject.id}" class="schedule-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1f1f1f"
          >
            <path
              d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"
            />
          </svg>
        </button>
        <button for="${todoObject.id}" class="delete-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1f1f1f"
          >
            <path
              d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
            />
          </svg>
        </button>
    `;
    todoList.append(todoLI);

    // Scheduling Event //
    const scheduleInput = todoLI.querySelector(".schedule-input");
    const scheduleButton = todoLI.querySelector(".schedule-button");

    scheduleInput.value = todoObject.schedule;

    if (todoObject.schedule !== "") {
      scheduleInput.style.opacity = 1;
    }

    scheduleButton.addEventListener("click", () => {
      scheduleInput.showPicker();
    });

    scheduleInput.addEventListener("change", () => {
      if (scheduleInput.value !== "") {
        scheduleInput.style.opacity = 1;
        todoObject.schedule = scheduleInput.value;
      } else {
        scheduleInput.style.opacity = 0;
      }
    });

    // Completion Event //
    const customCheckbox = todoLI.querySelector(".custom-checkbox");
    customCheckbox.addEventListener("click", () => {
      todoObject.completed = !todoObject.completed;
      renderTodo();
    });

    // Delete Event //
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.onclick = () => {
      deleteTodo(todoObject.id, todoLI);
    };

    // Dragging Event //

    todoLI.addEventListener("dragstart", () => {
      dragState.id = todoObject.id;
      todoLI.classList.add("dragging");
      indicator.style.display = "block";
    });

    todoLI.addEventListener("dragover", (e) => {
      e.preventDefault();

      const mouseY = e.clientY;
      dragState.target = e.target.closest(".todo");
      const targetRect = dragState.target.getBoundingClientRect();
      const middleY = targetRect.top + targetRect.height / 2;
      const containerRect = todoContainer.getBoundingClientRect();

      if (mouseY < middleY) {
        dragState.position = "before";
        /*
        dragState.target.classList.add("drag-before");
        dragState.target.classList.remove("drag-after");
        */
        indicator.style.top = targetRect.top - containerRect.top + "px";
      } else {
        dragState.position = "after";
        /*
        dragState.target.classList.add("drag-after");
        dragState.target.classList.remove("drag-before");
        */
        indicator.style.top = targetRect.bottom - containerRect.top + "px";
      }
    });

    todoLI.addEventListener("dragleave", (e) => {
      e.preventDefault();

      if (dragState.target) {
        dragState.target.classList.remove("drag-before");
        dragState.target.classList.remove("drag-after");
      }
    });

    todoLI.addEventListener("drop", (e) => {
      const dropTarget = e.target.closest(".todo");
      if (!dropTarget) {
        return;
      }
      const targetId = dropTarget.id;
      const reorder = [...allTodos];

      if (dragState.id !== targetId && targetId !== null) {
        const draggedTodo = allTodos.find((todo) => todo.id === dragState.id);
        // const targetTodo = allTodos.find((todo) => todo.id === targetId);
        const draggedIndex = allTodos.findIndex(
          (todo) => todo.id === dragState.id
        );
        let targetIndex = allTodos.findIndex((todo) => todo.id === targetId);

        const [dragged] = reorder.splice(draggedIndex, 1);

        if (draggedIndex < targetIndex) {
          targetIndex--;
        }

        if (dragState.position === "before") {
          reorder.splice(targetIndex, 0, draggedTodo);
        } else {
          reorder.splice(targetIndex + 1, 0, draggedTodo);
        }
      }

      for (let i = 0; i < reorder.length; i++) {
        reorder[i].order = i;
      }

      allTodos = updateTodos(reorder);
      renderTodo(allTodos);
    });

    todoLI.addEventListener("dragend", () => {
      dragState.id = null;
      todoLI.classList.remove("dragging");
      indicator.style.display = "none";

      if (dragState.target) {
        dragState.target.classList.remove("drag-before");
        dragState.target.classList.remove("drag-after");
      }
    });
  }
}
