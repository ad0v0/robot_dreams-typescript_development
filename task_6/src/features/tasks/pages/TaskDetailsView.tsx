import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { getTaskDetails } from '../api'
import type { Task } from '../types'
import { formatDate, getErrorMessage } from '../../../shared/utils/utils'

export default function TaskDetailsView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!id) return

    async function load() {
      try {
        setLoading(true)
        const data = await getTaskDetails(id)
        setTask(data)
      } catch (err) {
        setError('Failed to load task: ' + getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <p>Loading task details...</p>
    )
  }

  if (error) {
    return (
      <p style={{ color: 'red' }}>{error}</p>
    )
  }

  if (!task) {
    return (
      <p>Nothing to display</p>
    )
  }

  return (
    <section>
      <button onClick={() => navigate('/tasks')}>Back</button>

      <h2>{task.title}</h2>
      <p><strong>Description:</strong> {task.description ?? '—'}</p>
      <p><strong>Created:</strong> {formatDate(task.createdAt)}</p>
      <p><strong>Deadline:</strong> {task.deadline ? formatDate(task.deadline) : '—'}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
    </section>
  )
}
