import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import CheckableListItem from './CheckableListItem'
import DraggableListItem from './DraggableListItem'
import type { Comida } from '../../types/schemas'

// Test wrapper to provide Chakra context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    {children}
  </ChakraProvider>
)

// Helper to render with Chakra context
const renderWithChakra = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper })
}

// Test that dependency injection allows pure component testing without context
describe('Dependency Injection - Component Isolation Tests', () => {
  const mockMeal: Comida = {
    id: 'meal-1',
    title: 'Test Meal',
    completed: false,
    order: 0
  }

  describe('CheckableListItem - Pure Component Tests', () => {
    it('renders meal title and completion status', () => {
      renderWithChakra(
        <CheckableListItem meal={mockMeal} />
      )

      expect(screen.getByText('Test Meal')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('calls onToggleComplete when checkbox is clicked', async () => {
      const mockToggle = vi.fn().mockResolvedValue(undefined)
      
      renderWithChakra(
        <CheckableListItem 
          meal={mockMeal} 
          onToggleComplete={mockToggle}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(mockToggle).toHaveBeenCalledWith(mockMeal)
      })
    })

    it('calls onDelete when delete button is clicked', async () => {
      const mockDelete = vi.fn().mockResolvedValue(undefined)
      
      renderWithChakra(
        <CheckableListItem 
          meal={mockMeal} 
          showDelete={true}
          onDelete={mockDelete}
        />
      )

      // Mock window.confirm to return true
      const originalConfirm = window.confirm
      window.confirm = vi.fn().mockReturnValue(true)

      const deleteButton = screen.getByRole('button', { name: /delete meal/i })
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith(mockMeal)
      })

      // Restore window.confirm
      window.confirm = originalConfirm
    })

    it('calls onEdit when meal text is clicked', () => {
      const mockEdit = vi.fn()
      
      renderWithChakra(
        <CheckableListItem 
          meal={mockMeal} 
          onEdit={mockEdit}
        />
      )

      const mealText = screen.getByText('Test Meal')
      fireEvent.click(mealText)

      expect(mockEdit).toHaveBeenCalledWith(mockMeal)
    })

    it('renders completed meal with strikethrough style', () => {
      const completedMeal = { ...mockMeal, completed: true }
      
      renderWithChakra(
        <CheckableListItem meal={completedMeal} />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      
      const mealText = screen.getByText('Test Meal')
      expect(mealText).toHaveStyle('text-decoration: line-through')
    })

    it('shows disabled checkbox when no onToggleComplete provided', () => {
      renderWithChakra(
        <CheckableListItem meal={mockMeal} />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })

    it('hides delete button when showDelete is false or no onDelete provided', () => {
      renderWithChakra(
        <CheckableListItem 
          meal={mockMeal} 
          showDelete={true}
          // No onDelete prop
        />
      )

      expect(screen.queryByRole('button', { name: /delete meal/i })).not.toBeInTheDocument()
    })

    it('displays meal notes when present', () => {
      const mealWithNotes = { ...mockMeal, notes: 'Special instructions' }
      
      renderWithChakra(
        <CheckableListItem meal={mealWithNotes} />
      )

      expect(screen.getByText('Special instructions')).toBeInTheDocument()
    })

    it('displays assigned person when present', () => {
      const assignedMeal = { ...mockMeal, assignedTo: 'John Doe' }
      
      renderWithChakra(
        <CheckableListItem meal={assignedMeal} />
      )

      // Look for the translated key that contains the interpolation
      expect(screen.getByText(/assigned to:/i)).toBeInTheDocument()
    })
  })

  describe('DraggableListItem - Pure Component Tests', () => {
    const mockCallbacks = {
      onToggleComplete: vi.fn().mockResolvedValue(undefined),
      onDelete: vi.fn().mockResolvedValue(undefined),
      onReorder: vi.fn().mockResolvedValue(undefined),
      onEdit: vi.fn()
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders drag handle and meal content', () => {
      renderWithChakra(
        <DraggableListItem 
          meal={mockMeal}
          currentIndex={0}
          totalItems={3}
          {...mockCallbacks}
        />
      )

      expect(screen.getByRole('button', { name: /drag to reorder/i })).toBeInTheDocument()
      expect(screen.getByText('Test Meal')).toBeInTheDocument()
    })

    it('passes callbacks to CheckableListItem', async () => {
      renderWithChakra(
        <DraggableListItem 
          meal={mockMeal}
          showDelete={true}
          currentIndex={0}
          totalItems={3}
          {...mockCallbacks}
        />
      )

      // Test toggle callback
      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(mockCallbacks.onToggleComplete).toHaveBeenCalledWith(mockMeal)
      })
    })

    it('handles keyboard navigation for reordering', async () => {
      renderWithChakra(
        <DraggableListItem 
          meal={mockMeal}
          currentIndex={1}
          totalItems={3}
          {...mockCallbacks}
        />
      )

      const dragHandle = screen.getByRole('button', { name: /drag to reorder/i })
      
      // Test Arrow Up - should move from index 1 to 0
      fireEvent.keyDown(dragHandle, { key: 'ArrowUp' })

      await waitFor(() => {
        expect(mockCallbacks.onReorder).toHaveBeenCalledWith(1, 0)
      })

      vi.clearAllMocks()

      // Test Arrow Down - should move from index 1 to 2
      fireEvent.keyDown(dragHandle, { key: 'ArrowDown' })

      await waitFor(() => {
        expect(mockCallbacks.onReorder).toHaveBeenCalledWith(1, 2)
      })
    })

    it('prevents reordering when at boundaries', async () => {
      const { rerender } = renderWithChakra(
        <DraggableListItem 
          meal={mockMeal}
          currentIndex={0}
          totalItems={3}
          {...mockCallbacks}
        />
      )

      const dragHandle = screen.getByRole('button', { name: /drag to reorder/i })
      
      // At first position, Arrow Up should not trigger reorder
      fireEvent.keyDown(dragHandle, { key: 'ArrowUp' })

      await waitFor(() => {
        expect(mockCallbacks.onReorder).not.toHaveBeenCalled()
      })

      // Test last position
      rerender(
        <TestWrapper>
          <DraggableListItem 
            meal={mockMeal}
            currentIndex={2}
            totalItems={3}
            {...mockCallbacks}
          />
        </TestWrapper>
      )

      // At last position, Arrow Down should not trigger reorder
      fireEvent.keyDown(dragHandle, { key: 'ArrowDown' })

      await waitFor(() => {
        expect(mockCallbacks.onReorder).not.toHaveBeenCalled()
      })
    })

    it('handles missing onReorder callback gracefully', () => {
      renderWithChakra(
        <DraggableListItem 
          meal={mockMeal}
          currentIndex={1}
          totalItems={3}
          // No onReorder callback
          onToggleComplete={mockCallbacks.onToggleComplete}
          onDelete={mockCallbacks.onDelete}
        />
      )

      const dragHandle = screen.getByRole('button', { name: /drag to reorder/i })
      
      // Should not crash when no callback provided
      expect(() => {
        fireEvent.keyDown(dragHandle, { key: 'ArrowUp' })
      }).not.toThrow()
    })
  })

  describe('Component Integration Tests', () => {
    it('demonstrates full meal interaction workflow', async () => {
      const callbacks = {
        onToggleComplete: vi.fn().mockResolvedValue(undefined),
        onDelete: vi.fn().mockResolvedValue(undefined),
        onEdit: vi.fn(),
        onReorder: vi.fn().mockResolvedValue(undefined)
      }

      renderWithChakra(
        <DraggableListItem 
          meal={mockMeal}
          showDelete={true}
          currentIndex={1}
          totalItems={3}
          {...callbacks}
        />
      )

      // 1. Edit meal
      const mealText = screen.getByText('Test Meal')
      fireEvent.click(mealText)
      expect(callbacks.onEdit).toHaveBeenCalledWith(mockMeal)

      // 2. Toggle completion
      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)
      await waitFor(() => {
        expect(callbacks.onToggleComplete).toHaveBeenCalledWith(mockMeal)
      })

      // 3. Reorder meal
      const dragHandle = screen.getByRole('button', { name: /drag to reorder/i })
      fireEvent.keyDown(dragHandle, { key: 'ArrowUp' })
      await waitFor(() => {
        expect(callbacks.onReorder).toHaveBeenCalledWith(1, 0)
      })

      // 4. Delete meal
      window.confirm = vi.fn().mockReturnValue(true)
      const deleteButton = screen.getByRole('button', { name: /delete meal/i })
      fireEvent.click(deleteButton)
      await waitFor(() => {
        expect(callbacks.onDelete).toHaveBeenCalledWith(mockMeal)
      })
    })

    it('works in read-only mode without callbacks', () => {
      renderWithChakra(
        <DraggableListItem 
          meal={mockMeal}
          showDelete={false}
          currentIndex={0}
          totalItems={1}
          // No callbacks - read-only mode
        />
      )

      // Should render without errors
      expect(screen.getByText('Test Meal')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeDisabled()
      expect(screen.queryByRole('button', { name: /delete meal/i })).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles async errors in callbacks gracefully', async () => {
      const errorCallback = vi.fn().mockRejectedValue(new Error('Network error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      renderWithChakra(
        <CheckableListItem 
          meal={mockMeal} 
          onToggleComplete={errorCallback}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(errorCallback).toHaveBeenCalled()
        expect(consoleSpy).toHaveBeenCalledWith('Failed to toggle meal completion:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })
})
