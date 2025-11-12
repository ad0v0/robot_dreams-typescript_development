import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import type { Task } from '../types'
import { createTask } from '../api'
import { getErrorMessage } from '../../../shared/utils/utils'
import { TASK_PRIORITIES, TASK_STATUSES } from '../types'
import { DEFAULT_PRIORITY, DEFAULT_STATUS } from '../../../shared/constants/constants'

const TaskSchema = z.object({
  title: z.string().min(4, 'Title is required and must contain at least 4 characters. Why 4? Can you meow?'),
  description: z.string().optional().or(z.literal('')),
  status: z.enum(TASK_STATUSES).default(DEFAULT_STATUS),
  priority: z.enum(TASK_PRIORITIES).default(DEFAULT_PRIORITY),
  deadline: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true
      const chosenDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return chosenDate >= today
    }, 'Deadline should not be a date from the past'),
})

type CreateTaskPayload = Omit<Task, 'id' | 'createdAt'>

type Props = {
  onCreated?: () => void
}

export default function CreateTaskForm({ onCreated }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(TaskSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'low',
      deadline: undefined,
    },
  })

  const onSubmit = async (data: CreateTaskPayload) => {
    const payload = {
      title: data.title,
      description: data.description ? data.description : '',
      status: data.status || DEFAULT_STATUS,
      priority: data.priority || DEFAULT_PRIORITY,
      deadline: data.deadline ? new Date(data.deadline) : new Date()
    }

    try {
      await createTask(payload)
      reset()
      onCreated?.()
      alert('Task created')
    } catch (error) {
      console.error('Failed to create a task due to: ', getErrorMessage(error))
      alert('Failed to create a task due to: ' + getErrorMessage(error))
    }
  }

  return (
    <aside className="form">
      <h2>What will I do next...</h2>

      <form id="createForm" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          Name *
          <input
            {...register('title')}
            type="text"
            className={errors.title ? 'input error' : 'input'}
            aria-invalid={!!errors.title}
            placeholder="For example: Smash your human's face with your paw during their sleep"
          />
        </label>
        {errors.title && (
          <p className="error">{errors.title.message}</p>
        )}

        <label>
          Description
          <input
            {...register('description')}
            type="text"
            className={errors.description ? 'input error' : 'input'}
            placeholder="Details (optional). For example: Don't forget to purr afterwards and ask for hugs"
          />
        </label>
        {/* TODO: come up with the validation for description */}
        {errors.description && (
          <p className="error">{errors.description.message}</p>
        )}

        <label>
          Status
          <select {...register('status')} className="input">
            <option value="todo">todo</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </select>
        </label>

        <label>
          Priority
          <select {...register('priority')} className="input">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>

        <label>
          Deadline
          <input
            {...register('deadline')}
            type="date"
            className={errors.deadline ? 'input error' : 'input'}
            aria-invalid={!!errors.deadline}
          />
        </label>
        {errors.deadline && (
          <p className="error">{errors.deadline.message}</p>
        )}

        <div className="form-actions">
          <button type="submit" className="btn" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Creating task...' : 'Create task'}
          </button>
        </div>
      </form>
    </aside>
  )
}
