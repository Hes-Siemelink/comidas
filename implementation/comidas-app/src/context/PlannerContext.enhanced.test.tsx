import { act, waitFor } from '@testing-library/react'
import { renderPlannerHook } from '../test-utils/context-test-helpers'

// This file demonstrates CONTEXT TESTING
// - Tests context hook behavior in isolation
// - Validates state selectors and mutations
// - Tests side effects like persistence
// - Ensures proper error handling

describe('PlannerContext - Enhanced Context Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('State Selectors', () => {
    it('returns initial loading state as false', () => {
      const { result } = renderPlannerHook()
      expect(result.current.loading).toBe(false)
    })

    it('returns null for currentWeek initially', () => {
      const { result } = renderPlannerHook()
      expect(result.current.currentWeek).toBeNull()
    })

    it('getCurrentWeek returns current week when available', async () => {
      const { result } = renderPlannerHook()
      
      // Create a current week
      await act(async () => {
        await result.current.createWeek('current', 'Test Current Week')
      })
      
      await waitFor(() => {
        expect(result.current.getCurrentWeek()).toBeTruthy()
        expect(result.current.getCurrentWeek()?.status).toBe('current')
      })
    })

    it('getPlannedWeek returns planned week when available', async () => {
      const { result } = renderPlannerHook()
      
      // Create a planned week
      await act(async () => {
        await result.current.createWeek('planned', 'Test Planned Week')
      })
      
      await waitFor(() => {
        expect(result.current.getPlannedWeek()).toBeTruthy()
        expect(result.current.getPlannedWeek()?.status).toBe('planned')
      })
    })

    it('getArchivedWeeks returns empty array initially', () => {
      const { result } = renderPlannerHook()
      expect(result.current.getArchivedWeeks()).toEqual([])
    })
  })

  describe('State Mutations', () => {
    it('createWeek updates loading state correctly', async () => {
      const { result } = renderPlannerHook()
      
      let loadingStates: boolean[] = []
      
      // Monitor loading state changes
      const checkLoading = () => loadingStates.push(result.current.loading)
      
      checkLoading() // Initial state
      
      await act(async () => {
        const promise = result.current.createWeek('current', 'Test Week')
        checkLoading() // During loading
        await promise
        checkLoading() // After completion
      })
      
      expect(loadingStates).toEqual([false, true, false])
    })

    it('addMeal adds meal to correct week', async () => {
      const { result } = renderPlannerHook()
      
      // Create a week first
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      const weekId = result.current.getCurrentWeek()?.id
      expect(weekId).toBeDefined()
      
      // Add a meal
      await act(async () => {
        await result.current.addMeal(weekId!, 'Spaghetti Carbonara')
      })
      
      await waitFor(() => {
        const currentWeek = result.current.getCurrentWeek()
        expect(currentWeek?.meals).toHaveLength(1)
        expect(currentWeek?.meals[0].title).toBe('Spaghetti Carbonara')
      })
    })

    it('toggleMealComplete updates meal status', async () => {
      const { result } = renderPlannerHook()
      
      // Create week and add meal
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      
      await act(async () => {
        await result.current.addMeal(weekId, 'Test Meal')
      })
      
      const mealId = result.current.getCurrentWeek()?.meals[0].id!
      
      // Toggle meal completion
      await act(async () => {
        await result.current.toggleMealComplete(weekId, mealId)
      })
      
      await waitFor(() => {
        const meal = result.current.getCurrentWeek()?.meals[0]
        expect(meal?.completed).toBe(true)
      })
      
      // Toggle back
      await act(async () => {
        await result.current.toggleMealComplete(weekId, mealId)
      })
      
      await waitFor(() => {
        const meal = result.current.getCurrentWeek()?.meals[0]
        expect(meal?.completed).toBe(false)
      })
    })
  })

  describe('Persistence Integration', () => {
    it('persists data to localStorage on state changes', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Persistent Week')
      })
      
      await waitFor(() => {
        const storedData = localStorage.getItem('comidas-weeks')
        expect(storedData).toBeTruthy()
        
        const parsedData = JSON.parse(storedData!)
        expect(Array.isArray(parsedData)).toBe(true)
        expect(parsedData.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Error Handling', () => {
    it('handles invalid week IDs gracefully', async () => {
      const { result } = renderPlannerHook()
      
      // Try to add meal to non-existent week
      await act(async () => {
        await result.current.addMeal('invalid-week-id', 'Test Meal')
      })
      
      // Should not crash and should not create any weeks
      expect(result.current.getCurrentWeek()).toBeNull()
      expect(result.current.getPlannedWeek()).toBeNull()
    })

    it('handles invalid meal IDs gracefully', async () => {
      const { result } = renderPlannerHook()
      
      // Create a week first
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      
      // Try to toggle non-existent meal
      await act(async () => {
        await result.current.toggleMealComplete(weekId, 'invalid-meal-id')
      })
      
      // Should not crash
      expect(result.current.getCurrentWeek()?.meals).toHaveLength(0)
    })
  })
})
