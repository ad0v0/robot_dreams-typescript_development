import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CreateTaskForm from '../components/CreateTaskForm'

vi.mock('../api', () => ({
  createTask: vi.fn(),
}))

describe('CreateTaskForm', () => {
  beforeAll(() => {
    globalThis.alert = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Submit button disabled when form is empty', () => {
    render(<CreateTaskForm />)

    const submit = screen.getByRole('button', { name: /create task/i })
    expect(submit).toBeDisabled()
  })

  test('Submit button enabled when form is valid', async () => {
    render(<CreateTaskForm />)

    const user = userEvent.setup()
    const titleInput = screen.getByLabelText(/name \*/i)
    expect(titleInput).toBeInTheDocument()

    const submit = screen.getByRole('button', { name: /create task/i })
    expect(submit).toBeDisabled()

    await user.type(titleInput, 'Valid title')

    await waitFor(() => expect(submit).toBeEnabled())
  })

  test('Shows validation error for short title and prevents submit', async () => {
    render(<CreateTaskForm />)

    const user = userEvent.setup()
    const titleInput = screen.getByLabelText(/name \*/i)
    await user.type(titleInput, 'abc')
    await user.tab()

    expect(await screen.findByText(/Title is required and must contain at least 4 characters/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create task/i })).toBeDisabled()
  })
})
