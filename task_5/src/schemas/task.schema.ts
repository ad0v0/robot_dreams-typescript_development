import { z } from 'zod'
import { TASK_PRIORITIES, TASK_STATUSES } from '../dto/Task'
import { DEFAULT_PRIORITY, DEFAULT_STATUS } from '../constants/constants'

export const TaskSchema = z.object({
  title: z.string().min(4, 'Title is required and must contain at least 4 characters. Why 4? Can you meow?'),
  description: z.string().or(z.literal('')),
  status: z.enum(TASK_STATUSES).default(DEFAULT_STATUS),
  priority: z.enum(TASK_PRIORITIES).default(DEFAULT_PRIORITY),
  deadline: z
    .string()
    .refine((value) => {
      if (!value) return false
      const chosenDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return chosenDate >= today
    }, 'Deadline should not be a date from the past'),
})

export type TaskFormData = z.infer<typeof TaskSchema>
export default TaskSchema
