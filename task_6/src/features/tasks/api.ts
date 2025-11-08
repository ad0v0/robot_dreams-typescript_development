import type { Task, TaskFilter } from './types'

const BASE = 'http://localhost:3000'
const TASKS = `${BASE}/tasks`

type TaskRaw = Omit<Task, 'createdAt' | 'deadline'> & {
  createdAt: string
  deadline?: string
}

function parseTask(taskRaw: TaskRaw): Task {
  return {
    ...taskRaw,
    createdAt: new Date(taskRaw.createdAt),
    deadline: taskRaw.deadline ? new Date(taskRaw.deadline) : undefined
  }
}

function convertTask(task: Partial<Task>): Partial<TaskRaw> {
  const convertedTask: Partial<TaskRaw> = { ...task }
  if (task.createdAt instanceof Date) convertedTask.createdAt = task.createdAt.toISOString()
  if (task.deadline instanceof Date) convertedTask.deadline = task.deadline.toISOString()
  return convertedTask
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`API error: ${response.status} ${response.statusText} ${text ? '- ' + text : ''}`)
  }
  return response.json()
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(TASKS)
  const taskRaw = await handleResponse(response) as TaskRaw[]
  return taskRaw.map(parseTask)
}

export async function getTaskDetails(id: string): Promise<Task> {
  const response = await fetch(`${TASKS}/${encodeURIComponent(id)}`)
  const taskRaw = await handleResponse(response) as TaskRaw
  return parseTask(taskRaw)
}

export async function createTask(payload: Omit<Task, 'id' | 'createdAt'> & { id?: string }): Promise<Task> {
  const body = convertTask(payload as Partial<Task>)
  const response = await fetch(TASKS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, createdAt: (body.createdAt ?? new Date().toISOString()) })
  })
  const taskRaw = await handleResponse(response) as TaskRaw
  return parseTask(taskRaw)
}

export async function updateTask(id: string, partial: Partial<Task>): Promise<Task> {
  const body = convertTask(partial)
  const response = await fetch(`${TASKS}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const taskRaw = await handleResponse(response) as TaskRaw
  return parseTask(taskRaw)
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${TASKS}/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error(`Failed to delete task ${id}`)
  }
}

export async function filterTasks(filter: TaskFilter): Promise<Task[]> {
  const params = new URLSearchParams()

  if (filter.status) {
    params.append('status', filter.status as string)
  }

  if (filter.priority) {
    params.append('priority', filter.priority as string)
  }

  if (filter.createdAt) {
    params.append('createdAt', (filter.createdAt as Date).toISOString())
  }

  const response = await fetch(`${TASKS}?${params.toString()}`)
  const taskRaw = await handleResponse(response) as TaskRaw[]

  return taskRaw.map(parseTask)
}

export default {
  getTasks,
  getTaskDetails,
  createTask,
  updateTask,
  deleteTask,
  filterTasks
}
