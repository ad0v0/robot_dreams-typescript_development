import type { Task, TaskFilter } from './dto/Task'

import { TaskController } from './modules/tasks/task.controller'

const taskController = new TaskController()

function getTaskDetails(id: string): string {
  const task = taskController.getTaskDetails(id)

  if (!task) return ''

  return (`
    id: ${task.id},
    title: ${task.title},
    description: ${task.description},
    createdAt: ${new Date(task.createdAt).toLocaleString('en-US')},
    status: ${task.status},
    priority: ${task.priority},
    deadline: ${new Date(task.deadline).toLocaleString('en-US')}
  `)
}

function createNewTask(task: Task): Task[] {
  return taskController.createTask(task)
}

function updateTaskDetails(id: string, taskDetails: Partial<Task>): Task | undefined {
  return taskController.updateTask(id, taskDetails)
}

function filterTasks(filter: TaskFilter): Task[] {
  return taskController.filterTasks(filter)
}

function deleteTask(id: string): boolean {
  return taskController.deleteTask(id)
}

function checkTaskForCompletionBeforeDeadline(id: string): boolean {
  return taskController.checkTaskForCompletionBeforeDeadline(id)
}

console.log('Task details:', getTaskDetails('id_1'))
console.log('Task with id_2 was deleted:', deleteTask('id_2'))
console.log(
  'New task was created, here is the updated list with the tasks:',
  createNewTask({
    id: 'id_11',
    title: 'Secret mission',
    description: 'Find a hidden spot in the house and take a stealthy nap to recharge before midnight zoomies.',
    createdAt: new Date('2025-10-02T21:00:00Z'),
    status: 'in_progress',
    priority: 'high',
    deadline: new Date('2025-10-02T22:30:00Z'),
  })
)
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
