class Td {
    constructor(todo) { //todo object from json
        this.id = todo.id
        this.description = todo.description
        this.completed = todo.completed
        this.steps = todo.steps
    }

    renderTodo() {
        return (`<li id="todo-${this.id}">
                <a href="" data-id="${this.id}">${this.description}</a> - ${this.completed ? "Completed" : "Not Completed"}
                <ul id="steps">
                </ul>
                <button id="delete" data-id="${this.id}">Delete</button>
                <button id="update-todo" data-id="${this.id}">Edit</button>
            </li>`
        )
    }

    renderULs() {
        const ul = document.querySelector(`li#todo-${this.id} #steps`)

        this.steps.forEach(step => {
            ul.innerHTML += `<li>${step.description}</li>`
        })
    }
}