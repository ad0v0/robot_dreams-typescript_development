import { z } from 'zod'

import { tasks } from '../data/tasks.json'
import type { TaskDTO } from '../modules/tasks/task.types'
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from '../constants/constants'
import { TASK_PRIORITIES, TASK_STATUSES } from '../modules/tasks/task.types'

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string().refine((string) => !isNaN(Date.parse(string))).transform((string) => new Date(string)),
  deadline: z.string().refine((string) => !isNaN(Date.parse(string))).transform((string) => new Date(string)),
  status: z.enum(TASK_STATUSES).optional().default(DEFAULT_STATUS),
  priority: z.enum(TASK_PRIORITIES).optional().default(DEFAULT_PRIORITY),
})
const TasksSchema = z.array(TaskSchema)
const validatedTasks = TasksSchema.parse(tasks)

export function getTasks (): TaskDTO[] {
  return validatedTasks.map((task: TaskDTO) => {
    return {
      ...task,
      status: task.status || DEFAULT_STATUS,
      priority: task.priority || DEFAULT_PRIORITY,
    }
  })
}