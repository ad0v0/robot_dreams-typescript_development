import type { Task as TaskDTO } from '../../dto/Task'

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type BugSeverity = 'minor' | 'major' | 'critical'

export type TaskFilter = {
  status?: TaskStatus
  priority?: TaskPriority
  createdAt?: Date
}

export type Task = TaskDTO
