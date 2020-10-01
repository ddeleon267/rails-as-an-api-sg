// ********* global constants so I don't have to repeat myself ************
const BASE_URL = 'http://localhost:3000'
const main = document.getElementById("main")
const todoFormDiv = document.getElementById("todo-form")

// ********* startup routine => make fetch to get initial data *********** //
document.addEventListener("DOMContentLoaded", () =>{
    getTodos()
})

// ************************* requests to backend ************************ //

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
}

function makeTodoListItem(todo){
    return (`
            <li>
                <a href="" data-id="${todo.id}">${todo.description}</a> - ${todo.completed ? "Completed" : "Not Completed"} 
            </li>
            `)
}
