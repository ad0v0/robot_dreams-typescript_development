import { useDraggable } from '@dnd-kit/core'
import { Link } from 'react-router-dom'

import { formatDate } from '../../../shared/utils/utils'
import { STATUSES } from '../../../shared/constants/constants'
import type { Task } from '../types'

type DraggableTaskProps = {
  task: Task
  onQuickMove: (taskId: string, newStatus: Task['status']) => void
  onDelete: () => void
}

function BoardTask({ task, onQuickMove, onDelete }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.9 : 1,
  } as React.CSSProperties

  return (
    <div ref={setNodeRef} style={style} className="task-card" {...attributes} {...listeners}>
      <div className="ask-card-header">
        <Link to={`/tasks/${encodeURIComponent(task.id)}`}>{task.title}</Link>
        <br />
        <small>Priority: {task.priority}</small>
      </div>

      <div className="task-card-body">
        <small>{task.description}</small>
        <div className="metadata">
          <span>Created: {formatDate(task.createdAt)}</span>
          <br />
          <span>Due date: {task.deadline ? formatDate(task.deadline) : '—'}</span>
        </div>
      </div>

      <div className="task-card-actions">
        <div className="status-controls">
          {STATUSES.map((target) =>
            target.key !== task.status ? (
              <button
                key={target.key}
                className="small"
                onClick={() => onQuickMove(task.id, target.key)}
                title={`Move to ${target.label}`}
              >
                Move to {target.label}
              </button>
            ) : null
          )}
        </div>

        <div className="controls">
          <Link to={`/tasks/${encodeURIComponent(task.id)}/edit`}>
            <button className="small">Edit</button>
          </Link>

          <button className="small" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default BoardTask
