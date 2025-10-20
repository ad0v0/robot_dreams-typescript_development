import type { Task as TaskDTO } from '../../dto/Task'

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

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

export class Subtask extends Task {
  parentId: string

  constructor(task: TaskDTO & { parentId: string }) {
    super(task)
    if (!task.parentId?.trim()) throw new Error('parentId cannot be empty for Subtask')
    this.parentId = task.parentId
  }

  override getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Subtask' as const,
      parentId: this.parentId,
    }
  }
}

export class Bug extends Task {
  severity: 'minor' | 'major' | 'critical'

  constructor(task: TaskDTO & { severity: 'minor' | 'major' | 'critical' }) {
    super(task)
    if (!task.severity) throw new Error('severity is required for Bug')
    this.severity = task.severity
  }

  override getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Bug' as const,
      severity: this.severity,
    }
  }
}

export class Story extends Task {
  userValue: string

  constructor(task: TaskDTO & { userValue: string }) {
    super(task)
    if (!task.userValue?.trim()) throw new Error('userValue is required for Story')
    this.userValue = task.userValue
  }

  override getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Story' as const,
      userValue: this.userValue,
    }
  }
}

export class Epic extends Task {
  childIds: string[]

  constructor(task: TaskDTO & { childIds?: string[] }) {
    super(task)
    this.childIds = task.childIds ?? []
  }

  override getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Epic' as const,
      childIds: this.childIds,
      childCount: this.childIds.length,
    }
  }
}
