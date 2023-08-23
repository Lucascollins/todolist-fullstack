const connection = require("./connection")

const getAll = async() =>{
    const [tasks] = await connection.execute("SELECT * FROM tasks")
    return tasks
}

const addTask = async(task)=>{
    const {title} = task
    const dateUTC = new Date(Date.now()).toUTCString()
    const query = `INSERT INTO tasks(title,status,created_at) VALUES (?,?,?)`
    const [addedTask] = await connection.execute(query,[title,"pendente",dateUTC])
    return {insertId:addedTask.insertId}
}


const deleteTask = async(id) =>{
    const [deletedTask] = await connection.execute("DELETE FROM tasks WHERE id = ?",[id])
    return deletedTask
}

const updateTask = async(id,task) =>{
    const {title, status} = task
    const query = "UPDATE tasks SET title = ?, status = ? WHERE id = ?"
    const [updatedTask] = await connection.execute(query,[title,status,id])
    return updatedTask
}





module.exports = {
	getAll,
    addTask,
    deleteTask,
    updateTask,
}