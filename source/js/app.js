let createBtn = document.querySelector(".create");
let cancelBtn = document.querySelector(".cancel");
let closeModal = document.querySelector(".close-modal");
let modalScreen = document.querySelector(".modal-screen");
let openModalBtn = document.querySelector(".open-modal-button");
let input = document.querySelector(".input");
let todosContainer = document.querySelector(".todos-container");
let completedBtn = document.querySelector(".completed");
let sortButtons = document.querySelectorAll(".sort-menu button");
let todos = [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let savedTodos = localStorage.getItem("todos");

  if (savedTodos) {
    todos = JSON.parse(savedTodos);
  }
}

function createTodoElement(todoText, todoId, isComplete = false) {
  let todoElem = document.createElement("article");
  todoElem.classList.add("todo");
  todoElem.dataset.id = todoId;
  todoElem.dataset.complete = isComplete; // اضافه کردن data-complete

  let todoContent = document.createElement("span");
  todoContent.classList.add("todo-title");
  todoContent.textContent = todoText;

  if (isComplete) {
    todoContent.style.textDecoration = "line-through";
    todoContent.style.opacity = "0.6";
  }

  let todoButtons = document.createElement("div");
  todoButtons.classList.add("todo-buttons");

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.textContent = "حذف";
  deleteBtn.addEventListener("click", function () {
    let todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      saveTodos();
    }
    todoElem.remove();
  });

  let statusBtn = document.createElement("button");
  statusBtn.classList.add("status");
  statusBtn.textContent = "وضعیت";
  statusBtn.addEventListener("click", function () {
    let todo = todos.find(t => t.id === todoId);
    if (todo) {
      alert(`وضعیت: ${todo.isComplete ? "کامل شده" : "در حال انجام"}`);
    }
  });

  let completeBtn = document.createElement("button");
  completeBtn.classList.add("complete");
  completeBtn.textContent = "تکمیل";
  completeBtn.addEventListener("click", function () {
    let todo = todos.find(t => t.id === todoId);
    if (todo) {
      todo.isComplete = !todo.isComplete;
      saveTodos();
      
      // به‌روزرسانی data-complete
      todoElem.dataset.complete = todo.isComplete;
      
      if (todo.isComplete) {
        todoContent.style.textDecoration = "line-through";
        todoContent.style.opacity = "0.6";
        completeBtn.textContent = "بازگردانی";
      } else {
        todoContent.style.textDecoration = "none";
        todoContent.style.opacity = "1";
        completeBtn.textContent = "تکمیل";
      }
    }
  });

  if (isComplete) {
    completeBtn.textContent = "بازگردانی";
  }

  todoButtons.append(completeBtn, statusBtn, deleteBtn);
  todoElem.append(todoContent, todoButtons);
  todosContainer.appendChild(todoElem);
}

// تابع فیلتر کردن تسک‌ها
function filterTodos(filterType) {
  let allTodos = document.querySelectorAll(".todo");
  
  allTodos.forEach(function(todo) {
    let isComplete = todo.dataset.complete === "true";
    
    switch(filterType) {
      case "completed":
        // فقط تسک‌های تکمیل شده نمایش داده شوند
        if (isComplete) {
          todo.style.display = "flex"; // یا هر display اصلی
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        // فقط تسک‌های تکمیل نشده نمایش داده شوند
        if (!isComplete) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "default":
      default:
        // همه تسک‌ها نمایش داده شوند
        todo.style.display = "flex";
        break;
    }
  });
}

function closeModalFunc() {
  modalScreen.classList.add("hidden");
}

function openModalFunc() {
  modalScreen.classList.remove("hidden");
}

createBtn.addEventListener("click", function () {
  let todoText = input.value;
  if (todoText.trim() !== "") {
    let newTodo = {
      id: Date.now(),
      title: todoText,
      isComplete: false
    };
    
    todos.push(newTodo);
    saveTodos();
    createTodoElement(todoText, newTodo.id, false);
    input.value = "";
  }
  
  closeModalFunc();
});

cancelBtn.addEventListener("click", closeModalFunc);
closeModal.addEventListener("click", closeModalFunc);
openModalBtn.addEventListener("click", openModalFunc);

// اضافه کردن event listener به دکمه‌های فیلتر
sortButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    let filterValue = this.getAttribute("value");
    filterTodos(filterValue);
  });
});

// وقتی صفحه باز شد
getTodos();

// نمایش تودوهای قبلی
todos.forEach(function(todo) {
  createTodoElement(todo.title, todo.id, todo.isComplete);
});