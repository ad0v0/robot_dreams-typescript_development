import request from "supertest"

import db, { TaskModel, UserModel } from "../config/database"
import app from "../server"

beforeEach(async () => {
  await db.sync({ force: true })
})

afterAll(async () => {
  await db.close()
})

describe("Tasks API", () => {
  it("POST /tasks creates a new task", async () => {
    const user = await UserModel.create({
      name: "Olha",
      email: "olha@example.com",
    })

    const response = await request(app)
      .post("/tasks")
      .send({
        title: "Task 1",
        description: "Description 1",
        status: "todo",
        priority: "medium",
        assigneeId: user.id,
        deadline: new Date(),
      })
      .expect(201)

    expect(response.body).toHaveProperty("id")
    expect(response.body.title).toBe("Task 1")

    await request(app).post("/tasks").send({}).expect(400)
  })

  it("GET /tasks returns list of tasks", async () => {
    const resEmpty = await request(app).get("/tasks").expect(200)
    expect(Array.isArray(resEmpty.body)).toBe(true)
    expect(resEmpty.body).toHaveLength(0)

    const user = await UserModel.create({
      name: "Olha",
      email: "olha@example.com",
    })
    await TaskModel.create({
      title: "Task 1",
      status: "todo",
      priority: "low",
      deadline: new Date("2025-11-30"),
      assigneeId: user.id,
    })
    await TaskModel.create({
      title: "Task 2",
      status: "in_progress",
      priority: "high",
      deadline: new Date("2025-11-30"),
      assigneeId: user.id,
    })

    const response = await request(app).get("/tasks").expect(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body).toHaveLength(2)
  })

  it("GET /tasks/:id returns task details", async () => {
    const user = await UserModel.create({
      name: "Olha",
      email: "olha@example.com",
    })
    const task = await TaskModel.create({
      title: "Task 1",
      status: "todo",
      priority: "low",
      deadline: new Date("2025-11-30"),
      assigneeId: user.id,
    })

    const response = await request(app).get(`/tasks/${task.id}`).expect(200)
    expect(response.body.id).toBe(task.id)
    expect(response.body.assigneeId).toBe(user.id)

    await request(app).get("/tasks/666").expect(404)
  })

  it("PUT /tasks/:id updates a task", async () => {
    const user = await UserModel.create({
      name: "Olha",
      email: "olha@example.com",
    })
    const task = await TaskModel.create({
      title: "Task 1",
      status: "todo",
      priority: "low",
      deadline: new Date("2025-11-30"),
      assigneeId: user.id,
    })

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ title: "Updated Task", status: "done" })
      .expect(200)

    expect(response.body.title).toBe("Updated Task")
    expect(response.body.status).toBe("done")

    await request(app).put("/tasks/666").send({ title: "Fail" }).expect(404)
  })

  it("DELETE /tasks/:id deletes a task", async () => {
    const user = await UserModel.create({
      name: "Olha",
      email: "olha@example.com",
    })
    const task = await TaskModel.create({
      title: "Task 1",
      status: "todo",
      priority: "low",
      deadline: new Date("2025-11-30"),
      assigneeId: user.id,
    })

    await request(app).delete(`/tasks/${task.id}`).expect(200)

    const response = await request(app).get("/tasks").expect(200)
    expect(response.body).toHaveLength(0)

    await request(app).delete("/tasks/666").expect(404)
  })
})
