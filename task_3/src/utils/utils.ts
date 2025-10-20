import { z } from 'zod'

import { tasks } from '../data/tasks.json'
import type { Task } from '../dto/Task'
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from '../constants/constants'

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string().refine((string) => !isNaN(Date.parse(string))).transform((string) => new Date(string)),
  deadline: z.string().refine((string) => !isNaN(Date.parse(string))).transform((string) => new Date(string)),
  status: z.enum(['todo','in_progress','done']).optional().default(DEFAULT_STATUS),
  priority: z.enum(['low','medium','high']).optional().default(DEFAULT_PRIORITY),
})
const TasksSchema = z.array(TaskSchema)
const validatedTasks = TasksSchema.parse(tasks)

export function getTasks (): Task[] {
  return validatedTasks.map((task: Task) => {
    return {
      ...task,
      status: task.status || DEFAULT_STATUS,
      priority: task.priority || DEFAULT_PRIORITY,
    }
  })
}