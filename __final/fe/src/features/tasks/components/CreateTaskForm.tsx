import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

import type { Task } from '../types'
import { createTask } from '../api'
import { getErrorMessage } from '../../../shared/utils/utils'
import TaskSchema from '../../../shared/schemas/task.schema'
import type { TaskFormData } from '../../../shared/schemas/task.schema'

type CreateTaskPayload = Omit<Task, 'id' | 'createdAt'>

type Props = {
  onCreated?: () => void
}

export default function CreateTaskForm({ onCreated }: Props) {
  const [toast, setToast] = useState<string>('')

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

  const onSubmit = async (data: TaskFormData) => {
    const payload: CreateTaskPayload = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      deadline: new Date(data.deadline),
    }

    try {
      await createTask(payload)
      reset()
      onCreated?.()
      showToast('Task created')
    } catch (error) {
      console.error('Failed to create a task due to: ', getErrorMessage(error))
      showToast('Error while creating task')
    }
  }

  return (
    <>
      {toast && (
        <div className="toast">{toast}</div>
      )}

      <section className="form">
        <h2>What will I do next...</h2>

        <form id="createForm" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>
            Title *
            <input
              {...register('title')}
              type="text"
              className={errors.title ? 'input error' : 'input'}
              aria-invalid={!!errors.title}
              placeholder="For example: Smash your human's face with your paw during their sleep"
            />
          </label>
          {errors.title && <p className="error">{errors.title.message}</p>}

          <label>
            Description *
            <input
              {...register('description')}
              type="text"
              className={errors.description ? 'input error' : 'input'}
              placeholder="Details (optional). For example: Don't forget to purr afterwards and ask for hugs"
            />
          </label>
          {errors.description && <p className="error">{errors.description.message}</p>}

          <label>
            Status *
            <select {...register('status')} className="input">
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="review">review</option>
              <option value="done">done</option>
            </select>
          </label>

          <label>
            Priority *
            <select {...register('priority')} className="input">
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>

          <label>
            Deadline *
            <input
              {...register('deadline')}
              type="date"
              className={errors.deadline ? 'input error' : 'input'}
              aria-invalid={!!errors.deadline}
            />
          </label>
          {errors.deadline && <p className="error">{errors.deadline.message}</p>}

          <div className="form-actions">
            <button type="submit" className="btn" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Creating task...' : 'Create task'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
