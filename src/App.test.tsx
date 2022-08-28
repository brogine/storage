import { screen } from '@testing-library/react'
import { renderWithProviders } from './testUtils'
import App from './App'

describe('Main Application', () => {
  test('renders application with all the structure', () => {
    renderWithProviders(<App />)

    expect(screen.getByText(/^Key-Value storage$/)).toBeVisible()
    expect(screen.getByPlaceholderText(/^Write a command$/)).toBeVisible()
    expect(screen.getByText(/^Submit$/)).toBeDisabled()
    expect(screen.getByText(/^Command History$/)).toBeVisible()
  })
})
