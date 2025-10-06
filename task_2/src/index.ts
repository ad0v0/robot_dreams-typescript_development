import { validateTasks } from './utils/utils'
import type { Task, TaskFilter } from './dto/Task'

function getTaskDetails(id: string): string {
  const tasks = validateTasks()
  const task = tasks.find((task: Task) => task.id === id)

  if (!task) return ''

  return (`
    id: ${task.id || '—'},
    title: ${task.title || '—'},
    description: ${task.description || '—'},
    createdAt: ${new Date(task.createdAt || new Date()).toLocaleString('en-US')},
    status: ${task.status || '—'},
    priority: ${task.priority || '—'},
    deadline: ${new Date(task.deadline || new Date()).toLocaleString('en-US') || '—'}
  `)
}

function createNewTask(task: Task): Task[] {
  const tasks = validateTasks()
  tasks.push(task)
  return tasks
}

function updateTaskDetails(id: string, taskDetails: Partial<Task>): Task | undefined {
  const tasks = validateTasks()
  const task = tasks.find((task: Task) => task.id === id)

  if (!task) return undefined

  Object.assign(task, taskDetails)
  return task
}

function filterTasks(filter: TaskFilter): Task[] {
  const tasks = validateTasks()

  return tasks.filter((task) => {
    const taskFilteredByStatus = !filter.status || task.status === filter.status
    const taskFilteredByPriority = !filter.status || task.priority === filter.priority
    const taskFilteredByCreatedAt = !filter.createdAt || task.createdAt === filter.createdAt

    return taskFilteredByStatus && taskFilteredByPriority && taskFilteredByCreatedAt
  })
}

function deleteTask(id: string): boolean {
  const tasks = validateTasks()
  const initialTasksAmount = tasks.length
  const filteredTasks = tasks.filter((task: Task) => task.id !== id)
  const afterDeleteTasksAmount = filteredTasks.length
  return afterDeleteTasksAmount !== initialTasksAmount
}

function checkTaskForCompletionBeforeDeadline(id: string): boolean {
  const tasks = validateTasks()
  const task = tasks.find((task: Task) => task.id === id)

  if (!task) return false

  const currentDate = new Date() // HZ what should be here, as we don't have a date of completion
  const taskDeadlineDate = new Date(task.deadline || new Date)

  return task.status === 'done' && currentDate <= taskDeadlineDate
}

console.log('Task details:', getTaskDetails('id_1'))
console.log('Task with id_2 was deleted:', deleteTask('id_2'))
console.log('New task was created, here is the updated list with the tasks:', createNewTask({
  id: 'id_11',
  title: 'Secret mission',
  description: 'Find a hidden spot in the house and take a stealthy nap to recharge before midnight zoomies.',
  createdAt: new Date('2025-10-02T21:00:00Z'),
  status: 'in_progress',
  priority: 'high',
  deadline: new Date('2025-10-02T22:30:00Z')
}))
console.log('Task with updated details:', updateTaskDetails('id_10', { status: 'in_progress' }))
console.log('Task with id_1 was completed before the deadline:', checkTaskForCompletionBeforeDeadline('id_4'))
console.log(
  'Filtered tasks:',
  filterTasks({
    status: 'todo',
    priority: 'high',
    // createdAt: new Date(Date.now())
  })
)