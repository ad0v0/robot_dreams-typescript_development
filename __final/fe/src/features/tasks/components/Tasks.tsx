import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'

import { getTasks, deleteTask, updateTask } from '../api'
import type { Task } from '../types'
import { getErrorMessage } from '../../../shared/utils/utils'
import BoardColumn from './BoardColumn'
import { STATUSES } from '../../../shared/constants/constants'

function Tasks() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [toast, setToast] = useState<string>('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const pointer = useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  const sensors = useSensors(pointer)

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
    } catch (error) {
      console.error('Failed to update status: ', getErrorMessage(error))
      showToast('Failed to update status')
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const draggedId = active.id
    const destStatus = over.id

    const task = tasks.find((task) => task.id === draggedId)

    if (!task) return
    if (task.status === destStatus) return

    const updated = tasks.map((task) => (
      task.id === draggedId ? { ...task, status: destStatus as Task['status'] } : task)
    )
    setTasks(updated)

    try {
      await updateTask(String(draggedId), { status: destStatus as Task['status'] })
      showToast(`Moved to ${destStatus}`)
    } catch (err) {
      console.error('Drag update failed:', getErrorMessage(err))
      showToast('Failed to move task — reverting')
      loadTasks()
    }
  }

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  if (error) {
    return <p className="error">{error}</p>
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
            <p>Are you sure you want to delete this task? This may summon Bagagwa.</p>

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

        {tasks.length === 0 && (
          <h3>Denis — the Great Performer. Everything is done.</h3>
        )}

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="columns">
            {STATUSES.map((status) => (
              <BoardColumn
                key={status.key}
                statusKey={status.key}
                label={status.label}
                tasks={groupedTasks[status.key] ?? []}
                onQuickMove={changeStatus}
                onDelete={(id) => setConfirmId(id)}
              />
            ))}
          </div>
        </DndContext>
      </section>
    </>
  )
}

export default Tasks
