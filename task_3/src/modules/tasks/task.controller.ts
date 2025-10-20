import { TaskService } from './task.service'
import type { Task, TaskFilter } from '../../dto/Task'

export class TaskController {
  private service: TaskService

  constructor() {
    this.service = new TaskService()
  }

  getTaskDetails(id: string) {
    return this.service.getTaskDetails(id)
  }

  createTask(task: Task) {
    return this.service.createTask(task)
  }

  updateTask(id: string, updates: Partial<Task>) {
    return this.service.updateTask(id, updates)
  }

  deleteTask(id: string) {
    return this.service.deleteTask(id)
  }

  filterTasks(filter: TaskFilter) {
    return this.service.filterTasks(filter)
  }

  checkTaskForCompletionBeforeDeadline(id: string) {
    return this.service.checkTaskForCompletionBeforeDeadline(id)
  }
}
