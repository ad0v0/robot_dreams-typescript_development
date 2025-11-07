import { Task } from './task.model'
import type { BugSeverity, TaskDTO } from '../task.types'

export class Bug extends Task {
  severity: BugSeverity

  constructor(task: TaskDTO & { severity: BugSeverity }) {
    super(task)
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
