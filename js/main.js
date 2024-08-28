// находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

// вытаскиваем данные из хранилища браузера
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    // отображаем вытащенные данные на странице
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

// добавление задачи
form.addEventListener('submit', addTask);

// удаление задачи
tasksList.addEventListener('click', deleteTask)

//отмечаем задачу как выполненную
tasksList.addEventListener('click', doneTask)

// функции
function addTask(event) {
    // отменяем отправку формы, чтобы страница не перезагружалась, когда мы нажимаем "добавить"
    event.preventDefault();

    // достанем текст задачи из поля ввода
    const taskText = taskInput.value

    // описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // добавляем задачу в массив с задачами
    tasks.push(newTask)

    // сохраняем массив с задачами в localstorage
    saveToLocalStorage();

    renderTask(newTask);

    // очистить поле ввода после добавления задачи и возвращаем на него фокус
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event) {
    // проверяем что клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return;


    // проверяем что клик был по кнопке "удалить задачу"
    const parentNode = event.target.closest('.list-group-item');

    // определяем ID задачи
    const id = Number(parentNode.id);

    // 1 способ удаления задачи из массива по индексу    
    // // находим индекс задачи в массиве
    // const index = tasks.findIndex((task) => task.id === id);

    // // удаление задачи из массива с задачам
    // tasks.splice(index, 1);

    //  2 способ удаление зачади из массива с помощью метода filter
    tasks = tasks.filter((task) => task.id !== id)

    // сохраняем массив с задачами в localstorage
    saveToLocalStorage();

    // удаляем задачу из разметки
    parentNode.remove();

    checkEmptyList();
}

function doneTask(event) {
    // проверяем что клик был НЕ по кнопке "выполнено"
    if (event.target.dataset.action !== 'done') return;

    // если клик был выполнен по кнопке "выполнено"
    const parentNode = event.target.closest('.list-group-item');

    // определяем ID задачи
    const id = Number(parentNode.id);
    // находим задачу по ID
    const task = tasks.find((task) => task.id === id)
    // меняем статус задачи на противоположный
    task.done = !task.done

    // сохраняем задачу в localstorage
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done'); // благодаря тому что мы используем toggle, а не add, мы можем в случае миссклика отменить отметку выполненной задачи, потому что toggle не только добавляет класс, но и удаляет
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    // формируем css класс
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // формируем разметку для новой задачи
    const taskHTML = `
                    <li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`;

    // добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}