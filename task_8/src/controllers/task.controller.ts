import { Request, Response, NextFunction } from 'express'
import { z, ZodError, ZodIssue } from 'zod'

import {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
} from '../services/task.service'
import AppError from '../error'
import { TASK_PRIORITIES, TASK_STATUSES } from '../types/task.types'

const taskBodySchema = z.object({
  title: z.string().min(4),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  deadline: z.string().optional(),
  assigneeId: z.string().uuid().optional(),
})

const taskQuerySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  createdAt: z.string().optional(),
})

function zodErrorMessage(error: ZodError): string {
  const issues: ZodIssue[] = error.issues ?? []
  return issues.map((issue: ZodIssue) => issue.message ?? 'Invalid input').join('; ')
}

function handleError(error: unknown, next: NextFunction) {
  if (error instanceof ZodError) {
    const message = zodErrorMessage(error)
    return next(new AppError(message, 400))
  }

  next(error as Error)
}

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedQuery = taskQuerySchema.parse(req.query)
    const tasks = await getTasks(parsedQuery)
    res.json(tasks)
  } catch (error) {
    handleError(error, next)
  }
}

export const getTaskDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await getTaskById(req.params.id)

    if (!task) {
      throw new AppError('Task not found', 404)
    }

    res.json(task)
  } catch (error) {
    handleError(error, next)
  }
}

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedBody = taskBodySchema.parse(req.body)
    const newTask = await addTask(parsedBody)
    res.status(201).json(newTask)
  } catch (error) {
    handleError(error, next)
  }
}

export const updateTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedBody = taskBodySchema.partial().parse(req.body)
    const updated = await updateTask(req.params.id, parsedBody)
    res.json(updated)
  } catch (error) {
    handleError(error, next)
  }
}

export const deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await deleteTask(req.params.id)
    res.json(deleted)
  } catch (error) {
    handleError(error, next)
  }
}
