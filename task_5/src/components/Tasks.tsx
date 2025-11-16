import { useEffect, useState } from 'react'

import { getTasks, deleteTask, updateTask } from '../api'
import type { Task } from '../dto/Task'
import { formatDate, getErrorMessage } from '../utils/utils'

function Tasks() {
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

  async function handleDeleteConfirmed(id: string | null) {
    try {
      if (!id) return
      await deleteTask(id)
      showToast('Task deleted')
      loadTasks()
    } catch (err) {
      showToast('Error while deleting task')
    } finally {
      setConfirmId(null)
    }
  }

  async function handleToggleStatus(currentTask: Task): Promise<void> {
    const newStatus = currentTask.status === 'done' ? 'todo' : 'done'

    try {
      await updateTask(currentTask.id, { status: newStatus })
      showToast('Status updated️')
      loadTasks()
    } catch (error) {
      showToast('Failed to update status')
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

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

      <section className="tasks">
        <h2>On my plate...</h2>

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p>Denis — the Great Performer. Everything is done.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task">
                <h3>{task.title}</h3>
                <small>{task.description}</small>

                <div className="task-details">
                  <div>Created: {formatDate(task.createdAt)}</div>
                  <div>Deadline: {task.deadline ? formatDate(task.deadline) : '—'}</div>
                  <div>
                    Status:
                    <span className={`status ${task.status}`}>{task.status}</span> • priority: {task.priority}
                  </div>
                </div>

                <div className="task-controls">
                  <button onClick={() => handleToggleStatus(task)}>
                    {task.status === 'done' ? 'Mark as todo' : 'Mark as done'}
                  </button>

                  <button onClick={() => setConfirmId(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}

export default Tasks
