import './style.css'
import * as api from './api'
import type { Task, CreateTaskPayload } from './dto/Task'

const tasksListElement = document.getElementById('tasksList') as HTMLDivElement
const createForm = document.getElementById('createForm') as HTMLFormElement

function formatDate(date?: Date | string): string {
  if (!date) return '—'

  const newDate = date instanceof Date ? date : new Date(date)
  return newDate.toLocaleString()
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function createTaskItem(task: Task): HTMLDivElement {
  const element = document.createElement('div')
  element.className = 'task'

  const title = document.createElement('h3')
  title.textContent = task.title
  element.appendChild(title)

  if (task.description) {
    const description = document.createElement('small')
    description.textContent = task.description
    element.appendChild(description)
  }

  const meta = document.createElement('div')
  meta.className = 'task-details'
  meta.innerHTML = `
    <div>Created: ${formatDate(task.createdAt)}</div>
    <div>Deadline: ${task.deadline ? formatDate(task.deadline) : '—'}</div>
    <div>Status: <span class="status ${task.status}">${task.status}</span> • priority: ${task.priority}</div>
  `
  element.appendChild(meta)

  const controls = document.createElement('div')
  controls.className = 'task-controls'

  const toggleButton = document.createElement('button')
  // TODO: make all statuses handling
  // TODO: add change priority/deadline/title/description edit
  toggleButton.textContent = task.status === 'done' ? 'Mark as todo' : 'Mark as done'

  toggleButton.addEventListener('click', async () => {
    toggleButton.disabled = true
    try {
      const newStatus = task.status === 'done' ? 'todo' : 'done'
      await api.updateTask(task.id, { status: newStatus })
      await renderTasks()
    } catch (error) {
      alert('Could not change status due to: ' + getErrorMessage(error))
    } finally {
      toggleButton.disabled = false
    }
  })

  controls.appendChild(toggleButton)

  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'Delete'
  deleteButton.addEventListener('click', async () => {
    if (!confirm('Delete the task?')) return

    deleteButton.disabled = true

    try {
      await api.deleteTask(task.id)
      await renderTasks()
    } catch (error) {
      alert('Could not delete the task due to: ' + getErrorMessage(error))
      deleteButton.disabled = false
    }
  })
  controls.appendChild(deleteButton)

  element.appendChild(controls)
  return element
}

export async function renderTasks(): Promise<void> {
  tasksListElement.innerHTML = 'Loading tasks...'
  try {
    // TODO: add sorting and filtering buttons
    const tasks = await api.getTasks()
    tasks.sort((prevTask, nextTask) => {
      const prevTaskTime = prevTask.createdAt instanceof Date ? prevTask.createdAt.getTime() : new Date(prevTask.createdAt).getTime()
      const nextTaskTime = nextTask.createdAt instanceof Date ? nextTask.createdAt.getTime() : new Date(nextTask.createdAt).getTime()
      return nextTaskTime - prevTaskTime
    })

    tasksListElement.innerHTML = ''

    if (tasks.length === 0) {
      tasksListElement.textContent = "All done...ZOOMIES TIME"
      return
    }
    tasks.forEach((task) => tasksListElement.appendChild(createTaskItem(task)))
  } catch (error) {
    tasksListElement.textContent = 'Error loading tasks due to: ' + getErrorMessage(error)
  }
}

createForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const data = new FormData(createForm)
  const title = String(data.get('title') || '').trim()
  const description = String(data.get('description') || '').trim()
  const status = String(data.get('status') || 'todo') as Task['status']
  const priority = String(data.get('priority') || 'medium') as Task['priority']
  const deadlineValue = data.get('deadline') as string | null

  if (!title) return alert('Title is required')

  let deadlineDateFormatted: string | undefined = undefined
  if (deadlineValue) {
    const [year, month, day] = deadlineValue.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
    deadlineDateFormatted = date.toISOString()
  }

  const payload: CreateTaskPayload = {
    title,
    description,
    status,
    priority,
    ...(deadlineDateFormatted && { deadline: deadlineDateFormatted }),
  }

  const submitButton = (createForm.querySelector('button[type="submit"]') as HTMLButtonElement | null)

  if (!submitButton) {
    throw new Error('Submit button not found')
  }

  if (submitButton) {
    submitButton.disabled = true
  }

  try {
    await api.createTask(payload)
    createForm.reset()
    await renderTasks()
  } catch (error) {
    alert('Failed creating task due to: ' + getErrorMessage(error))
  } finally {
    if (submitButton) submitButton.disabled = false
  }
})

renderTasks().catch((error) => {
  tasksListElement.textContent = 'Error: ' + getErrorMessage(error)
})
