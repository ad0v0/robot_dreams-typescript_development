export type Status = "todo" | "in_progress" | "review" | "done"
export type Priority = "high" | "medium" | "low"

export const TASK_STATUSES = ["todo", "in_progress", "review", "done"] as const
export const TASK_PRIORITIES = ["low", "medium", "high"] as const

export interface TaskFilter {
  status?: Status
  priority?: Priority
  createdAt?: Date
}

export interface Task {
  id: string
  title: string
  description: string
  createdAt: Date
  status: Status
  priority: Priority
  deadline: Date
}
