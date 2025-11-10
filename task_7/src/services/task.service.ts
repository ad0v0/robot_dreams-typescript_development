import { v4 as uuidv4 } from 'uuid'

import { Task, TaskFilter} from '../types/task.types'
import { tasks } from '../database/data'
import AppError from '../error'

export const getTasks = async (filters?: TaskFilter) => {
  let result = tasks

  if (filters) {
    if (filters.status) {
      result = result.filter((task) => task.status === filters.status)
    }
    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority)
    }
    if (filters.createdAt) {
      result = result.filter((task) => task.createdAt.startsWith(filters.createdAt))
    }
  }

  return result
}

export const getTaskById = async (id: string) => {
  return tasks.find((task) => task.id === id)
}

export const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
  const newTask: Task = {
    ...task,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }
  tasks.push(newTask)
  return newTask
}

export const updateTask = async (id: string, updatedFields: Partial<Task>) => {
  const task = tasks.find((task) => task.id === id)
  if (!task) {
    throw new AppError('Task not found', 404)
  }
  Object.assign(task, updatedFields)
  return task
}

export const deleteTask = async (id: string) => {
  const taskIndex = tasks.findIndex((task) => task.id === id)
  if (taskIndex === -1) throw new AppError('Task not found', 404)
  const deleted = tasks.splice(taskIndex, 1)[0]
  return deleted
}
