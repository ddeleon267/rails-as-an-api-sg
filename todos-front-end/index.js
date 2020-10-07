// ********* global constants so I don't have to repeat myself ************

const BASE_URL = 'http://localhost:3000'
const main = document.getElementById("main")
const todoFormDiv = document.getElementById("todo-form")

// ********* startup routine => make fetch to get initial data *********** //

document.addEventListener("DOMContentLoaded", () =>{ 
    getTodos()
})

// ************************* requests to backend ************************ //

function updateTodo() {  // processes submission of edit form (makes patch req. to backend) and updates html for edited todo on the page
    event.preventDefault()
    const id = event.target.dataset.id

    const todo = { // js object I will pass to the configObj below
        description: event.target.querySelector("#description").value,
        completed: event.target.querySelector("#completed").checked
    }

    const configObj = {
        method: 'PATCH',
        body: JSON.stringify(todo), // have to send over todo data as json
        headers: { // specify what kind of data I'm sending/receiving
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    fetch(BASE_URL + `/todos/${id}`, configObj)
        .then(response => response.json())
        .then(todo => { // using the updated todo that is returned to update the html for that todo on the page
            const todoLinks = `<a href="" data-id="${todo.id}">${todo.description}</a> - ${todo.completed ? "Completed" : "Not Completed"}
                <button id="delete" data-id="${todo.id}">Delete</button>
                <button id="update-todo" data-id="${todo.id}">Edit</button>`

            document.querySelector(`li a[data-id="${id}"]`).parentElement.innerHTML = todoLinks
            attachClicksToLinks() // since I replaced the html I need to reattach the event listeners
            todoFormDiv.innerHTML = ""
        })
}


function editTodo() {
    event.preventDefault()
    const id = event.target.dataset.id // target is the button to view the form

    fetch(BASE_URL + `/todos/${id}`) // I don't need a fetch to view a form per se but in this case I want the todo data returned so I can tuck some of that data into the edit form
        .then(response => response.json())
        .then(todo => { // I can use the data from the todo to pre-populate the input fields for the form
            const html = `
            <form data-id=${id}>
                <input type="text" id="description" value="${todo.description}">
                <label>Complete:</label>
                <input type="checkbox" id="completed" ${todo.completed ? "checked" : ""}></input>
                <input type="submit">
            </form>
            `
            todoFormDiv.innerHTML = html
            document.querySelector("form").addEventListener('submit', updateTodo)
        })
}

function removeTodo(){ // makes delete req. to backend + removes the given todo's html from the DOM
    event.preventDefault()
    const configObj = {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    // target here is the delete button for the given todo
    fetch(BASE_URL + `/todos/${event.target.dataset.id}`, configObj)
    .then(event.target.parentElement.remove())
    // I don't need to do anything in the "then" portion of the fetch per se, but it's best practice because 
    // I am hooking the two things together - this makes sure I only remove the todo from the DOM
    // if I have successfully deleted it from the database
}


function createTodo(){
    event.preventDefault()

    const todo = { 
        description: document.getElementById("description").value,
        completed: document.getElementById("completed").value
    }

    const configObj = {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json'
        }
    }
    
    fetch(BASE_URL + '/todos', configObj)
    .then(response => response.json())
    .then(todo => {
        main.innerHTML += makeTodoListItem(todo)
        todoFormDiv.innerHTML = ""
    })
}

function displayTodo(){
    event.preventDefault()
    const id = event.target.dataset.id
    main.innerHTML = ''

    fetch(BASE_URL + '/todos/' + id)
    .then(response => response.json())
    .then(todo => {
        main.innerHTML += makeTodoElement(todo)
    })
}


function getTodos(){
    todoFormDiv.innerHTML = ''
    main.innerHTML = ""
    fetch(BASE_URL + '/todos')
    .then(response => response.json())
    .then(todos => {
        main.innerHTML += todos.map((todo) => makeTodoListItem(todo)).join("")
        attachClicksToLinks()
    })

}

// ********* Helpers for generating HTML and adding event listeners ********* //

function displayForm(){
    const html = makeTodoForm()
    todoFormDiv.innerHTML += html
    document.querySelector("form").addEventListener('submit', createTodo)
}

function makeTodoForm(){
    return (`
            <form>
                <input type="text" id="description">
                <label>Complete:</label>
                <input type="checkbox" id="completed"></input>
                <input type="submit">
            </form>
            `)
}


function makeTodoElement(todo){
    return (`
            <h3>${todo.description}<h3>
            <p>${todo.completed ? "Completed" : "Not Completed"}</p>
            `)
}

function attachClicksToLinks(){
    const todos = document.querySelectorAll("li a")
    
    todos.forEach((todoATag => {
        todoATag.addEventListener('click', displayTodo)
    }))

    document.getElementById("add-todo-form").addEventListener('click', displayForm)
    document.getElementById("todos").addEventListener('click', getTodos)

    document.querySelectorAll("#delete").forEach(todo => todo.addEventListener('click', removeTodo))
    document.querySelectorAll("#update-todo").forEach(todo => todo.addEventListener('click', editTodo))

}

function makeTodoListItem(todo){
    return (`<li>
                <a href="" data-id="${todo.id}">${todo.description}</a> - ${todo.completed ? "Completed" : "Not Completed"}
                <button id="delete" data-id="${todo.id}">Delete</button>
                <button id="update-todo" data-id="${todo.id}">Edit</button>
            </li>`
            )
}
