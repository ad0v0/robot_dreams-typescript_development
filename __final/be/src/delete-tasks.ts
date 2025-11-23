import "reflect-metadata"
import db, { TaskModel } from "../src/config/database"

async function deleteTasks() {
  try {
    await db.authenticate()
    console.log("DB connected")

    await TaskModel.destroy({ where: {} })
    console.log("All tasks deleted")

    process.exit(0)
  } catch (error) {
    console.error("Error resetting tasks:", error)
    process.exit(1)
  }
}

deleteTasks()
