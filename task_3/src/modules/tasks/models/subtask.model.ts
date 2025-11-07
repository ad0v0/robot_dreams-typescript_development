import { Task } from './task.model'
import type { TaskDTO } from '../task.types'

export class Subtask extends Task {
  parentId: string

  constructor(task: TaskDTO & { parentId: string }) {
    super(task)
    this.parentId = task.parentId
  }

  override getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Subtask' as const,
      parentId: this.parentId,
    }
  }
}
