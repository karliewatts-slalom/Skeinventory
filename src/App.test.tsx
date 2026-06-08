import { render, screen } from '@testing-library/react'
import { within } from '@testing-library/react'
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

  it('persists and displays optional image URL on the yarn card', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    await user.click(
      await screen.findByRole('button', { name: /add new skeinventory/i })
    )
    await user.type(screen.getByLabelText(/image \(optional\)/i), 'https://example.com/rios.jpg')
    await user.type(screen.getByLabelText(/maker/i), 'Image Maker')
    await user.type(screen.getByLabelText(/yarn name/i), 'Image Yarn')
    await user.type(screen.getByLabelText(/material type/i), 'Wool')
    await user.click(screen.getByRole('button', { name: /add skeinventory/i }))

    const image = screen.getByRole('img', { name: /image maker image yarn/i })
    expect(image).toHaveAttribute('src', 'https://example.com/rios.jpg')
  })

  it('edits core detail fields and persists them in list view', async () => {
    const user = userEvent.setup()
    render(<App />)

    const editButtons = await screen.findAllByRole('button', { name: /edit/i })
    expect(editButtons.length).toBeGreaterThan(0)
    await user.click(editButtons[0]!)
    await user.clear(screen.getByLabelText(/maker/i))
    await user.type(screen.getByLabelText(/maker/i), 'Updated Maker')
    await user.clear(screen.getByLabelText(/yarn name/i))
    await user.type(screen.getByLabelText(/yarn name/i), 'Updated Yarn')
    await user.clear(screen.getByLabelText(/material type/i))
    await user.type(screen.getByLabelText(/material type/i), 'Updated Material')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Updated Maker')).toBeInTheDocument()
    expect(screen.getByText('Updated Yarn')).toBeInTheDocument()
    expect(screen.getByText('Updated Material')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      /updated successfully/i
    )
  })

  it('updates quantity and immediately reflects the new value in the UI', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })

    const woolEaseCard = within(inventoryList)
      .getByRole('heading', { name: /wool-ease/i })
      .closest('article')
    expect(woolEaseCard).not.toBeNull()

    await user.click(
      within(woolEaseCard as HTMLElement).getByRole('button', {
        name: /edit/i,
      })
    )

    await user.clear(screen.getByLabelText(/quantity in stock/i))
    await user.type(screen.getByLabelText(/quantity in stock/i), '2.5')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const updatedCard = within(inventoryList)
      .getByRole('heading', { name: /wool-ease/i })
      .closest('article')
    expect(updatedCard).not.toBeNull()
    expect(
      within(updatedCard as HTMLElement).getByText('2.5 skeins')
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      /updated successfully/i
    )
  })

  it('blocks save when negative measurement values are entered', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      await screen.findByRole('button', { name: /add new skeinventory/i })
    )

    await user.type(screen.getByLabelText(/maker/i), 'Maker')
    await user.type(screen.getByLabelText(/yarn name/i), 'Name')
    await user.type(screen.getByLabelText(/material type/i), 'Wool')
    await user.clear(screen.getByLabelText(/yardage/i))
    await user.type(screen.getByLabelText(/yardage/i), '-2')
    await user.click(screen.getByRole('button', { name: /add skeinventory/i }))

    expect(
      screen.getByText(/yardage must be a non-negative number/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('blocks save and shows a validation message for negative quantity', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })

    const woolEaseCard = within(inventoryList)
      .getByRole('heading', { name: /wool-ease/i })
      .closest('article')
    expect(woolEaseCard).not.toBeNull()

    await user.click(
      within(woolEaseCard as HTMLElement).getByRole('button', {
        name: /edit/i,
      })
    )

    await user.clear(screen.getByLabelText(/quantity in stock/i))
    await user.type(screen.getByLabelText(/quantity in stock/i), '-1')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.getByText(/quantity must be a non-negative number/i)).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByText(/please fix the highlighted fields before saving/i)
    ).toBeInTheDocument()
  })

  it('persists and renders edited hand dyed and superwash states', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })

    const woolEaseHeading = within(inventoryList).getByRole('heading', {
      name: /wool-ease/i,
    })
    const woolEaseCard = woolEaseHeading.closest('article')
    expect(woolEaseCard).not.toBeNull()

    const editButton = within(woolEaseCard as HTMLElement).getByRole('button', {
      name: /edit/i,
    })
    await user.click(editButton)

    await user.click(screen.getByRole('checkbox', { name: /hand dyed/i }))
    await user.click(screen.getByRole('checkbox', { name: /superwash/i }))
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const updatedWoolEaseCard = within(inventoryList)
      .getByRole('heading', { name: /wool-ease/i })
      .closest('article')
    expect(updatedWoolEaseCard).not.toBeNull()
    expect(
      within(updatedWoolEaseCard as HTMLElement).getByText('Hand Dyed')
    ).toBeInTheDocument()
    expect(
      within(updatedWoolEaseCard as HTMLElement).getByText('Superwash')
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      /updated successfully/i
    )
  })
})
