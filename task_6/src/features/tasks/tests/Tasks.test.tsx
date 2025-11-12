import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import Tasks from '../components/Tasks'
import type { Task } from '../types'
import { getTasks } from '../api'

vi.mock('../api', () => ({
  getTasks: vi.fn(),
}))

const mockGetTasks = getTasks as unknown as vi.MockedFunction<typeof getTasks>

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

    mockGetTasks.mockResolvedValueOnce(mockTasks)

    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    )

    await waitFor(() => expect(mockGetTasks).toHaveBeenCalled())

    expect(screen.getByText('Test task')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()

    const statusEl = screen.getByText('todo')
    expect(statusEl).toBeInTheDocument()
    expect(statusEl).toHaveClass('status', 'todo')

    expect(screen.getByText(/priority:/i)).toBeInTheDocument()
    expect(screen.getByText(/Created:/i)).toBeInTheDocument()
    expect(screen.getByText(/Deadline:/i)).toBeInTheDocument()
  })

  test('Shows empty state when there are no tasks', async () => {
    mockGetTasks.mockResolvedValueOnce([])

    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    )

    await waitFor(() => expect(mockGetTasks).toHaveBeenCalled())

    expect(
      screen.getByText(/Denis — the Great Performer\. Everything is done\./i)
    ).toBeInTheDocument()
  })

  test('Shows error message when API fails', async () => {
    mockGetTasks.mockRejectedValueOnce(new Error('Network error'))

    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    )

    await waitFor(() => expect(mockGetTasks).toHaveBeenCalled())

    expect(await screen.findByText(/Failed to load tasks due to:/i)).toBeInTheDocument()
  })
})
