import type { TaskDTO, TaskStatus, TaskPriority } from '../task.types'

export class Task implements TaskDTO {
  id: string
  title: string
  description: string
  createdAt: Date
  deadline: Date
  status?: TaskStatus
  priority?: TaskPriority

  constructor(task: TaskDTO) {
    this.id = task.id
    this.title = task.title
    this.description = task.description?.trim() ?? ''
    this.createdAt = task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt)
    this.deadline = task.deadline instanceof Date ? task.deadline : new Date(task.deadline)
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
