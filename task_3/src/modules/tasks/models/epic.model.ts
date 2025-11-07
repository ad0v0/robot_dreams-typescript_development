import { Task } from './task.model'
import type { TaskDTO } from '../task.types'

export class Epic extends Task {
  childIds: string[]

  constructor(task: TaskDTO & { childIds?: string[] }) {
    super(task)
    this.childIds = task.childIds ?? []
  }

  override getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Epic' as const,
      childIds: this.childIds,
      childCount: this.childIds.length,
    }
  }
}
