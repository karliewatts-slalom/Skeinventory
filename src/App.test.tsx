import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the foundation heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /skeinventory foundation ready/i })
    ).toBeInTheDocument()
  })
})
