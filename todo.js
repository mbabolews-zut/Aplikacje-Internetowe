
function get(selector) {
    return document.querySelector(selector);
}

const addButton = get('#add-button');
const newTaskTextInput = get('#new-task-text-input');
const newTaskDateInput = get('#new-task-date-input');
const taskListDiv = get('#tasks');
const searchInput = get('#search-input');
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

newTaskDateInput.min = getTodayDateString();

class TodoList {
    tasks = [];
    taskListDiv = undefined;
    taskFilter = '';

    constructor(taskListDiv) {
        this.taskFilter = '';
        this.taskListDiv = taskListDiv || get('#tasks');
        const tasksFromStorage = localStorage.getItem('todo-tasks');
        if (tasksFromStorage) {
            this.tasks = JSON.parse(tasksFromStorage);
        }
        this.render();
    }

    render(filterText = null) {
        if (filterText === null) {
            filterText = this.taskFilter;
        }
        this.taskFilter = filterText;

        let filterCallback = (task) => task.text.toLowerCase().includes(filterText.toLowerCase());
        this.taskListDiv.innerHTML = '';
        for (const task of this.tasks.filter(filterCallback)) {
            // Create main task div
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');

            // Create div grid elements
            const checkboxDiv = document.createElement('div');
            const textDiv = document.createElement('div');
            const dateDiv = document.createElement('div');
            const actionsDiv = document.createElement('div');

            checkboxDiv.classList.add('task-checkbox');
            textDiv.classList.add('task-text');
            dateDiv.classList.add('task-date');
            actionsDiv.classList.add('task-actions');

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
            });
            checkboxDiv.appendChild(checkbox);

            // Text with highlighting
            textDiv.textContent = task.text;
            if(filterText) {
                // textDiv.innerHTML = textDiv.textContent.replaceAll(
                //     filterText, `<mark>${filterText}</mark>`);
                const insensitiveRegex = new RegExp(`(${filterText})`, 'gi');
                textDiv.innerHTML = textDiv.textContent.replace(insensitiveRegex, '<mark>$1</mark>');
            }

            // Date
            if (task.date) {
                const date = new Date(task.date);
                dateDiv.textContent = date.toLocaleDateString();
            } else {
                dateDiv.textContent = '';
            }
            // modify event on click of text or date
            const modifyHandler = (e) => {
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.value = task.text;

                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.value = task.date || '';
                dateInput.min = getTodayDateString();

                textDiv.innerHTML = '';
                dateDiv.innerHTML = '';
                taskDiv.tabIndex = 0; // Make div focusable
                textDiv.appendChild(textInput);
                dateDiv.appendChild(dateInput);

                e.target.getElementsByTagName("input")[0].focus();

                let timeoutId;

                const saveChanges = () => {
                    try {
                        this.modifyTask(task.uid, textInput.value, dateInput.value || null);
                    } catch (e) {
                        alert(e.message);
                    }
                    this.render();
                };

                const handleFocusOut = (e) => {
                    clearTimeout(timeoutId); // clear previous timeout if any
                    timeoutId = setTimeout(() => {
                        // If neither input is focused anymore
                        if (
                            document.activeElement !== textInput &&
                            document.activeElement !== dateInput
                        ) {
                            saveChanges();
                        }
                    }, 0); // wait for focus to move
                };

                // Listen for focusout on both inputs
                textInput.addEventListener('focusout', handleFocusOut);
                dateInput.addEventListener('focusout', handleFocusOut);
            };

            textDiv.addEventListener('click', modifyHandler, {once: true});
            dateDiv.addEventListener('click', modifyHandler, {once: true});

            // delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                this.tasks = this.tasks.filter(t => t.uid !== task.uid);
                localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
                this.render();
            });
            actionsDiv.appendChild(deleteButton);

            taskDiv.appendChild(checkboxDiv);
            taskDiv.appendChild(textDiv);
            taskDiv.appendChild(dateDiv);
            taskDiv.appendChild(actionsDiv);

            this.taskListDiv.appendChild(taskDiv);
        }
                
    }

    validateTask(text, date) {
        if (text.trim().length <= 2)
            throw new Error('Task text must be longer than 2 characters.');
        if (text.trim().length > 255)
            throw new Error('Task text must be shorter than 256 characters.');
        if (date !== null && Date.parse(date) < new Date(getTodayDateString()))
            throw new Error('Task date cannot be in past.');
    }

    addTask(text, date) {
        const task = {text: text, date: date, completed: false, uid: crypto.randomUUID() };

        this.validateTask(text, date);

        this.tasks.push(task);
        localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
        this.render();
    }

    modifyTask(uid, newText, newDate) {
        const task = this.tasks.find(t => t.uid === uid);
        if (!task) {
            throw new Error('Task not found.');
        }

        this.validateTask(newText, newDate);
        task.text = newText;
        task.date = newDate;
        localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
        this.render();
    }
}
todoList = new TodoList(taskListDiv);

addButton.addEventListener('click', () => {
    const taskText = newTaskTextInput.value;
    const taskDate = newTaskDateInput.value;

    try {
        todoList.addTask(taskText, taskDate);
    } catch (e) {
        alert(e.message);
    }
});

searchInput.addEventListener('input', (e) => {
    let len = e.target.value.length;
    let val = len > 1 ? e.target.value : ''; // Two or more characters to filter

    todoList.render(val);
});