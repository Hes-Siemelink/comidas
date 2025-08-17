import { render, screen, waitFor, act } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { PlannerProvider, usePlanner } from './PlannerContext'
import { ComidasWeekSchema } from '../types/schemas'
import '../i18n'

// Test component to access context
function TestComponent() {
  const { 
    currentWeek, 
    loading, 
    createWeek, 
    addMeal, 
    toggleMealComplete, 
    deleteMeal 
  } = usePlanner()

  const handleCreateWeek = async () => {
    try {
      await createWeek('current', 'Test Week')
    } catch (error) {
      console.error('Create week error:', error)
    }
  }

  const handleAddMeal = async () => {
    try {
      await addMeal('Test Meal')
    } catch (error) {
      console.error('Add meal error:', error)
    }
  }

  const handleToggleMeal = async (mealId: string) => {
    try {
      await toggleMealComplete(mealId)
    } catch (error) {
      console.error('Toggle meal error:', error)
    }
  }

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteMeal(mealId)
    } catch (error) {
      console.error('Delete meal error:', error)
    }
  }

  return (
    <div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="current-week">{currentWeek ? 'exists' : 'null'}</div>
      <div data-testid="meal-count">{currentWeek?.mealCount || 0}</div>
      <div data-testid="meals-length">{currentWeek?.meals.length || 0}</div>
      <button 
        data-testid="create-week" 
        onClick={handleCreateWeek}
      >
        Create Week
      </button>
      <button 
        data-testid="add-meal" 
        onClick={handleAddMeal}
      >
        Add Meal
      </button>
      {currentWeek?.meals.map(meal => (
        <div key={meal.id} data-testid={`meal-${meal.id}`}>
          <span data-testid={`meal-title-${meal.id}`}>{meal.title}</span>
          <span data-testid={`meal-completed-${meal.id}`}>{meal.completed ? 'true' : 'false'}</span>
          <button 
            data-testid={`toggle-meal-${meal.id}`}
            onClick={() => handleToggleMeal(meal.id)}
          >
            Toggle
          </button>
          <button 
            data-testid={`delete-meal-${meal.id}`}
            onClick={() => handleDeleteMeal(meal.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    <PlannerProvider>
      {children}
    </PlannerProvider>
  </ChakraProvider>
)

describe('PlannerContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('Week Creation with Dynamic Meal Count', () => {
    it('creates a week with 0 meals initially (no minimum constraint)', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      // Wait for initial loading to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })
      
      // Initially no week exists
      expect(screen.getByTestId('current-week')).toHaveTextContent('null')
      expect(screen.getByTestId('meal-count')).toHaveTextContent('0')
      expect(screen.getByTestId('meals-length')).toHaveTextContent('0')
      
      // Create a new week
      await act(async () => {
        screen.getByTestId('create-week').click()
      })
      
      // Wait for the week to be created
      await waitFor(() => {
        expect(screen.getByTestId('current-week')).toHaveTextContent('exists')
      }, { timeout: 3000 })
      
      // Week should start with 0 meals - this validates no minimum constraint
      expect(screen.getByTestId('meal-count')).toHaveTextContent('0')
      expect(screen.getByTestId('meals-length')).toHaveTextContent('0')
    })

    it('allows creating a week without enforcing minimum meal count', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })
      
      await act(async () => {
        screen.getByTestId('create-week').click()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('current-week')).toHaveTextContent('exists')
      }, { timeout: 3000 })
      
      // Verify the week is valid with 0 meals (no validation error)
      expect(screen.getByTestId('meal-count')).toHaveTextContent('0')
      expect(screen.getByTestId('meals-length')).toHaveTextContent('0')
    })
  })

  describe('Schema Validation', () => {
    it('validates that ComidasWeek schema accepts 0 meals (no minimum constraint)', () => {
      // Test the schema directly to ensure it accepts 0 meals
      const weekWith0Meals = {
        id: 'test-id',
        title: 'Test Week',
        status: 'current' as const,
        meals: [],
        mealCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // This should not throw - validates that minimum constraint is removed
      expect(() => ComidasWeekSchema.parse(weekWith0Meals)).not.toThrow()
      
      const result = ComidasWeekSchema.parse(weekWith0Meals)
      expect(result.mealCount).toBe(0)
      expect(result.meals).toHaveLength(0)
    })

    it('validates that schema accepts weeks with many meals (no maximum constraint)', () => {
      // Create a week with 10 meals (more than old 7-meal limit)
      const meals = Array.from({ length: 10 }, (_, i) => ({
        id: `meal-${i}`,
        title: `Meal ${i}`,
        completed: false,
        order: i
      }))
      
      const weekWithManyMeals = {
        id: 'test-id',
        title: 'Test Week',
        status: 'current' as const,
        meals,
        mealCount: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // This should not throw - validates no maximum constraint
      expect(() => ComidasWeekSchema.parse(weekWithManyMeals)).not.toThrow()
      
      const result = ComidasWeekSchema.parse(weekWithManyMeals)
      expect(result.mealCount).toBe(10)
      expect(result.meals).toHaveLength(10)
    })
  })

  describe('Complete Flow Integration', () => {
    it('creates a week and adds a meal without ID mismatch errors', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })
      
      // Create a week
      await act(async () => {
        screen.getByTestId('create-week').click()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('current-week')).toHaveTextContent('exists')
        expect(screen.getByTestId('meal-count')).toHaveTextContent('0')
      }, { timeout: 3000 })
      
      // Add a meal (this was failing before the fix)
      await act(async () => {
        screen.getByTestId('add-meal').click()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('meal-count')).toHaveTextContent('1')
        expect(screen.getByTestId('meals-length')).toHaveTextContent('1')
        expect(screen.getByText('Test Meal')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Verify the meal persisted to localStorage with correct ID
      const savedData = localStorage.getItem('comidas_weeks')
      expect(savedData).toBeTruthy()
      
      const parsedData = JSON.parse(savedData!)
      expect(parsedData).toHaveLength(1)
      expect(parsedData[0].meals).toHaveLength(1)
      expect(parsedData[0].mealCount).toBe(1)
      expect(parsedData[0].meals[0].title).toBe('Test Meal')
    })
  })

  describe('Persistence Loading', () => {
    it('loads week data from localStorage on initialization', async () => {
      // Pre-populate localStorage with a week containing meals
      const testWeek = {
        id: 'test-week-id',
        title: 'Loaded Week',
        status: 'current',
        meals: [
          {
            id: 'meal-1',
            title: 'Loaded Meal',
            completed: false,
            order: 0
          }
        ],
        mealCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem('comidas_weeks', JSON.stringify([testWeek]))
      
      render(<TestComponent />, { wrapper: TestWrapper })
      
      // Should load the persisted week
      await waitFor(() => {
        expect(screen.getByTestId('current-week')).toHaveTextContent('exists')
        expect(screen.getByTestId('meal-count')).toHaveTextContent('1')
        expect(screen.getByText('Loaded Meal')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })
})