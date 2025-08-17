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
    it('returns initial loading state as true', () => {
      const { result } = renderPlannerHook()
      expect(result.current.loading).toBe(true)
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
  })

  describe('Error Handling', () => {
    it('handles invalid week IDs gracefully', async () => {
      const { result } = renderPlannerHook()
      
      // Try to add meal to non-existent week - should throw error
      await act(async () => {
        await expect(result.current.addMeal('invalid-week-id', 'Test Meal')).rejects.toThrow('Week not found')
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
