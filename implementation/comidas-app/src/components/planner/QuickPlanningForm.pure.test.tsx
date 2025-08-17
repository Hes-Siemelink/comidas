import { fireEvent, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import QuickPlanningForm from './QuickPlanningForm'
import { renderPureComponent, testDependencyInjection } from '../../test-utils/component-test-helpers'
import { mockWeek, mockQuickPlanningFormProps, resetAllMocks } from '../../test-utils/mock-data'

// This file demonstrates PURE COMPONENT TESTING
// - No context providers needed
// - Tests component interface through props
// - Validates dependency injection patterns
// - Ensures reusability across different contexts

describe('QuickPlanningForm - Pure Component Tests', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  describe('Rendering and Props Interface', () => {
    it('renders with minimal required props', () => {
      renderPureComponent(
        <QuickPlanningForm 
          week={mockWeek} 
          onAddMeal={vi.fn()} 
        />
      )
      
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('displays custom placeholder when provided', () => {
      const customPlaceholder = 'Add your delicious meal...'
      
      renderPureComponent(
        <QuickPlanningForm 
          week={mockWeek} 
          onAddMeal={vi.fn()} 
          placeholder={customPlaceholder}
        />
      )
      
      expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument()
    })

    it('shows help text for meal entry', () => {
      renderPureComponent(
        <QuickPlanningForm 
          week={mockWeek} 
          onAddMeal={vi.fn()} 
        />
      )
      
      expect(screen.getByText(/Type a meal name and press Enter to add/i)).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('calls onAddMeal when form is submitted with valid input', async () => {
      const mockOnAddMeal = vi.fn().mockResolvedValue(undefined)
      
      renderPureComponent(
        <QuickPlanningForm 
          week={mockWeek} 
          onAddMeal={mockOnAddMeal} 
        />
      )
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'Spaghetti Carbonara' } })
      fireEvent.submit(input.closest('form')!)
      
      await waitFor(() => {
        expect(mockOnAddMeal).toHaveBeenCalledWith('Spaghetti Carbonara')
      })
    })

    it('clears input after successful submission', async () => {
      const mockOnAddMeal = vi.fn().mockResolvedValue(undefined)
      
      renderPureComponent(
        <QuickPlanningForm 
          week={mockWeek} 
          onAddMeal={mockOnAddMeal} 
        />
      )
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Tacos' } })
      fireEvent.submit(input.closest('form')!)
      
      await waitFor(() => {
        expect(input.value).toBe('')
      })
    })

    it('calls onComplete callback when provided', async () => {
      const mockOnAddMeal = vi.fn().mockResolvedValue(undefined)
      const mockOnComplete = vi.fn()
      
      renderPureComponent(
        <QuickPlanningForm 
          week={mockWeek} 
          onAddMeal={mockOnAddMeal}
          onComplete={mockOnComplete}
        />
      )
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'Pizza' } })
      fireEvent.submit(input.closest('form')!)
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled()
      })
    })

    it('trims whitespace from input', async () => {
      const mockOnAddMeal = vi.fn().mockResolvedValue(undefined)
      
      renderPureComponent(
        <QuickPlanningForm 
          week={mockWeek} 
          onAddMeal={mockOnAddMeal} 
        />
      )
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '  Burger   ' } })
      fireEvent.submit(input.closest('form')!)
      
      await waitFor(() => {
        expect(mockOnAddMeal).toHaveBeenCalledWith('Burger')
      })
    })

    it('ignores empty submissions', async () => {
      const mockOnAddMeal = vi.fn()
      
      renderPureComponent(
        <QuickPlanningForm 
          week={mockWeek} 
          onAddMeal={mockOnAddMeal} 
        />
      )
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.submit(input.closest('form')!)
      
      // Wait a bit to ensure no async calls happen
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockOnAddMeal).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('handles onAddMeal errors gracefully', async () => {
      const mockOnAddMeal = vi.fn().mockRejectedValue(new Error('Network error'))
      
      renderPureComponent(
        <QuickPlanningForm 
          week={mockWeek} 
          onAddMeal={mockOnAddMeal} 
        />
      )
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'Risotto' } })
      
      // Component should handle errors without crashing
      expect(() => {
        fireEvent.submit(input.closest('form')!)
      }).not.toThrow()
    })
  })

  // Architecture validation tests
  testDependencyInjection(
    'QuickPlanningForm',
    <QuickPlanningForm {...mockQuickPlanningFormProps} />,
    ['week', 'onAddMeal']
  )
})
