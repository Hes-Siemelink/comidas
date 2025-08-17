import { act, waitFor } from '@testing-library/react'
import { renderPlannerHook } from '../test-utils/context-test-helpers'

// Comprehensive tests for PlannerContext business logic
// Focuses on covering uncovered functionality to improve coverage
describe('PlannerContext - Comprehensive Business Logic Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Week Creation and Status Management', () => {
    it('creates a current week and archives existing current week', async () => {
      const { result } = renderPlannerHook()
      
      // Create first current week
      await act(async () => {
        await result.current.createWeek('current', 'First Week')
      })
      
      const firstWeek = result.current.getCurrentWeek()
      expect(firstWeek?.title).toBe('First Week')
      expect(firstWeek?.status).toBe('current')
      
      // Create second current week - should archive the first
      await act(async () => {
        await result.current.createWeek('current', 'Second Week')
      })
      
      await waitFor(() => {
        const currentWeek = result.current.getCurrentWeek()
        const archivedWeeks = result.current.getArchivedWeeks()
        
        expect(currentWeek?.title).toBe('Second Week')
        expect(currentWeek?.status).toBe('current')
        expect(archivedWeeks).toHaveLength(1)
        expect(archivedWeeks[0].title).toBe('First Week')
        expect(archivedWeeks[0].status).toBe('archived')
      })
    })

    it('creates planned weeks without affecting current week', async () => {
      const { result } = renderPlannerHook()
      
      // Create current week
      await act(async () => {
        await result.current.createWeek('current', 'Current Week')
      })
      
      // Create planned week
      await act(async () => {
        await result.current.createWeek('planned', 'Planned Week')
      })
      
      await waitFor(() => {
        const currentWeek = result.current.getCurrentWeek()
        const plannedWeek = result.current.getPlannedWeek()
        
        expect(currentWeek?.title).toBe('Current Week')
        expect(currentWeek?.status).toBe('current')
        expect(plannedWeek?.title).toBe('Planned Week')
        expect(plannedWeek?.status).toBe('planned')
      })
    })

    it('generates default week titles with date', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current') // No title provided
      })
      
      await waitFor(() => {
        const currentWeek = result.current.getCurrentWeek()
        expect(currentWeek?.title).toMatch(/Current Week/)
        expect(currentWeek?.title).toMatch(/\d+\/\d+\/\d+/) // Should contain date
      })
    })
  })

  describe('Week Completion Flow', () => {
    it('completes week and promotes planned week to current', async () => {
      const { result } = renderPlannerHook()
      
      // Create current and planned weeks
      await act(async () => {
        await result.current.createWeek('current', 'Current Week')
      })
      
      await act(async () => {
        await result.current.createWeek('planned', 'Planned Week')
      })
      
      // Complete the current week
      await act(async () => {
        await result.current.completeWeek()
      })
      
      await waitFor(() => {
        const currentWeek = result.current.getCurrentWeek()
        const archivedWeeks = result.current.getArchivedWeeks()
        
        // Planned week should become current
        expect(currentWeek?.title).toBe('Planned Week')
        expect(currentWeek?.status).toBe('current')
        
        // Completed week should be archived
        expect(archivedWeeks).toHaveLength(1)
        expect(archivedWeeks[0].title).toBe('Current Week')
        expect(archivedWeeks[0].status).toBe('archived')
        expect(archivedWeeks[0].completedAt).toBeDefined()
        
        // Completion ceremony should be triggered
        expect(result.current.showCompletionCeremony).toBe(true)
        expect(result.current.completedWeekData?.title).toBe('Current Week')
      })
    })

    it('completes week with no planned week available', async () => {
      const { result } = renderPlannerHook()
      
      // Create only current week
      await act(async () => {
        await result.current.createWeek('current', 'Current Week')
      })
      
      // Complete the current week
      await act(async () => {
        await result.current.completeWeek()
      })
      
      await waitFor(() => {
        const currentWeek = result.current.getCurrentWeek()
        const archivedWeeks = result.current.getArchivedWeeks()
        
        // No current week should exist
        expect(currentWeek).toBeNull()
        
        // Week should be archived
        expect(archivedWeeks).toHaveLength(1)
        expect(archivedWeeks[0].title).toBe('Current Week')
        expect(archivedWeeks[0].status).toBe('archived')
        
        // Completion ceremony should be triggered
        expect(result.current.showCompletionCeremony).toBe(true)
      })
    })

    it('handles completion ceremony lifecycle', async () => {
      const { result } = renderPlannerHook()
      
      // Create and complete week
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      await act(async () => {
        await result.current.completeWeek()
      })
      
      // Ceremony should be shown
      await waitFor(() => {
        expect(result.current.showCompletionCeremony).toBe(true)
        expect(result.current.completedWeekData).toBeTruthy()
      })
      
      // Dismiss ceremony
      await act(async () => {
        result.current.dismissCeremony()
      })
      
      expect(result.current.showCompletionCeremony).toBe(false)
      expect(result.current.completedWeekData).toBeNull()
    })

    it('proceeds to next week after ceremony', async () => {
      const { result } = renderPlannerHook()
      
      // Create and complete week
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      await act(async () => {
        await result.current.completeWeek()
      })
      
      // Proceed to next week
      await act(async () => {
        await result.current.proceedToNextWeek()
      })
      
      await waitFor(() => {
        // Ceremony should be dismissed
        expect(result.current.showCompletionCeremony).toBe(false)
        expect(result.current.completedWeekData).toBeNull()
        
        // Week should be updated to archived status
        const archivedWeeks = result.current.getArchivedWeeks()
        expect(archivedWeeks[0].status).toBe('archived')
      })
    })
  })

  describe('Manual Week Archiving', () => {
    it('archives current week manually', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Current Week')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      
      await act(async () => {
        await result.current.archiveWeek(weekId)
      })
      
      await waitFor(() => {
        const currentWeek = result.current.getCurrentWeek()
        const archivedWeeks = result.current.getArchivedWeeks()
        
        expect(currentWeek).toBeNull()
        expect(archivedWeeks).toHaveLength(1)
        expect(archivedWeeks[0].status).toBe('archived')
      })
    })

    it('archives planned week from history', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('planned', 'Planned Week')
      })
      
      const plannedWeek = result.current.getPlannedWeek()!
      
      await act(async () => {
        await result.current.archiveWeek(plannedWeek.id)
      })
      
      await waitFor(() => {
        const newPlannedWeek = result.current.getPlannedWeek()
        const archivedWeeks = result.current.getArchivedWeeks()
        
        expect(newPlannedWeek).toBeNull()
        expect(archivedWeeks).toHaveLength(1)
        expect(archivedWeeks[0].title).toBe('Planned Week')
        expect(archivedWeeks[0].status).toBe('archived')
      })
    })

    it('throws error when archiving non-existent week', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await expect(result.current.archiveWeek('non-existent-id')).rejects.toThrow('Week with ID non-existent-id not found')
      })
    })
  })

  describe('Meal Management Operations', () => {
    it('updates meal properties', async () => {
      const { result } = renderPlannerHook()
      
      // Create week and add meal
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      
      await act(async () => {
        await result.current.addMeal(weekId, 'Original Meal')
      })
      
      const mealId = result.current.getCurrentWeek()?.meals[0].id!
      
      // Update meal
      await act(async () => {
        await result.current.updateMeal(weekId, mealId, { title: 'Updated Meal' })
      })
      
      await waitFor(() => {
        const meal = result.current.getCurrentWeek()?.meals[0]
        expect(meal?.title).toBe('Updated Meal')
      })
    })

    it('deletes meal and reorders remaining meals', async () => {
      const { result } = renderPlannerHook()
      
      // Create week and add multiple meals
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      
      await act(async () => {
        await result.current.addMeal(weekId, 'Meal 1')
      })
      
      await act(async () => {
        await result.current.addMeal(weekId, 'Meal 2')
      })
      
      await act(async () => {
        await result.current.addMeal(weekId, 'Meal 3')
      })
      
      // Wait for all meals to be added before getting the middle one
      await waitFor(() => {
        expect(result.current.getCurrentWeek()?.meals).toHaveLength(3)
      })
      
      const meals = result.current.getCurrentWeek()?.meals!
      const mealToDeleteId = meals[1].id // Delete middle meal
      
      await act(async () => {
        await result.current.deleteMeal(weekId, mealToDeleteId)
      })
      
      await waitFor(() => {
        const remainingMeals = result.current.getCurrentWeek()?.meals!
        expect(remainingMeals).toHaveLength(2)
        expect(remainingMeals[0].title).toBe('Meal 1')
        expect(remainingMeals[1].title).toBe('Meal 3')
        // Check order was updated
        expect(remainingMeals[0].order).toBe(0)
        expect(remainingMeals[1].order).toBe(1)
      })
    })

    it('reorders meals correctly', async () => {
      const { result } = renderPlannerHook()
      
      // Create week and add meals
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      
      await act(async () => {
        await result.current.addMeal(weekId, 'First')
      })
      
      await act(async () => {
        await result.current.addMeal(weekId, 'Second')
      })
      
      await act(async () => {
        await result.current.addMeal(weekId, 'Third')
      })
      
      // Wait for all meals to be added
      await waitFor(() => {
        expect(result.current.getCurrentWeek()?.meals).toHaveLength(3)
      })
      
      // Move first meal to last position (0 -> 2)
      await act(async () => {
        await result.current.reorderMeals(weekId, 0, 2)
      })
      
      await waitFor(() => {
        const meals = result.current.getCurrentWeek()?.meals!
        expect(meals[0].title).toBe('Second')
        expect(meals[1].title).toBe('Third')
        expect(meals[2].title).toBe('First')
        // Check orders are correct
        expect(meals[0].order).toBe(0)
        expect(meals[1].order).toBe(1)
        expect(meals[2].order).toBe(2)
      })
    })

    it('toggles meal completion and triggers week completion', async () => {
      const { result } = renderPlannerHook()
      
      // Create current week and add meal
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      
      await act(async () => {
        await result.current.addMeal(weekId, 'Test Meal')
      })
      
      const mealId = result.current.getCurrentWeek()?.meals[0].id!
      
      // Create planned week so we have something to promote
      await act(async () => {
        await result.current.createWeek('planned', 'Next Week')
      })
      
      // Toggle meal to completed - should trigger week completion
      await act(async () => {
        await result.current.toggleMealComplete(weekId, mealId)
      })
      
      await waitFor(() => {
        // Week should be completed and ceremony triggered
        expect(result.current.showCompletionCeremony).toBe(true)
        expect(result.current.completedWeekData?.status).toBe('completed')
        
        // Planned week should become current
        expect(result.current.getCurrentWeek()?.title).toBe('Next Week')
        expect(result.current.getCurrentWeek()?.status).toBe('current')
      })
    })

    it('toggles meal completion for planned week without triggering completion', async () => {
      const { result } = renderPlannerHook()
      
      // Create planned week and add meal
      await act(async () => {
        await result.current.createWeek('planned', 'Planned Week')
      })
      
      const plannedWeek = result.current.getPlannedWeek()!
      
      await act(async () => {
        await result.current.addMeal(plannedWeek.id, 'Planned Meal')
      })
      
      const mealId = result.current.getPlannedWeek()?.meals[0].id!
      
      // Toggle meal completion
      await act(async () => {
        await result.current.toggleMealComplete(plannedWeek.id, mealId)
      })
      
      await waitFor(() => {
        const meal = result.current.getPlannedWeek()?.meals[0]
        expect(meal?.completed).toBe(true)
        
        // Should NOT trigger ceremony for planned weeks
        expect(result.current.showCompletionCeremony).toBe(false)
      })
    })
  })

  describe('Week Title Management', () => {
    it('updates week title and trims whitespace', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Original Title')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      
      await act(async () => {
        await result.current.updateWeekTitle(weekId, '  Updated Title  ')
      })
      
      await waitFor(() => {
        expect(result.current.getCurrentWeek()?.title).toBe('Updated Title')
      })
    })

    it('handles empty title gracefully', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Original Title')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      
      await act(async () => {
        await result.current.updateWeekTitle(weekId, '   ')
      })
      
      await waitFor(() => {
        expect(result.current.getCurrentWeek()?.title).toBeUndefined()
      })
    })

    it('truncates long titles to 50 characters', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Original Title')
      })
      
      const weekId = result.current.getCurrentWeek()?.id!
      const longTitle = 'This is a very long title that exceeds fifty characters and should be truncated'
      
      await act(async () => {
        await result.current.updateWeekTitle(weekId, longTitle)
      })
      
      await waitFor(() => {
        const updatedTitle = result.current.getCurrentWeek()?.title
        expect(updatedTitle).toHaveLength(50)
        expect(updatedTitle).toBe(longTitle.slice(0, 50))
      })
    })
  })

  describe('State Selector Edge Cases', () => {
    it('getLatestArchivedWeek returns most recent archived week', async () => {
      const { result } = renderPlannerHook()
      
      // Create and archive multiple weeks
      await act(async () => {
        await result.current.createWeek('current', 'Week 1')
      })
      
      await act(async () => {
        await result.current.archiveWeek(result.current.getCurrentWeek()?.id!)
      })
      
      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10))
      
      await act(async () => {
        await result.current.createWeek('current', 'Week 2')
      })
      
      await act(async () => {
        await result.current.archiveWeek(result.current.getCurrentWeek()?.id!)
      })
      
      await waitFor(() => {
        const latestArchived = result.current.getLatestArchivedWeek()
        expect(latestArchived?.title).toBe('Week 2')
      })
    })

    it('returns null when no archived weeks exist', () => {
      const { result } = renderPlannerHook()
      expect(result.current.getLatestArchivedWeek()).toBeNull()
    })

    it('handles empty week history correctly', () => {
      const { result } = renderPlannerHook()
      expect(result.current.getPlannedWeek()).toBeNull()
      expect(result.current.getArchivedWeeks()).toEqual([])
      expect(result.current.getLatestArchivedWeek()).toBeNull()
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('handles successful week creation', async () => {
      const { result } = renderPlannerHook()
      
      // Create week successfully
      await act(async () => {
        const week = await result.current.createWeek('current', 'Test')
        expect(week).toBeDefined()
        expect(week.title).toBe('Test')
      })
      
      expect(result.current.getCurrentWeek()?.title).toBe('Test')
    })

    it('handles no current week when completing', async () => {
      const { result } = renderPlannerHook()
      
      // Try to complete week when none exists
      await act(async () => {
        await result.current.completeWeek()
      })
      
      // Should not crash or change state
      expect(result.current.getCurrentWeek()).toBeNull()
      expect(result.current.showCompletionCeremony).toBe(false)
    })

    it('handles no completed week data during proceed', async () => {
      const { result } = renderPlannerHook()
      
      // Try to proceed when no completed week data
      await act(async () => {
        await result.current.proceedToNextWeek()
      })
      
      // Should not crash
      expect(result.current.showCompletionCeremony).toBe(false)
    })
  })
})
