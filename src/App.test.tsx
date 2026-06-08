import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders inventory layout and add action', async () => {
    render(<App />)

    expect(
      await screen.findByRole('button', { name: /add new skeinventory/i })
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: /filters/i })
    ).toBeInTheDocument()
  })

  it('prevents invalid submit and shows inline errors', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      await screen.findByRole('button', { name: /add new skeinventory/i })
    )
    await user.click(screen.getByRole('button', { name: /add skeinventory/i }))

    expect(screen.getByText(/maker is required/i)).toBeInTheDocument()
    expect(screen.getByText(/yarn name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/material type is required/i)).toBeInTheDocument()
  })

  it('creates a record and closes modal on valid submit', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      await screen.findByRole('button', { name: /add new skeinventory/i })
    )
    await user.type(screen.getByLabelText(/maker/i), 'Test Maker')
    await user.type(screen.getByLabelText(/yarn name/i), 'Test Yarn')
    await user.clear(screen.getByLabelText(/yardage/i))
    await user.type(screen.getByLabelText(/yardage/i), '300')
    await user.clear(screen.getByLabelText(/meters/i))
    await user.type(screen.getByLabelText(/meters/i), '274')
    await user.clear(screen.getByLabelText(/grams/i))
    await user.type(screen.getByLabelText(/grams/i), '100')
    await user.type(screen.getByLabelText(/material type/i), 'Wool')
    await user.clear(screen.getByLabelText(/quantity in stock/i))
    await user.type(screen.getByLabelText(/quantity in stock/i), '2')
    await user.click(screen.getByRole('button', { name: /add skeinventory/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Test Maker')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/added successfully/i)
  })
})
