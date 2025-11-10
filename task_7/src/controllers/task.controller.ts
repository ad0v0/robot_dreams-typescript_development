import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'

import {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
} from '../services/task.service'
import AppError from '../error'
import { TaskFilter } from '../types/task.types'

const taskBodySchema = z.object({
  title: z.string().min(4),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  deadline: z.string().optional(),
})

const taskQuerySchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  createdAt: z.string().optional(),
})

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = taskQuerySchema.parse(req.query)
    const filters = parsed as unknown as TaskFilter
    const tasks = await getTasks(filters)
    res.json(tasks)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const message = error.errors.map((item) => item.message).join('; ')
      return next(new AppError(message, 400))
    }
    next(error as Error)
  }
}

export const getTaskDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await getTaskById(req.params.id)
    if (!task) {
      throw new AppError('Task not found', 404)
    }
    res.json(task)
  } catch (error: unknown) {
    next(error as Error)
  }
}

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = taskBodySchema.parse(req.body)
    const newTask = await addTask(parsed)
    res.status(201).json(newTask)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const message = error.errors.map((item) => item.message).join('; ')
      return next(new AppError(message, 400))
    }
    next(error as Error)
  }
}

export const updateTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = taskBodySchema.partial().parse(req.body)
    const updated = await updateTask(req.params.id, parsed)
    res.json(updated)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const message = error.errors.map((item) => item.message).join('; ')
      return next(new AppError(message, 400))
    }
    next(error as Error)
  }
}

export const deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await deleteTask(req.params.id)
    res.json(deleted)
  } catch (error: unknown) {
    next(error as Error)
  }
}
