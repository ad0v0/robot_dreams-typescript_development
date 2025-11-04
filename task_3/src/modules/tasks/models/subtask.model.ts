import { Task } from './task.model'
import type { Task as TaskDTO } from '../../../dto/Task'

export class Subtask extends Task {
  parentId: string

  constructor(task: TaskDTO & { parentId: string }) {
    super(task)
    if (!task.parentId || !task.parentId.trim()) throw new Error('Id cannot be empty for Subtask')
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
