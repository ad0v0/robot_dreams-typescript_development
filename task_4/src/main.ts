import './style.css'
import { getTasks, createTask, updateTask, deleteTask } from './api'
import type { Task, CreateTaskPayload } from './dto/Task'
import { DEFAULT_PRIORITY, DEFAULT_STATUS } from './constants/constants'

const tasksListElement = document.getElementById('tasksList') as HTMLDivElement
const createForm = document.getElementById('createForm') as HTMLFormElement

// TODO: make all statuses handling
// TODO: add change priority/deadline/title/description edit
// TODO: add sorting and filtering buttons

function formatDate(date?: Date | string): string {
  if (!date) return '—'

  return new Date(date).toLocaleString()
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function createTaskItem(task: Task): HTMLDivElement {
  const element = document.createElement('div')
  element.className = 'task'
  element.dataset.id = task.id

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
  toggleButton.className = 'toggle-button'
  toggleButton.textContent = task.status === 'done' ? 'Mark as todo' : 'Mark as done'

  const deleteButton = document.createElement('button')
  deleteButton.className = 'delete-button'
  deleteButton.textContent = 'Delete'

  controls.appendChild(toggleButton)
  controls.appendChild(deleteButton)
  element.appendChild(controls)

  return element
}

tasksListElement.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement
  const taskElement = target.closest('.task') as HTMLDivElement | null
  if (!taskElement) return

  const taskId = taskElement.dataset.id
  if (!taskId) return

  try {
    if (target.matches('.toggle-button')) {
      const statusSpan = taskElement.querySelector('.status') as HTMLSpanElement
      const currentStatus = statusSpan.textContent as 'todo' | 'done'

      target.setAttribute('disabled', 'true')
      const newStatus = currentStatus === 'done' ? 'todo' : 'done'
      await updateTask(taskId, { status: newStatus })
      await renderTasks()
    }

    if (target.matches('.delete-button')) {
      if (!confirm('Delete the task?')) return

      target.setAttribute('disabled', 'true')
      await deleteTask(taskId)
      await renderTasks()
    }
  } catch (error) {
    alert('Action failed due to: ' + getErrorMessage(error))
    target.removeAttribute('disabled')
  }
})

export async function renderTasks(): Promise<void> {
  tasksListElement.innerHTML = 'Loading tasks...'
  try {
    const tasks = await getTasks()
    tasks.sort((prevTask, nextTask) => {
      const prevTaskTime = new Date(prevTask.createdAt).getTime()
      const nextTaskTime = new Date(nextTask.createdAt).getTime()
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

  const formData = Object.fromEntries(new FormData(createForm).entries()) as Record<string, string>

  if (!formData.title) return alert('Title is required')

  let deadline: Date
  if (formData.deadline) {
    const [year, month, day] = formData.deadline.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
    deadline = new Date(date.toISOString())
  } else {
    deadline = new Date()
  }

  const payload: CreateTaskPayload = {
    title: formData.title,
    description: formData.description,
    status: formData.status as Task['status'] || DEFAULT_STATUS,
    priority: formData.priority as Task['priority'] || DEFAULT_PRIORITY,
    deadline
  }

  const submitButton = createForm.querySelector('button[type="submit"]') as HTMLButtonElement | null
  if (!submitButton) throw new Error('Submit button not found')
  submitButton.disabled = true

  try {
    await createTask(payload)
    createForm.reset()
    await renderTasks()
  } catch (error) {
    alert('Failed creating task due to: ' + getErrorMessage(error))
  } finally {
    submitButton.disabled = false
  }
})

renderTasks().catch((error) => {
  tasksListElement.textContent = 'Error: ' + getErrorMessage(error)
})
