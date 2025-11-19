import { Op } from 'sequelize'

import AppError from '../error'
import { TaskModel, UserModel } from '../config/database'
import type { Task, TaskFilter, Status, Priority } from '../types/task.types'

export const getTasks = async (filters?: TaskFilter) => {
  const appliedFilters = {}

  if (filters?.status) {
    Object.assign(appliedFilters, { status: filters.status })
  }

  if (filters?.priority) {
    Object.assign(appliedFilters, { priority: filters.priority })
  }

  if (filters?.createdAt) {
    const createdAt = new Date(filters.createdAt)
    Object.assign(appliedFilters, {
      createdAt: {
        [Op.gte]: createdAt,
      },
    })
  }

  return TaskModel.findAll({
    where: {
      [Op.and]: {
        ...appliedFilters,
      },
    },
  })
}

export const getTaskById = async (id: string) => {
  const task = await TaskModel.findByPk(id)

  if (!task) {
    throw new AppError('Task not found', 404)
  }
  return task
}

export const addTask = async (taskData: {
  title: string
  description?: string
  status?: Status
  priority?: Priority
  deadline?: Date | string | null
  assigneeId?: string | null
}) => {
  if (taskData.assigneeId) {
    const assignee = await UserModel.findByPk(taskData.assigneeId)

    if (!assignee) {
      throw new AppError('Assignee not found', 404)
    }
  }

  const task = await TaskModel.create({
    ...taskData,
    deadline: taskData.deadline ? new Date(taskData.deadline) : null,
    assigneeId: taskData.assigneeId ?? null,
  })

  return getTaskById(task.id).then((item) => item.toJSON())
}

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const task = await TaskModel.findByPk(id)

  if (!task) {
    throw new AppError('Task not found', 404)
  }

  if ('assigneeId' in updates && updates.assigneeId) {
    const assignee = await UserModel.findByPk(updates.assigneeId)

    if (!assignee) {
      throw new AppError('Assignee not found', 404)
    }
  }

  await task.update({
    ...updates,
    deadline: updates.deadline ? new Date(updates.deadline as Date | string) : updates.deadline ?? null,
    assigneeId: updates.assigneeId ?? task.assigneeId,
  })

  const updatedTask = await getTaskById(task.id)
  return updatedTask.toJSON()
}

export const deleteTask = async (id: string) => {
  const task = await TaskModel.findByPk(id)

  if (!task) {
    throw new AppError("Task not found", 404)
  }

  const deleted = task.toJSON()
  await task.destroy()
  return deleted
}
