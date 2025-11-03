import { useEffect, useState } from 'react'

import { getTasks, deleteTask, updateTask } from '../api'
import type { Task } from '../dto/Task'
import { formatDate, getErrorMessage } from '../utils/utils'

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  async function handleDeleteTask(id) {
    const confirmed = window.confirm('I assure you we don\'t need it...')

    if (!confirmed) {
      return
    }

    await deleteTask(id)
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  async function handleToggleStatus(currentTask) {
    const newStatus = currentTask.status === 'done' ? 'todo' : 'done'
    const updatedTask = await updateTask(currentTask.id, { status: newStatus })

    setTasks((prevTasks) => prevTasks.map((task) => (
      task.id === currentTask.id ? updatedTask : task
    )))
  }

  useEffect(() => {
    async function loadTasks() {
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

    loadTasks()
  }, [])

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  if (error) {
    return (
      <p style={{ color: "red" }}>{error}</p>
    )
  }

  return (
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
                <button onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default Tasks
