const tbody = document.querySelector('tbody')
const addFormBtn = document.querySelector(".add-task")
const addForm = document.querySelector(".add-form")
const inputTask = document.querySelector(".input-task")


const fetchTasks = async()=>{
    const response = await fetch("http://localhost:3333/tasks")
    const tasks = await response.json()
    return tasks
}

const addTask = async(event)=>{
    event.preventDefault()
    const task = {title:inputTask.value}

    await fetch("http://localhost:3333/tasks",{
        method:"post",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(task),
    })
    inputTask.value = ""
    loadTasks()
}

const deleteTask = async(id)=>{
    await fetch(`http://localhost:3333/tasks/${id}`,{
        method:"delete",
    })
    loadTasks()
}

const updateTask = async({id, title, created_at, status}) =>{

    await fetch(`http://localhost:3333/tasks/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title,status})
    })

    loadTasks()
}


const formatDate = (dateUTC)=>{
    const options = {dateStyle:"long", timeStyle:"short"}
    const date = new Date(dateUTC).toLocaleString("pt-br",options)
    return date


}

const createElement = (tag, innerText = "",innerHtml = "") =>{
    const element = document.createElement(tag)
    if(innerText){
        element.innerText = innerText
    }
    if(innerHtml){
        element.innerHTML = innerHtml
    }
    return element
}

const createSelect = (value)=>{
    const element = document.createElement("select")
    element.innerHTML = `
    <option value="pendente">pendente</option>
    <option value="em andamento"> em andamento</option>
    <option value="concluida">concluida</option>
    `
    element.value = value   
    return element      
}


const createRow = (task) =>{
    const {id, title, created_at, status} = task

    const tr = createElement("tr")
    const tdTitle = createElement("td",title)
    const tdData = createElement("td",formatDate(created_at))
    const tdStatus = createElement("td")
    const tdActions = createElement("td")

    const select = createSelect(status)
    select.addEventListener('change',({target})=> updateTask({...task, status:target.value}))

    const btnEdit = createElement("button","","<span class='material-symbols-outlined'>edit</span>")
    const btnDelete = createElement("button","","<span class='material-symbols-outlined'>delete</span>")

    const editForm = createElement("form")
    const editInput = createElement('input')

    editForm.classList.add("form-td")
    editInput.classList.add("input-td")
    editInput.value = title
    editForm.appendChild(editInput)

    editForm.addEventListener('submit',(event )=>{
        event.preventDefault()
        updateTask({id,title:editInput.value,status})
    })

    btnEdit.addEventListener('click',()=>{
        tdTitle.innerText = ""
        tdTitle.appendChild(editForm)
})

    btnEdit.classList.add('btn-action')
    btnDelete.classList.add('btn-action')

    btnDelete.addEventListener('click',()=>(deleteTask(id)))

    
    tdStatus.appendChild(select)

    tdActions.appendChild(btnEdit)
    tdActions.appendChild(btnDelete)

    tr.appendChild(tdTitle)
    tr.appendChild(tdData)
    tr.appendChild(tdStatus)
    tr.appendChild(tdActions)

    return tr
}

const loadTasks = async() =>{
    const tasks = await fetchTasks()    
    tbody.innerHTML = ""
    tasks.forEach((task) =>{
        const tr = createRow(task)
        tbody.appendChild(tr)
    })
}

addForm.addEventListener('submit',addTask)
addFormBtn.addEventListener('click',addTask)

loadTasks()