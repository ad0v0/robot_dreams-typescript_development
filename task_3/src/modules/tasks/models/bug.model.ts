import { Task } from './task.model'
import type { Task as TaskDTO } from '../../../dto/Task'
import type { BugSeverity } from '../task.types'

export class Bug extends Task {
  severity: BugSeverity

  constructor(task: TaskDTO & { severity: BugSeverity }) {
    super(task)
    if (!task.severity) throw new Error('severity is required for Bug')
    this.severity = task.severity
  }

  override getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Bug' as const,
      severity: this.severity,
    }
  }
}
