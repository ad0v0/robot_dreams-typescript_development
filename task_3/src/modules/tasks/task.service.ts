import type { Task, TaskFilter } from '../../dto/Task'
import { getTasks } from '../../utils/utils'
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from '../../constants/constants'

export class TaskService {
  private tasks: Task[] = []

  constructor() {
    this.tasks = getTasks()
  }

  public validateTaskData(data: Partial<Task>) {
    const { title, description, createdAt, deadline } = data

    if (title !== undefined && title.trim() === '') {
      throw new Error('Title is required and cannot be empty')
    }

    if (description !== undefined && description.trim() === '') {
      throw new Error('Description is required and cannot be empty')
    }

    if (deadline && createdAt && (deadline.getTime() / 1000) < (createdAt.getTime() / 1000)) {
      throw new Error('Deadline cannot be before creation date')
    }
  }

  getAllTasks(): Task[] {
    return [...this.tasks]
  }

  getTaskDetails(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id)
  }

  createTask(task: Task): Task[] {
    this.validateTaskData(task)

    const normalized: Task = {
      ...task,
      status: task.status ?? DEFAULT_STATUS,
      priority: task.priority ?? DEFAULT_PRIORITY,
    }

    this.tasks.push(normalized)
    return this.getAllTasks()
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex((task) => task.id === id)
    if (index === -1) return undefined

    this.validateTaskData(updates)

    const updated = { ...this.tasks[index], ...updates }
    this.tasks[index] = updated
    return updated
  }

  deleteTask(id: string): boolean {
    const defaultTasksAmount = this.tasks.length
    const currentTasksAmount = this.tasks.filter((task) => task.id !== id).length
    return currentTasksAmount < defaultTasksAmount
  }

  filterTasks(filter: TaskFilter): Task[] {
    return this.tasks.filter((task) => {
      const tasksFilteredByStatus = !filter.status || task.status === filter.status
      const tasksFilteredByPriority = !filter.status || task.priority === filter.priority
      const tasksFilteredByCreatedAt = !filter.createdAt || task.createdAt === filter.createdAt

      return tasksFilteredByStatus && tasksFilteredByPriority && tasksFilteredByCreatedAt
    })
  }

  checkTaskForCompletionBeforeDeadline(id: string): boolean {
    const task = this.getTaskDetails(id)
    if (!task) return false

    const now = new Date()
    return task.status === 'done' && now <= task.deadline
  }
}
