import { Request, Response } from 'express'

import {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
} from '../services/task.service'
import AppError from '../error'
import { TaskFilter } from '../types/task.types'

export const getAllTasks = async (req: Request, res: Response) => {
  const filters = (req.validatedQuery ? (req.validatedQuery as unknown as TaskFilter) : undefined)
  const tasks = await getTasks(filters)
  res.json(tasks)
}

export const getTaskDetails = async (req: Request<{ id: string }>, res: Response) => {
  const task = await getTaskById(req.params.id)

  if (!task) {
    throw new AppError('Task not found', 404)
  }

  res.json(task)
}

export const createTask = async (req: Request, res: Response) => {
  const newTask = await addTask(req.body)
  res.status(201).json(newTask)
}

export const updateTaskById = async (req: Request<{ id: string }>, res: Response) => {
  const updated = await updateTask(req.params.id, req.body)
  res.json(updated)
}

export const deleteTaskById = async (req: Request<{ id: string }>, res: Response) => {
  const deleted = await deleteTask(req.params.id)
  res.json(deleted)
}
