import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import TaskDetailsView from '../pages/TaskDetailsView'
import * as api from '../api'

vi.mock('../api', () => ({
  getTaskDetails: vi.fn(),
}))

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
    const mockTask = { id: '1', title: 'Back test' }
    ;(api.getTaskDetails).mockResolvedValueOnce(mockTask)

    renderTestRouter('1')

    await waitFor(() => expect(api.getTaskDetails).toHaveBeenCalledWith('1'))

    const backBtn = screen.getByRole('button', { name: /back/i })
    await userEvent.click(backBtn)

    await waitFor(() => expect(screen.getByTestId('tasks-page')).toBeInTheDocument())
  })
})
