import { render, screen } from '@testing-library/react'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { vi } from 'vitest'
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
    await user.type(screen.getByLabelText(/^maker \*$/i), 'Test Maker')
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
    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })
    expect(
      within(inventoryList).getByText('Test Maker', { selector: 'p.card-maker' })
    ).toBeInTheDocument()
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
    await user.type(screen.getByLabelText(/^maker \*$/i), 'Image Maker')
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
    await user.clear(screen.getByLabelText(/^maker \*$/i))
    await user.type(screen.getByLabelText(/^maker \*$/i), 'Updated Maker')
    await user.clear(screen.getByLabelText(/yarn name/i))
    await user.type(screen.getByLabelText(/yarn name/i), 'Updated Yarn')
    await user.clear(screen.getByLabelText(/material type/i))
    await user.type(screen.getByLabelText(/material type/i), 'Updated Material')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })
    expect(
      within(inventoryList).getByText('Updated Maker', {
        selector: 'p.card-maker',
      })
    ).toBeInTheDocument()
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

    const riosCard = within(inventoryList)
      .getByRole('heading', { name: /rios/i })
      .closest('article')
    expect(riosCard).not.toBeNull()

    await user.click(
      within(riosCard as HTMLElement).getByRole('button', {
        name: /edit/i,
      })
    )

    await user.clear(screen.getByLabelText(/quantity in stock/i))
    await user.type(screen.getByLabelText(/quantity in stock/i), '2.5')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const updatedCard = within(inventoryList)
      .getByRole('heading', { name: /rios/i })
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

    await user.type(screen.getByLabelText(/^maker \*$/i), 'Maker')
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

    const riosCard = within(inventoryList)
      .getByRole('heading', { name: /rios/i })
      .closest('article')
    expect(riosCard).not.toBeNull()

    await user.click(
      within(riosCard as HTMLElement).getByRole('button', {
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

  it('persists edited hand dyed and superwash states', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })

    const riosHeading = within(inventoryList).getByRole('heading', {
      name: /rios/i,
    })
    const riosCard = riosHeading.closest('article')
    expect(riosCard).not.toBeNull()

    const editButton = within(riosCard as HTMLElement).getByRole('button', {
      name: /edit/i,
    })
    await user.click(editButton)

    await user.click(screen.getByRole('checkbox', { name: /hand dyed/i }))
    await user.click(screen.getByRole('checkbox', { name: /superwash/i }))
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const updatedRiosCard = within(inventoryList)
      .getByRole('heading', { name: /rios/i })
      .closest('article')
    expect(updatedRiosCard).not.toBeNull()
    expect(
      within(updatedRiosCard as HTMLElement).queryByText('Hand Dyed')
    ).not.toBeInTheDocument()
    expect(
      within(updatedRiosCard as HTMLElement).queryByText('Superwash')
    ).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      /updated successfully/i
    )
  })

  it('archives an active record and removes it from the default list', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })

    const riosCard = within(inventoryList)
      .getByRole('heading', { name: /rios/i })
      .closest('article')
    expect(riosCard).not.toBeNull()

    await user.click(
      within(riosCard as HTMLElement).getByRole('button', { name: /archive/i })
    )

    expect(screen.queryByRole('heading', { name: /rios/i })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/archived successfully/i)
  })

  it('restores an archived record and returns it to the active list', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    const inventoryViewToggle = screen.getByRole('group', {
      name: /inventory view/i,
    })
    await user.click(
      within(inventoryViewToggle).getByRole('button', { name: /archived/i })
    )

    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })

    const woolEaseCard = within(inventoryList)
      .getByRole('heading', { name: /wool-ease/i })
      .closest('article')
    expect(woolEaseCard).not.toBeNull()
    expect(
      within(woolEaseCard as HTMLElement).getByLabelText(/archived/i)
    ).toBeInTheDocument()

    await user.click(
      within(woolEaseCard as HTMLElement).getByRole('button', {
        name: /restore/i,
      })
    )

    expect(
      screen.queryByRole('heading', { name: /wool-ease/i })
    ).not.toBeInTheDocument()
    expect(await screen.findByRole('status')).toHaveTextContent(
      /restored successfully/i
    )

    await user.click(
      within(inventoryViewToggle).getByRole('button', { name: /active/i })
    )
    expect(screen.getByRole('heading', { name: /wool-ease/i })).toBeInTheDocument()
  })

  it('filters records as search text is entered and restores on clear', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })

    const searchInput = screen.getByLabelText(/search inventory/i)

    expect(await screen.findByRole('heading', { name: /rios/i })).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: /220 superwash/i })
    ).toBeInTheDocument()

    await user.type(searchInput, 'casc')

    expect(screen.queryByRole('heading', { name: /rios/i })).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /220 superwash/i })
    ).toBeInTheDocument()

    await user.clear(searchInput)

    expect(await screen.findByRole('heading', { name: /rios/i })).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: /220 superwash/i })
    ).toBeInTheDocument()
  })

  it('shows no-results message when search has no matches', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    const searchInput = screen.getByLabelText(/search inventory/i)
    await user.type(searchInput, 'zzzz-not-found')

    expect(screen.getByText('No results match your search')).toBeInTheDocument()
  })

  it('applies search inside archived view', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    const inventoryViewToggle = screen.getByRole('group', {
      name: /inventory view/i,
    })
    await user.click(
      within(inventoryViewToggle).getByRole('button', { name: /archived/i })
    )

    const searchInput = screen.getByLabelText(/search inventory/i)
    await user.type(searchInput, 'blend')

    expect(screen.getByRole('heading', { name: /wool-ease/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /rios/i })).not.toBeInTheDocument()
  })

  it('applies combinable attribute filters and clear restores default active view', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    const worstedCheckbox = screen.getByRole('checkbox', { name: /worsted/i })
    const handDyedGroup = screen.getByRole('group', { name: /^hand dyed$/i })
    const handDyedYes = within(handDyedGroup).getByRole('button', {
      name: /^yes$/i,
    })
    const makerSelect = screen.getByLabelText(/select maker/i)

    await user.click(worstedCheckbox)
    await user.click(handDyedYes)
    await user.selectOptions(makerSelect, 'Malabrigo')

    expect(screen.getByRole('heading', { name: /rios/i })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /220 superwash/i })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear filters/i }))

    expect(screen.getByRole('heading', { name: /rios/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /220 superwash/i })
    ).toBeInTheDocument()
  })

  it('shows no-results message when attribute filters exclude all records', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { name: /rios/i })

    const makerSelect = screen.getByLabelText(/select maker/i)
    const handDyedGroup = screen.getByRole('group', { name: /^hand dyed$/i })
    const handDyedYes = within(handDyedGroup).getByRole('button', {
      name: /^yes$/i,
    })

    await user.selectOptions(makerSelect, 'Cascade')
    await user.click(handDyedYes)

    expect(screen.getByText('No results match your search')).toBeInTheDocument()
  })

  it('applies attribute filters within archived view mode', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { name: /rios/i })

    const inventoryViewToggle = screen.getByRole('group', {
      name: /inventory view/i,
    })
    await user.click(
      within(inventoryViewToggle).getByRole('button', { name: /archived/i })
    )

    const worstedCheckbox = screen.getByRole('checkbox', { name: /worsted/i })
    await user.click(worstedCheckbox)

    expect(screen.getByRole('heading', { name: /wool-ease/i })).toBeInTheDocument()

    await user.click(worstedCheckbox)
    await user.click(screen.getByRole('checkbox', { name: /^dk$/i }))
    expect(screen.getByText('No results match your search')).toBeInTheDocument()
  })

  it('deletes a record after confirmation and removes it from the list', async () => {
    localStorage.clear()

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const user = userEvent.setup()
    render(<App />)

    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })

    const riosCard = within(inventoryList)
      .getByRole('heading', { name: /rios/i })
      .closest('article')
    expect(riosCard).not.toBeNull()

    await user.click(
      within(riosCard as HTMLElement).getByRole('button', {
        name: /delete malabrigo rios/i,
      })
    )

    expect(confirmSpy).toHaveBeenCalled()
    expect(screen.queryByRole('heading', { name: /rios/i })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/deleted successfully/i)

    confirmSpy.mockRestore()
  })

  it('keeps a record when delete confirmation is cancelled', async () => {
    localStorage.clear()

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    const user = userEvent.setup()
    render(<App />)

    const inventoryList = await screen.findByRole('region', {
      name: /yarn inventory list/i,
    })

    const riosCard = within(inventoryList)
      .getByRole('heading', { name: /rios/i })
      .closest('article')
    expect(riosCard).not.toBeNull()

    await user.click(
      within(riosCard as HTMLElement).getByRole('button', {
        name: /delete malabrigo rios/i,
      })
    )

    expect(confirmSpy).toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: /rios/i })).toBeInTheDocument()

    confirmSpy.mockRestore()
  })

  it('persists data across full app restart reload', async () => {
    localStorage.clear()

    const user = userEvent.setup()
    const firstRender = render(<App />)

    await user.click(
      await screen.findByRole('button', { name: /add new skeinventory/i })
    )
    await user.type(screen.getByLabelText(/^maker \*$/i), 'Restart Maker')
    await user.type(screen.getByLabelText(/yarn name/i), 'Restart Yarn')
    await user.type(screen.getByLabelText(/material type/i), 'Wool')
    await user.click(screen.getByRole('button', { name: /add skeinventory/i }))

    expect(screen.getByRole('heading', { name: /restart yarn/i })).toBeInTheDocument()

    firstRender.unmount()

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /restart yarn/i })
    ).toBeInTheDocument()
  })
})
