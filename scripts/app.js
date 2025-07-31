const createTaskForm = document.getElementById("create__new--task");
const createTaskButton = document.getElementById("create__task--button");
const createTaskTitile = document.getElementById("title");
const createTaskDescription = document.getElementById("description");
const taskContainer = document.getElementById("wrapper__tasks");
const complitedTasks = document.getElementById("complited__tasks");
const taskComplitedWrapper = document.getElementById("wrapper__completed-tasks");
const complitedMessage = document.getElementById("completed-message");

let taskCounter = document.querySelector(".task__counter")

let tasks = [];
let tasksComplited = [];
let loadTaskData;
let generatedId;
let newTaskCounter = parseInt(taskCounter.innerText) || 0;

// отключение обновление старницы при автоматической отправки формы
createTaskForm.addEventListener("submit", function(event) {
  event.preventDefault();
})

// Функция создания шаблона задачи для выполненных задач
function createCompletedTaskElement(task) {
  let taskTemplateHTML = `
    <div data-id="${task.id}" id="task-${task.id}" class="border border-green-200 bg-green-50 rounded-lg p-4 mb-4 opacity-80">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-medium text-green-800 line-through">${task.title}</h3>
        <div class="wrapper display-flex">
          <button class="delete__button px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-full transition-colors">
            Delete
          </button>
        </div>
      </div>
      <p class="text-sm text-green-700 line-through mb-2">${task.description}</p>
      <div class="flex justify-end">
        <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
      </div>
    </div>
  `;

  taskComplitedWrapper.insertAdjacentHTML("beforeend", taskTemplateHTML);

  if (taskContainer.children.length > 0) {
    complitedTasks.classList.remove("hidden");
    complitedMessage.classList.add("hidden");
  };
  complitedMessage.classList.remove("hidden");

  const taskElement = document.getElementById(`task-${task.id}`);
  const deleteBtn = taskElement.querySelector(".delete__button");

  deleteBtn.addEventListener("click", function () {
    const storedCompleted = JSON.parse(localStorage.getItem("taskComplited")) || [];

    // Фильтруем выполненные задачи
    const updatedCompleted = storedCompleted.filter(t => t.id !== task.id);

    // Обновляем LS
    localStorage.setItem("taskComplited", JSON.stringify(updatedCompleted));

    // Перерисовываем блок выполненных задач
    renderCompletedTasks();
  });
}

// Функция создания шаблона задачи для не выполненных задач
function createTaskElement(task) {
  const message = document.getElementById("message");

  let taskTemplateHTML= `
        <div data-id="${task.id}" id="task-${task.id}" class="border border-primary-200 rounded-lg p-4 mb-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium text-primary-800">${task.title}</h3>
            <div class="wrapper display-flex">
              <button class="done__button px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-full transition-colors">
                Done
              </button>
              <button class="delete__button px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-full transition-colors">
                Delete
              </button>
            </div>
          </div>
          <p class="text-sm text-primary-600 mb-2">${task.description}</p>
          <div class="flex justify-end">
            <span id="task__status" class="text-xs text-primary-500 bg-primary-100 px-2 py-1 rounded">Pending</span>
          </div>
        </div>
    `

  taskContainer.insertAdjacentHTML("beforeend", taskTemplateHTML)
  
  if (taskContainer.children.length !== 0) {
    message.classList.add("hidden");
    taskCounter.classList.remove("hidden");
    // taskCounter.innerText = window.localStorage.getItem("taskCounter");
    taskCounter.innerText = tasks.length;
  } else {
    taskCounter.classList.add("hidden");
    message.classList.remove("hidden");
  }

  const taskElement = document.getElementById(`task-${task.id}`);
  const deleteBtn = taskElement.querySelector(".delete__button");
  const doneBtn = taskElement.querySelector(".done__button");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function() {
      tasks = tasks.filter(t => t.id !== task.id);
      deleteTask();
      saveTask();
      renderTask();
    })
  } else {
    console.error("Кнопка удалить отсутсвует у елемента");
  }

  if (doneBtn) {
    doneBtn.addEventListener("click", function() {
      tasks = tasks.filter(t => t.id !== task.id);
      toggleTaskStatus(task);
      saveTask();
      renderTask();
    })
  } else {
    console.error("Кнопка выполнить задачу не найдена у элемента")
  }
}

// Загрузка задач из localStorage
function loadTask() {
  loadTaskData = window.localStorage.getItem("task");

  if (!loadTaskData) {
    return [];
  }

  return JSON.parse(loadTaskData);
}

// Сохраняет задачи в localStorage
function saveTask() {
  // window.localStorage.setItem("taskCounter", JSON.stringify(newTaskCounter))
  window.localStorage.setItem("task", JSON.stringify(tasks));
}

// Отображает задачи на странице
function renderTask() {
  taskContainer.innerHTML = "";
  const loadedTasks = loadTask();

  loadedTasks.forEach(element => {
    createTaskElement(element);
  });
}

// Добавляет новую задачу
function addTask() {
  createTaskButton.addEventListener("click", function() {
    generatedId = Math.floor(Date.now() + Math.random() * 10000);

    const title = createTaskTitile.value;
    const description = createTaskDescription.value;
    
    const taskData = {
      id: generatedId,
      title: title,
      description: description,
    }

    tasks.push(taskData);
    
    // ++newTaskCounter;

    createTaskElement(taskData);

    saveTask();
  })
}

// Удаляет существующею задачу
function deleteTask() {
  window.localStorage.removeItem("task")
  // --newTaskCounter;
}

// Переключает состояние задачи
function toggleTaskStatus(task) {
  // Парсим существующие выполненные задачи из LS
  const storedCompleted = JSON.parse(localStorage.getItem("taskComplited")) || [];

  // Добавляем новую выполненную задачу
  storedCompleted.push(task);

  // Сохраняем обратно
  localStorage.setItem("taskComplited", JSON.stringify(storedCompleted));

  // Отображаем на странице
  createCompletedTaskElement(task);
}

function renderCompletedTasks() {
  const storedCompleted = JSON.parse(localStorage.getItem("taskComplited")) || [];

  if (storedCompleted.length > 0) {
    complitedTasks.classList.remove("hidden");
    complitedMessage.classList.add("hidden");
  } else {
    complitedMessage.classList.remove("hidden");
  }

  taskComplitedWrapper.innerHTML = "";

  storedCompleted.forEach(task => {
    createCompletedTaskElement(task);
  });
}

addTask();
renderTask();
renderCompletedTasks();
