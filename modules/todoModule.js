const { getCollection, toObjectId } = require("./dbModule.js")

const entity = "todos"

async function createTodo(todo) {
  try {
    const collection = await getCollection(entity)
    const newTodo = { ...todo, creatorId: toObjectId(todo.creatorId) }
    const result = await collection.insertOne(newTodo)
    newTodo._id = result.insertedId
    return newTodo
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function removeTodo(todoId) {
  try {
    const collection = await getCollection(entity)
    await collection.deleteOne({ _id: toObjectId(todoId) })
  } catch (error) {
    throw error
  }
}

async function toggleTodoDone(todoId) {
  try {
    const collection = await getCollection(entity)
    const todo = await collection.findOne({ _id: toObjectId(todoId) })
    if (!todo) throw new Error("Todo not found😢")
    await collection.updateOne(
      { _id: todo._id },
      { $set: { isDone: !todo.isDone } }
    )
  } catch (error) {
    throw error
  }
}

async function getUserTodos(userId = null) {
  try {
    const collection = await getCollection(entity)
    const filter = userId === null ? {} : { creatorId: toObjectId(userId) }
    const todos = await collection.find(filter).toArray()
    return todos
  } catch (error) {
    throw error
  }
}

module.exports = { createTodo, removeTodo, toggleTodoDone, getUserTodos }
