import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'

import TaskDetailsView from '../pages/TaskDetailsView'
import type { Task } from '../types'
import { getTaskDetails } from '../api'

vi.mock('../api', () => ({
  getTaskDetails: vi.fn(),
}))

const mockGetTaskDetails = getTaskDetails as unknown as vi.MockedFunction<typeof getTaskDetails>

describe('TaskDetailsView', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  function renderTestRouter(id: string = '1') {
    return render(
      <MemoryRouter initialEntries={[`/tasks/${id}`]}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetailsView />} />
          <Route path="/tasks" element={<div data-testid="tasks-page">Tasks page</div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  test('Navigate back when "Back" button is clicked', async () => {
    const mockTask: Task = {
      id: 'id_1',
      title: 'Test title',
      description: 'Test description',
      createdAt: new Date(),
      status: 'todo',
      priority: 'low',
      deadline: new Date(),
    }

    mockGetTaskDetails.mockResolvedValueOnce(mockTask)

    renderTestRouter('1')

    await waitFor(() => expect(mockGetTaskDetails).toHaveBeenCalledWith('1'))

    const user = userEvent.setup()
    const backBtn = screen.getByRole('button', { name: /back/i })
    await user.click(backBtn)

    await waitFor(() => expect(screen.getByTestId('tasks-page')).toBeInTheDocument())
  })
})
