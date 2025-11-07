export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type BugSeverity = 'minor' | 'major' | 'critical'

export type TaskDTO = {
  id: string
  title: string
  description: string
  createdAt: Date
  deadline: Date
  status?: TaskStatus
  priority?: TaskPriority
  parentId?: string
  severity?: BugSeverity
  userValue?: string
  childIds?: string[]
}

export type TaskFilter = {
  status?: TaskStatus
  priority?: TaskPriority
  createdAt?: Date
}
