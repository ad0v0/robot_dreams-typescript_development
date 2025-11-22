import type { Task } from '../../features/tasks/types'

export const DEFAULT_STATUS = 'todo'
export const DEFAULT_PRIORITY = 'low'

export const STATUSES: {
  key: Task['status']
  label: string
}[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
]
