const dotenv = require("dotenv")
dotenv.config()


const express = require("express")
const app = express()
const path = require("path")
const userModule = require("./modules/userModule.js")
const todoModule = require("./modules/todoModule.js")

app.use(express.static("client"))
app.use(express.json())

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "login.html"))
})

app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password } = req.body
    await userModule.addUser(email, username, password)
    res.send({ success: true })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ success: false, message: error.message })
  }
})

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await userModule.getUserByUsername(username)
    return res.send({ success: true, user })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ success: false, message: error.message })
  }
})

app.post("/api/todo", async (req, res) => {
  try {
    const newTodo = await todoModule.createTodo(req.body)
    return res.send({ success: true, todo: newTodo })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

app.delete("/api/todo/:todoId", async (req, res) => {
  try {
    // const params = req.params
    // const todoId = params.todoId
    const { todoId } = req.params
    await todoModule.removeTodo(todoId)
    res.send({ success: true })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

app.put("/api/todo/:todoId", async (req, res) => {
  try {
    // const params = req.params
    // const todoId = params.todoId
    const { todoId } = req.params
    await todoModule.toggleTodoDone(todoId)
    res.send({ success: true })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

app.get("/api/todo", async (req, res) => {
  try {
    const todos = await todoModule.getUserTodos(req.query.userId)
    return res.send({ success: true, todos })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
