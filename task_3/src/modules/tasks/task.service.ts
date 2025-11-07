import type { BugSeverity, TaskDTO, TaskFilter } from './task.types'
import { getTasks } from '../../utils/utils'
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from '../../constants/constants'
import { Task as TaskModel } from './models/task.model'
import { Subtask } from './models/subtask.model'
import { Bug } from './models/bug.model'
import { Story } from './models/story.model'
import { Epic } from './models/epic.model'

type TaskUpdates = Partial<Omit<TaskDTO, 'id' | 'createdAt'>>

type CreatePayload = TaskDTO & Partial<{
  parentId: string
  severity: BugSeverity
  userValue: string
  childIds: string[]
}>

type UpdatePayload = TaskUpdates & Partial<Pick<CreatePayload, 'parentId' | 'severity' | 'userValue' | 'childIds'>>

export class TaskService {
  private tasks: TaskModel[] = []

  constructor() {
    const tasks = getTasks()
    this.tasks = tasks.map((task: TaskDTO) => {
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

  private convertToDate(value: Date | string | undefined): Date | undefined {
    if (value === undefined) return undefined
    return value instanceof Date ? value : new Date(value)
  }

  public validateTaskData(data: Partial<TaskDTO>): void {
    const { title, description, createdAt, deadline } = data

    if (title !== undefined && title.trim() === '') {
      throw new Error('Title is required and cannot be empty')
    }

    if (description !== undefined && description.trim() === '') {
      throw new Error('Description is required and cannot be empty')
    }

    if (deadline !== undefined) {
      const deadlineDate = this.convertToDate(deadline)
      if (!deadlineDate || isNaN(deadlineDate.getTime())) throw new Error('Deadline is invalid')

      if (createdAt !== undefined) {
        const createdAtDate = this.convertToDate(createdAt)
        if (!createdAtDate || isNaN(createdAtDate.getTime())) {
          throw new Error('Creation date is invalid')
        }
        if (deadlineDate.getTime() < createdAtDate.getTime()) {
          throw new Error('Deadline cannot be before creation date')
        }
      }
    }
  }

  getAllTasks(): TaskModel[] {
    return [...this.tasks]
  }

  getTaskDetails(id: string): TaskModel | undefined {
    return this.tasks.find((task) => task.id === id)
  }

  createTask(payload: CreatePayload): TaskModel[] {
    const normalized: TaskDTO = {
      id: payload.id,
      title: payload.title,
      description: payload.description,
      createdAt: payload.createdAt,
      status: payload.status ?? DEFAULT_STATUS,
      priority: payload.priority ?? DEFAULT_PRIORITY,
      deadline: payload.deadline,
    }

    this.validateTaskData(normalized)

    let task: TaskModel
    if (payload.parentId !== undefined) {
      task = new Subtask({ ...normalized, parentId: payload.parentId })
    } else if (payload.severity !== undefined) {
      task = new Bug({ ...normalized, severity: payload.severity })
    } else if (payload.userValue !== undefined) {
      task = new Story({ ...normalized, userValue: payload.userValue })
    } else if (payload.childIds !== undefined) {
      task = new Epic({ ...normalized, childIds: payload.childIds })
    } else {
      task = new TaskModel(normalized)
    }

    this.tasks.push(task)
    return this.getAllTasks()
  }

  updateTask(id: string, update: UpdatePayload): TaskModel | undefined {
    const index = this.tasks.findIndex((task) => task.id === id)
    if (index === -1) return undefined

    this.validateTaskData(update as Partial<TaskDTO>)

    const task = this.tasks[index]

    if (update.title !== undefined) {
      task.title = update.title
    }
    if (update.description !== undefined) {
      task.description = update.description
    }

    if (update.status !== undefined) {
      if (!['todo', 'in_progress', 'done'].includes(update.status)) throw new Error('The status is invalid')
      task.status = update.status
    }

    if (update.priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(update.priority)) {
        throw new Error('The priority is invalid')
      }
      task.priority = update.priority
    }

    if (update.deadline !== undefined) {
      const date = this.convertToDate(update.deadline)
      if (!date || isNaN(date.getTime())) throw new Error('The deadline is invalid')
      task.deadline = date
    }

    if (task instanceof Bug && update.severity !== undefined) {
      task.severity = update.severity
    }
    if (task instanceof Subtask && update.parentId !== undefined) {
      task.parentId = update.parentId
    }
    if (task instanceof Epic && update.childIds !== undefined) {
      task.childIds = Array.isArray(update.childIds) ? update.childIds.slice() : task.childIds
    }
    if (task instanceof Story && update.userValue !== undefined) {
      task.userValue = update.userValue
    }

    this.tasks[index] = task
    return task
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
