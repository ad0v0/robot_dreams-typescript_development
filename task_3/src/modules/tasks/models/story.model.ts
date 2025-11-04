import { Task } from './task.model'
import type { Task as TaskDTO } from '../../../dto/Task'

export class Story extends Task {
  userValue: string

  constructor(task: TaskDTO & { userValue: string }) {
    super(task)
    if (!task.userValue || !task.userValue.trim()) throw new Error('userValue is required for Story')
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
