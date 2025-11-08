import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Tasks from '../components/Tasks'
import type { Task } from '../types'
import * as api from '../api'

vi.mock('../api', () => ({
  getTasks: vi.fn(),
}))

describe('Tasks', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Render tasks correctly with all fields', async () => {
    const now = new Date()

    const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Test task',
          description: 'Test description',
          createdAt: now,
          status: 'todo',
          priority: 'high',
          deadline: now,
        },
      ]

    ;(api.getTasks).mockResolvedValue(mockTasks)

    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    )

    await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

    expect(screen.getByText('Test task')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('todo')).toHaveClass('status', 'todo')
    expect(screen.getByText(/priority:/i)).toBeInTheDocument()
    expect(screen.getByText(/Created:/i)).toBeInTheDocument()
    expect(screen.getByText(/Deadline:/i)).toBeInTheDocument()
  })

  test('Shows empty state when there are no tasks', async () => {
    ;(api.getTasks).mockResolvedValue([])

    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    )

    await waitFor(() => expect(api.getTasks).toHaveBeenCalled())
    expect(
      screen.getByText(/Denis — the Great Performer\. Everything is done\./i)
    ).toBeInTheDocument()
  })

  test('Shows error message when API fails', async () => {
    ;(api.getTasks).mockRejectedValue(new Error('Network error'))

    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    )

    await waitFor(() => expect(api.getTasks).toHaveBeenCalled())
    expect(await screen.findByText(/Failed to load tasks due to:/i)).toBeInTheDocument()
  })
})
