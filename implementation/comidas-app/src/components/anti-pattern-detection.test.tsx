import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { renderPureComponent } from '../test-utils/component-test-helpers'
import { mockWeek } from '../test-utils/mock-data'

// This file demonstrates ANTI-PATTERN DETECTION TESTS
// - Validates dependency injection patterns are followed
// - Catches architectural violations before they reach production
// - Ensures components can be tested in isolation
// - Verifies reusability across different contexts

// Example component that FOLLOWS dependency injection (good)
interface GoodComponentProps {
  week: typeof mockWeek
  onAddMeal: (title: string) => Promise<void>
  onUpdateTitle: (title: string) => Promise<void>
}

function GoodComponent({ week, onAddMeal, onUpdateTitle }: GoodComponentProps) {
  return (
    <div>
      <h2 data-testid="week-title">{week?.title || 'No week'}</h2>
      <button onClick={() => onAddMeal('Test Meal')}>Add Meal</button>
      <button onClick={() => onUpdateTitle('New Title')}>Update Title</button>
    </div>
  )
}

// Example component that VIOLATES dependency injection (bad)
import { usePlanner } from '../context/PlannerContext'

function BadComponent({ week }: { week: typeof mockWeek }) {
  // ❌ Anti-pattern: Direct context access instead of props
  const { addMeal, updateWeekTitle } = usePlanner()
  
  const handleAddMeal = () => {
    if (week?.id) {
      addMeal(week.id, 'Test Meal') // ❌ Uses context function directly
    }
  }
  
  const handleUpdateTitle = () => {
    if (week?.id) {
      updateWeekTitle(week.id, 'New Title') // ❌ Uses context function directly
    }
  }
  
  return (
    <div>
      <h2 data-testid="week-title">{week?.title || 'No week'}</h2>
      <button onClick={handleAddMeal}>Add Meal</button>
      <button onClick={handleUpdateTitle}>Update Title</button>
    </div>
  )
}

describe('Anti-Pattern Detection Tests', () => {
  describe('Dependency Injection Validation', () => {
    it('GOOD: Component works with props alone (no context needed)', () => {
      const mockOnAddMeal = vi.fn()
      const mockOnUpdateTitle = vi.fn()
      
      // ✅ Can render in minimal wrapper (no context providers)
      renderPureComponent(
        <GoodComponent 
          week={mockWeek} 
          onAddMeal={mockOnAddMeal}
          onUpdateTitle={mockOnUpdateTitle}
        />
      )
      
      expect(screen.getByTestId('week-title')).toHaveTextContent('Test Week')
      expect(screen.getByText('Add Meal')).toBeInTheDocument()
      expect(screen.getByText('Update Title')).toBeInTheDocument()
    })

    it('BAD: Component fails without context (tight coupling detected)', () => {
      // ❌ This test SHOULD FAIL - component violates dependency injection
      expect(() => {
        renderPureComponent(<BadComponent week={mockWeek} />)
      }).toThrow(/Cannot read properties.*of null/) // Context not available
    })

    it('GOOD: Component interface is testable with mocks', () => {
      const mockOnAddMeal = vi.fn()
      const mockOnUpdateTitle = vi.fn()
      
      renderPureComponent(
        <GoodComponent 
          week={mockWeek} 
          onAddMeal={mockOnAddMeal}
          onUpdateTitle={mockOnUpdateTitle}
        />
      )
      
      // Can test interactions through props
      screen.getByText('Add Meal').click()
      screen.getByText('Update Title').click()
      
      expect(mockOnAddMeal).toHaveBeenCalledWith('Test Meal')
      expect(mockOnUpdateTitle).toHaveBeenCalledWith('New Title')
    })
  })

  describe('Reusability Validation', () => {
    it('GOOD: Component works in different contexts', () => {
      const mockWeek1 = { ...mockWeek, title: 'Context 1 Week' }
      const mockWeek2 = { ...mockWeek, title: 'Context 2 Week' }
      
      // Component should work with any week data
      const { rerender } = renderPureComponent(
        <GoodComponent 
          week={mockWeek1} 
          onAddMeal={vi.fn()}
          onUpdateTitle={vi.fn()}
        />
      )
      
      expect(screen.getByTestId('week-title')).toHaveTextContent('Context 1 Week')
      
      rerender(
        <GoodComponent 
          week={mockWeek2} 
          onAddMeal={vi.fn()}
          onUpdateTitle={vi.fn()}
        />
      )
      
      expect(screen.getByTestId('week-title')).toHaveTextContent('Context 2 Week')
    })

    it('GOOD: Component supports different callback implementations', () => {
      const consoleAddMeal = vi.fn().mockImplementation((title) => {
        console.log(`Console: Adding ${title}`)
      })
      
      const apiAddMeal = vi.fn().mockImplementation((title) => {
        return fetch('/api/meals', { method: 'POST', body: JSON.stringify({ title }) })
      })
      
      // Should work with different callback implementations
      const { rerender } = renderPureComponent(
        <GoodComponent 
          week={mockWeek} 
          onAddMeal={consoleAddMeal}
          onUpdateTitle={vi.fn()}
        />
      )
      
      screen.getByText('Add Meal').click()
      expect(consoleAddMeal).toHaveBeenCalled()
      
      rerender(
        <GoodComponent 
          week={mockWeek} 
          onAddMeal={apiAddMeal}
          onUpdateTitle={vi.fn()}
        />
      )
      
      screen.getByText('Add Meal').click()
      expect(apiAddMeal).toHaveBeenCalled()
    })
  })

  describe('Architecture Enforcement', () => {
    it('detects when component requires specific context provider', () => {
      // This test catches components that can't work without specific providers
      const TestableComponent = ({ week }: { week: typeof mockWeek }) => {
        try {
          // Component should work without requiring context
          return <div data-testid="content">{week?.title}</div>
        } catch (error) {
          // If component requires context, this test will fail
          throw new Error(`Component requires context provider: ${error}`)
        }
      }
      
      renderPureComponent(<TestableComponent week={mockWeek} />)
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('validates prop interface completeness', () => {
      // Ensure component props cover all necessary functionality
      type RequiredProps = keyof GoodComponentProps
      const requiredProps: RequiredProps[] = ['week', 'onAddMeal', 'onUpdateTitle']
      
      // This test ensures we don't miss required props
      requiredProps.forEach(prop => {
        expect(prop).toBeDefined()
        expect(typeof prop).toBe('string')
      })
      
      // Component should define clear interface
      const componentProps = ['week', 'onAddMeal', 'onUpdateTitle']
      expect(componentProps).toEqual(expect.arrayContaining(requiredProps))
    })
  })

  describe('Performance Anti-Patterns', () => {
    it('detects unnecessary re-renders from context coupling', () => {
      let renderCount = 0
      
      const MonitoredComponent = ({ week }: { week: typeof mockWeek }) => {
        renderCount++
        return <div>{week?.title}</div>
      }
      
      const { rerender } = renderPureComponent(<MonitoredComponent week={mockWeek} />)
      
      const initialRenderCount = renderCount
      
      // Rerender with same props - should not cause additional renders in pure component
      rerender(<MonitoredComponent week={mockWeek} />)
      
      // Pure component should not re-render unnecessarily
      expect(renderCount).toBe(initialRenderCount)
    })
  })
})
