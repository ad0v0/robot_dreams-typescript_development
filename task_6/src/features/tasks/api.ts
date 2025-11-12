import type { Task, TaskFilter } from './types'

const BASE = 'http://localhost:3000'
const TASKS = `${BASE}/tasks`

async function handleResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`API error: ${response.status} ${response.statusText} ${text ? '- ' + text : ''}`)
  }
  return response.json()
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(TASKS)
  return await handleResponse(response)
}

export async function getTaskDetails(id: string): Promise<Task> {
  const response = await fetch(`${TASKS}/${encodeURIComponent(id)}`)
  return await handleResponse(response)
}

export async function createTask(payload: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const response = await fetch(TASKS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, createdAt: new Date() })
  })
  return await handleResponse(response)
}

export async function updateTask(id: string, partial: Partial<Task>): Promise<Task> {
  const response = await fetch(`${TASKS}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partial)
  })
  return await handleResponse(response)
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
  return await handleResponse(response)
}

export default {
  getTasks,
  getTaskDetails,
  createTask,
  updateTask,
  deleteTask,
  filterTasks
}
