import { useDroppable } from '@dnd-kit/core'

import type { Task } from '../types'
import BoardTask from './BoardTask'

type ColumnProps = {
  statusKey: Task['status']
  label: string
  tasks: Task[]
  onQuickMove: (taskId: string, newStatus: Task['status']) => void
  onDelete: (id: string) => void
}

function BoardColumn({ statusKey, label, tasks, onQuickMove, onDelete }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: statusKey })

  return (
    <div ref={setNodeRef} className="column" data-status={statusKey} aria-label={label}>
      <h3>
        {label} ({tasks.length})
      </h3>

      <div className="column-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <BoardTask
              key={task.id}
              task={task}
              onQuickMove={onQuickMove}
              onDelete={() => onDelete(task.id)}
            />
          ))
        ) : (
          <p className="empty">—</p>
        )}
      </div>
    </div>
  )
}

export default BoardColumn
