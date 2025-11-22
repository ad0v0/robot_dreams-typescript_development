import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getTasks, deleteTask, updateTask } from '../api'
import type { Task } from '../types'
import { formatDate, getErrorMessage } from '../../../shared/utils/utils'

const STATUSES: { key: string; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
]

function Tasks() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [toast, setToast] = useState<string>('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(''), 2000)
  }

  async function loadTasks(): Promise<void> {
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      setError('Failed to load tasks due to: ' + getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function handleDeleteConfirmed(id: string | null) {
    try {
      if (!id) return
      await deleteTask(id)
      showToast('Task deleted')

      loadTasks()

      // setTasks((prevTask) => prevTask.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Failed to delete task:', getErrorMessage(error))
      showToast('Error while deleting task')
    } finally {
      setConfirmId(null)
    }
  }

  async function changeStatus(taskId: string, newStatus: Task['status']) {
    try {
      await updateTask(taskId, { status: newStatus })
      showToast('Status updated')
      loadTasks()

      // setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    } catch (error) {
      console.error('Failed to update status: ', getErrorMessage(error))
      showToast('Failed to update status')
    }
  }

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  if (error) {
    return (
      <p className="error">{error}</p>
    )
  }

  const groupedTasks = STATUSES.reduce<Record<string, Task[]>>((acc, status) => {
    acc[status.key] = tasks.filter((task) => task.status === status.key)
    return acc
  }, {} as Record<string, Task[]>)

  return (
    <>
      {toast && (
        <div className="toast">{toast}</div>
      )}

      {confirmId && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this task?</p>

            <div className="modal-actions">
              <button onClick={() => handleDeleteConfirmed(confirmId)}>Yes</button>
              <button onClick={() => setConfirmId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <section className="board">
        <div className="board-header">
          <h2>On my plate...</h2>
          <div>
            <button onClick={() => navigate('/tasks/create')}>Create task</button>
          </div>
        </div>

        <div className="columns">
          {STATUSES.map((status) => (
            <div key={status.key} className="column">
              <h3>{status.label} ({groupedTasks[status.key]?.length ?? 0})</h3>

              <div className="column-list">
                {(groupedTasks[status.key] && groupedTasks[status.key].length > 0) ? (
                  groupedTasks[status.key].map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="ask-card-header">
                        <Link to={`/tasks/${encodeURIComponent(task.id)}`}>{task.title}</Link><br />
                        <small>Priority: {task.priority}</small>
                      </div>

                      <div className="task-card-body">
                        <small>{task.description}</small>
                        <div className="metadata">
                          <span>Created: {formatDate(task.createdAt)}</span><br />
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
                                onClick={() => changeStatus(task.id, target.key)}
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

                          <button className="small" onClick={() => setConfirmId(task.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty">—</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Tasks
