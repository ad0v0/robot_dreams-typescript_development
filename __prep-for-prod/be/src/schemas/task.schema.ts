import { z } from 'zod'

import { TASK_PRIORITIES, TASK_STATUSES } from '../types/task.types'
import { DEFAULT_PRIORITY, DEFAULT_STATUS } from '../constants/constants'

export const taskBodySchema = z.object({
  title: z.string().min(4),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES).catch(DEFAULT_STATUS),
  priority: z.enum(TASK_PRIORITIES).catch(DEFAULT_PRIORITY),
  deadline: z
    .string()
    .refine((value) => {
      if (!value) return true
      const time = Date.parse(value)
      return !isNaN(time)
    }, { message: 'deadline must be a Date' }),
})

export const taskQuerySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  createdAt: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true
      const time = Date.parse(value)
      return !isNaN(time)
    }, { message: 'createdAt must be a Date' }),
})
