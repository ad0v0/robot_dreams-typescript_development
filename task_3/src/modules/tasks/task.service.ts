import type { Task, TaskFilter } from '../../dto/Task'
import { getTasks } from '../../utils/utils'
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from '../../constants/constants'
import { Task as TaskModel } from './models/task.model'
import { Subtask } from './models/subtask.model'
import { Bug } from './models/bug.model'
import { Epic } from './models/epic.model'
import type { BugSeverity } from './task.types'

type TaskUpdates = Partial<Omit<Task, 'id' | 'createdAt'>>

type SpecificUpdates = {
  severity?: BugSeverity
  parentId?: string
  childIds?: string[]
}

export class TaskService {
  private tasks: TaskModel[] = []

  constructor() {
    const tasks = getTasks()
    this.tasks = tasks.map((task: Task) => {
      return new TaskModel({
        id: task.id,
        title: task.title,
        description: task.description,
        createdAt: task.createdAt,
        status: task.status ?? DEFAULT_STATUS,
        priority: task.priority ?? DEFAULT_PRIORITY,
        deadline: task.deadline,
      })
    })
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

  getAllTasks(): TaskModel[] {
    return [...this.tasks]
  }

  getTaskDetails(id: string): TaskModel | undefined {
    return this.tasks.find((task) => task.id === id)
  }

  createTask(task: Task): TaskModel[] {
    this.validateTaskData(task)

    const normalized: Task = {
      ...task,
      status: task.status ?? DEFAULT_STATUS,
      priority: task.priority ?? DEFAULT_PRIORITY,
    }

    const item = new TaskModel(normalized)
    this.tasks.push(item)
    return this.getAllTasks()
  }

  updateTask(id: string, updates: TaskUpdates): TaskModel | undefined {
    const index = this.tasks.findIndex((task) => task.id === id)
    if (index === -1) return undefined

    this.validateTaskData(updates as Partial<Task>)

    const item = this.tasks[index]

    if (updates.title !== undefined) {
      item.title = updates.title
    }
    if (updates.description !== undefined) {
      item.description = updates.description
    }
    if (updates.status !== undefined) {
      if (!['todo', 'in_progress', 'done'].includes(updates.status)) {
        throw new Error('The status is invalid')
      }
      item.status = updates.status
    }
    if (updates.priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(updates.priority)) {
        throw new Error('The priority is invalid')
      }
      item.priority = updates.priority
    }
    if (updates.deadline !== undefined) {
      if (!(updates.deadline instanceof Date)) throw new Error('The deadline is invalid')
      item.deadline = updates.deadline
    }

    const specific = updates as SpecificUpdates

    if (item instanceof Bug && specific.severity !== undefined) {
      item.severity = specific.severity
    }

    if (item instanceof Subtask && specific.parentId !== undefined) {
      item.parentId = specific.parentId
    }

    if (item instanceof Epic && specific.childIds !== undefined) {
      item.childIds = Array.isArray(specific.childIds) ? specific.childIds.slice() : item.childIds
    }

    this.tasks[index] = item
    return item
  }

  deleteTask(id: string): boolean {
    const defaultTasksAmount = this.tasks.length
    const currentTasksAmount = this.tasks.filter((task) => task.id !== id).length
    return currentTasksAmount < defaultTasksAmount
  }

  filterTasks(filter: TaskFilter): TaskModel[] {
    return this.tasks.filter((task) => {
      const tasksFilteredByStatus = !filter.status || task.status === filter.status
      const tasksFilteredByPriority = !filter.priority || task.priority === filter.priority
      const tasksFilteredByCreatedAt = !filter.createdAt || task.createdAt.getTime() === filter.createdAt.getTime()

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
