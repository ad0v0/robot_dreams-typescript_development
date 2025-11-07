import { Task } from './task.model'
import type { TaskDTO } from '../task.types'

export class Story extends Task {
  userValue: string

  constructor(task: TaskDTO & { userValue: string }) {
    super(task)
    this.userValue = task.userValue
  }

  override getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Story' as const,
      userValue: this.userValue,
    }
  }
}
