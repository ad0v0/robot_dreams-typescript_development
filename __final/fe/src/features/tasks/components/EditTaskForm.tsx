import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import type { Task } from '../types'
import { getTaskDetails, updateTask } from '../api'
import TaskSchema from '../../../shared/schemas/task.schema'
import type { TaskFormData } from '../../../shared/schemas/task.schema'
import { getErrorMessage } from '../../../shared/utils/utils'

type Props = {
  id: string
  onUpdated?: () => void
}

export default function EditTaskForm({ id, onUpdated }: Props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    mode: 'onChange'
  })

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(''), 2000)
  }

  useEffect(() => {
    async function loadTask() {
      try {
        setLoading(true)
        const data: Task = await getTaskDetails(id)
        reset({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          deadline: data.deadline ? new Date(data.deadline).toISOString().slice(0, 10) : ''
        })
      } catch (error) {
        showToast('Failed to load task: ' + getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    loadTask()
  }, [id, reset])

  const onSubmit = async (data: TaskFormData) => {
    try {
      await updateTask(id, {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        deadline: new Date(data.deadline),
      })
      showToast('Task updated')
      onUpdated?.()
      navigate('/tasks')
    } catch (error) {
      console.error('Update failed: ', getErrorMessage(error))
      showToast('Error while updating')
    }
  }

  if (loading) {
    return (
      <p>Loading task...</p>
    )
  }

  return (
    <>
      {toast && (
        <div className="toast">{toast}</div>
      )}

      <section className="form">
        <h2>Update the task...</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>
            Title *
            <input {...register('title')} />
          </label>
          {errors.title && <p className="error">{errors.title.message}</p>}

          <label>
            Description
            <input {...register('description')} />
          </label>
          {errors.description && <p className="error">{errors.description?.message}</p>}

          <label>
            Status *
            <select {...register('status')}>
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="review">review</option>
              <option value="done">done</option>
            </select>
          </label>

          <label>
            Priority *
            <select {...register('priority')}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>

          <label>
            Deadline *
            <input {...register('deadline')} type="date" />
          </label>
          {errors.deadline && <p className="error">{errors.deadline.message}</p>}

          <div className="form-actions">
            <button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
