export type Status = "todo" | "in_progress" | "done"
export type Priority = "high" | "medium" | "low"

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
  status?: Status
  priority?: Priority
  deadline: Date
}

export type CreateTaskPayload = Omit<Task, 'id' | 'createdAt'>
