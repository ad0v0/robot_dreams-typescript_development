import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import CreateTaskForm from '../components/CreateTaskForm'

describe('CreateTaskForm', () => {
  it('Submit button is disabled when form is empty', () => {
    render(
      <MemoryRouter>
        <CreateTaskForm />
      </MemoryRouter>
    )

    const submit = screen.getByRole('button', { name: /create task/i })
    expect(submit).toBeDisabled()
  })

  it('Submit button enabled when form is valid', async () => {
    render(
      <MemoryRouter>
        <CreateTaskForm />
      </MemoryRouter>
    )

    const user = userEvent.setup()
    const titleInput = screen.getByLabelText(/title \*/i)
    const descriptionInput = screen.getByLabelText(/description \*/i)
    const deadlineInput = screen.getByLabelText(/deadline \*/i)

    expect(titleInput).toBeInTheDocument()

    const submit = screen.getByRole('button', { name: /create task/i })
    expect(submit).toBeDisabled()

    await user.type(titleInput, 'Example title')
    await user.type(descriptionInput, 'Example description')
    await user.type(deadlineInput, new Date().toISOString())


    await waitFor(() => {
      expect(submit).toBeEnabled()
    })
  })

  it('Shows validation error for short title', async () => {
    render(
      <MemoryRouter>
        <CreateTaskForm />
      </MemoryRouter>
    )

    const user = userEvent.setup()
    const titleInput = screen.getByLabelText(/title \*/i)
    await user.type(titleInput, 'abc')
    await user.tab()

    expect(await screen.findByText(/Title is required and must contain at least 4 characters/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create task/i })).toBeDisabled()
  })
})
