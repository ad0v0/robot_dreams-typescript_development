import { Op } from "sequelize"

import AppError from "../error"
import { TaskModel } from "../config/database"
import type { Task, TaskFilter, Status, Priority } from "../types/task.types"

export const getTasks = async (filters?: TaskFilter) => {
  const appliedFilters: Partial<{
    status: Status
    priority: Priority
    createdAt: {
      [Op.gte]: Date
      [Op.lt]: Date
    }
  }> = {}

  if (filters?.status) {
    Object.assign(appliedFilters, { status: filters.status })
  }

  if (filters?.priority) {
    Object.assign(appliedFilters, { priority: filters.priority })
  }

  if (filters?.createdAt) {
    const start = new Date(filters.createdAt)
    start.setUTCHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setUTCDate(end.getUTCDate() + 1)

    appliedFilters.createdAt = {
      [Op.gte]: start,
      [Op.lt]: end,
    }
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
    throw new AppError("Task not found", 404)
  }
  return task
}

export const addTask = async (taskData: {
  title: string
  description: string
  status?: Status
  priority?: Priority
  deadline?: Date | string
  assigneeId?: string | null
}) => {
  const task = await TaskModel.create({
    ...taskData,
    deadline: taskData.deadline ? new Date(taskData.deadline) : null,
    assigneeId: taskData.assigneeId ?? null,
  })

  return getTaskById(task.id).then((item) => item.toJSON())
}

export const updateTask = async (
  id: string,
  updates: Partial<Task> & { assigneeId?: string | null },
) => {
  const task = await TaskModel.findByPk(id)

  if (!task) {
    throw new AppError("Task not found", 404)
  }

  await task.update({
    ...updates,
    deadline: updates.deadline ? new Date(updates.deadline) : task.deadline,
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

  await task.destroy()
}
