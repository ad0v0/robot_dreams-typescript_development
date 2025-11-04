import type { Task as TaskDTO } from '../../../dto/Task'
import type { TaskStatus, TaskPriority } from '../task.types'

export class Task implements TaskDTO {
  id: string
  title: string
  description: string
  createdAt: Date
  deadline: Date
  status?: TaskStatus
  priority?: TaskPriority

  constructor(task: TaskDTO) {
    if (!task.id) {
      throw new Error('Id is required')
    }
    if (!task.title || !task.title.trim()) {
      throw new Error('Title is required')
    }
    if (!task.description) {
      task.description = ''
    }
    if (!task.createdAt) {
      throw new Error('Creation date is required')
    }
    if (!task.deadline) {
      throw new Error('Deadline is required')
    }

    this.id = task.id
    this.title = task.title
    this.description = task.description
    this.createdAt = new Date(task.createdAt)
    this.deadline = new Date(task.deadline)
    this.status = task.status
    this.priority = task.priority
  }

  getTaskInfo(): Record<string, unknown> {
    return {
      type: 'Task' as const,
      id: this.id,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      deadline: this.deadline,
      status: this.status ?? null,
      priority: this.priority ?? null,
    }
  }
}
