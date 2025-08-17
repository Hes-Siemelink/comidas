import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { I18nextProvider } from 'react-i18next'
import { PlannerProvider } from '../../context/PlannerContext'
import i18n from '../../i18n'
import WeekPlanner from './WeekPlanner'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <PlannerProvider>
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  </PlannerProvider>
)

describe('WeekPlanner Editable Title', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    localStorage.clear()
  })

  it('renders editable week title and allows editing', async () => {
    render(<WeekPlanner />, { wrapper: TestWrapper })

    // Wait for loading to finish and week to be created
    await waitFor(() => {
      expect(screen.getByText(/Create New Comidas Week/i)).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /Create Week/i }))

    // Generated week title should appear (e.g., "Week 8/17/2025")
    await waitFor(() => {
      expect(screen.getByText(/Week \d+\/\d+\/\d+/)).toBeInTheDocument()
    })

    // Enter edit mode by clicking on the title
    const titleElement = screen.getByText(/Week \d+\/\d+\/\d+/)
    fireEvent.click(titleElement)
    
    // Find the title input specifically (by maxLength attribute or value)
    const input = screen.getByDisplayValue(/Week \d+\/\d+\/\d+/)
    fireEvent.change(input, { target: { value: 'Vacation Week' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    // Title should update and persist
    await waitFor(() => {
      expect(screen.getByText('Vacation Week')).toBeInTheDocument()
    })
  })

  it('validates title length and falls back to default if empty', async () => {
    render(<WeekPlanner />, { wrapper: TestWrapper })
    await waitFor(() => {
      expect(screen.getByText(/Create New Comidas Week/i)).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /Create Week/i }))
    
    // Wait for generated week title to appear
    await waitFor(() => {
      expect(screen.getByText(/Week \d+\/\d+\/\d+/)).toBeInTheDocument()
    })
    
    // Store original title for comparison
    const originalTitle = screen.getByText(/Week \d+\/\d+\/\d+/).textContent
    
    // Enter edit mode
    fireEvent.click(screen.getByText(/Week \d+\/\d+\/\d+/))
    const input = screen.getByDisplayValue(/Week \d+\/\d+\/\d+/)
    
    // Test empty title - should revert to original
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    await waitFor(() => {
      expect(screen.getByText(originalTitle!)).toBeInTheDocument()
    })
    
    // Test length limit (max 50 characters)
    fireEvent.click(screen.getByText(originalTitle!))
    const inputAgain = screen.getByDisplayValue(originalTitle!)
    fireEvent.change(inputAgain, { target: { value: 'A'.repeat(60) } })
    fireEvent.keyDown(inputAgain, { key: 'Enter', code: 'Enter' })
    await waitFor(() => {
      expect(screen.getByText('A'.repeat(50))).toBeInTheDocument()
    })
  })
})
