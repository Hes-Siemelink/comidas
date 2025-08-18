import { act, waitFor } from '@testing-library/react'
import { renderPlannerHook } from '../test-utils/context-test-helpers'

// Tests specifically for standardized week transition logic
// Validates unified completion flows and state management consistency
describe('PlannerContext - Week Transition Logic Standardization', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('✅ Unified Completion Logic', () => {
    it('produces identical results for automatic and manual completion flows', async () => {
      const { result: automaticFlow } = renderPlannerHook()
      const { result: manualFlow } = renderPlannerHook()
      
      // Set up identical scenarios - create current weeks first, then planned
      await act(async () => {
        await automaticFlow.current.createWeek('current', 'Auto Week')
      })
      
      await act(async () => {
        await automaticFlow.current.createWeek('planned', 'Auto Planned')
        await automaticFlow.current.addMeal(automaticFlow.current.getCurrentWeek()!.id, 'Test Meal')
      })
      
      await act(async () => {
        await manualFlow.current.createWeek('current', 'Manual Week')
      })
      
      await act(async () => {
        await manualFlow.current.createWeek('planned', 'Manual Planned')
        await manualFlow.current.addMeal(manualFlow.current.getCurrentWeek()!.id, 'Test Meal')
      })

      // Execute completion via different flows
      const autoWeekId = automaticFlow.current.getCurrentWeek()!.id
      const autoMealId = automaticFlow.current.getCurrentWeek()!.meals[0].id

      // Automatic completion (via toggleMealComplete)
      await act(async () => {
        await automaticFlow.current.toggleMealComplete(autoWeekId, autoMealId)
      })

      // Manual completion (via completeWeek)
      await act(async () => {
        await manualFlow.current.completeWeek()
      })

      await waitFor(() => {
        // Both flows should produce identical ceremony state
        expect(automaticFlow.current.showCompletionCeremony).toBe(true)
        expect(manualFlow.current.showCompletionCeremony).toBe(true)
        expect(automaticFlow.current.completedWeekData?.status).toBe('completed')
        expect(manualFlow.current.completedWeekData?.status).toBe('completed')

        // Both flows should promote planned weeks to current identically
        expect(automaticFlow.current.getCurrentWeek()?.title).toContain('Planned')
        expect(manualFlow.current.getCurrentWeek()?.title).toContain('Planned')
        expect(automaticFlow.current.getCurrentWeek()?.status).toBe('current')
        expect(manualFlow.current.getCurrentWeek()?.status).toBe('current')

        // Both flows should archive completed weeks identically
        const autoArchived = automaticFlow.current.getArchivedWeeks()
        const manualArchived = manualFlow.current.getArchivedWeeks()
        expect(autoArchived).toHaveLength(1)
        expect(manualArchived).toHaveLength(1)
        expect(autoArchived[0].status).toBe('archived')
        expect(manualArchived[0].status).toBe('archived')
      })
    })

    it('follows predictable state transitions: current → archived with planned promotion', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Current Week')
        await result.current.createWeek('planned', 'Future Week')
      })

      const initialCurrentId = result.current.getCurrentWeek()!.id
      const plannedId = result.current.getPlannedWeek()!.id

      // Complete the week
      await act(async () => {
        await result.current.completeWeek()
      })

      await waitFor(() => {
        // Current week should be the promoted planned week
        const newCurrent = result.current.getCurrentWeek()
        expect(newCurrent?.id).toBe(plannedId)
        expect(newCurrent?.status).toBe('current')
        expect(newCurrent?.title).toBe('Future Week')

        // Old current week should be archived
        const archived = result.current.getArchivedWeeks()
        expect(archived).toHaveLength(1)
        expect(archived[0].id).toBe(initialCurrentId)
        expect(archived[0].status).toBe('archived')
        expect(archived[0].title).toBe('Current Week')

        // No planned week should remain
        expect(result.current.getPlannedWeek()).toBeNull()
      })
    })

    it('triggers ceremony consistently regardless of completion method', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      await act(async () => {
        await result.current.addMeal(result.current.getCurrentWeek()!.id, 'Test Meal')
      })

      const weekId = result.current.getCurrentWeek()!.id
      const mealId = result.current.getCurrentWeek()!.meals[0].id

      // Complete via automatic flow (all meals completed)
      await act(async () => {
        await result.current.toggleMealComplete(weekId, mealId)
      })

      await waitFor(() => {
        // Ceremony should be triggered
        expect(result.current.showCompletionCeremony).toBe(true)
        expect(result.current.completedWeekData).toBeTruthy()
        expect(result.current.completedWeekData?.status).toBe('completed')
      })
    })
  })

  describe('✅ State Management Cleanup', () => {
    it('eliminates temporary completed status in UI contexts - currentWeek is never completed', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })
      
      await act(async () => {
        await result.current.addMeal(result.current.getCurrentWeek()!.id, 'Test Meal')
      })

      const weekId = result.current.getCurrentWeek()!.id
      const mealId = result.current.getCurrentWeek()!.meals[0].id

      // Complete the week
      await act(async () => {
        await result.current.toggleMealComplete(weekId, mealId)
      })

      await waitFor(() => {
        // currentWeek should NEVER have 'completed' status - should be null or 'current'
        const currentWeek = result.current.getCurrentWeek()
        if (currentWeek) {
          expect(currentWeek.status).toBe('current')
        } else {
          expect(currentWeek).toBeNull()
        }

        // Completed weeks should immediately move to history with 'archived' status
        const archivedWeeks = result.current.getArchivedWeeks()
        expect(archivedWeeks).toHaveLength(1)
        expect(archivedWeeks[0].status).toBe('archived')
      })
    })

    it('performs atomic state updates with no intermediate states', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Current Week')
        await result.current.createWeek('planned', 'Planned Week')
      })

      const plannedId = result.current.getPlannedWeek()!.id

      // Complete week and verify atomic update
      await act(async () => {
        await result.current.completeWeek()
      })

      await waitFor(() => {
        // Planned week should be promoted atomically
        const newCurrent = result.current.getCurrentWeek()
        expect(newCurrent?.id).toBe(plannedId)
        expect(newCurrent?.status).toBe('current')

        // No planned week should remain in weekHistory
        const plannedWeek = result.current.getPlannedWeek()
        expect(plannedWeek).toBeNull()
      })
    })

    it('manages history correctly - completed weeks immediately move to history', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Week 1')
      })

      const week1Id = result.current.getCurrentWeek()!.id

      await act(async () => {
        await result.current.completeWeek()
      })

      await waitFor(() => {
        // Week should be in archived history, not in current
        const archivedWeeks = result.current.getArchivedWeeks()
        expect(archivedWeeks).toHaveLength(1)
        expect(archivedWeeks[0].id).toBe(week1Id)
        expect(archivedWeeks[0].status).toBe('archived')
        
        // No current week since no planned week existed
        expect(result.current.getCurrentWeek()).toBeNull()
      })
    })
  })

  describe('✅ Business Logic Consolidation', () => {
    it('uses single promotion function for planned→current transitions', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Current Week')
      })
      
      await act(async () => {
        await result.current.createWeek('planned', 'Next Week')
      })

      const plannedWeek = result.current.getPlannedWeek()!
      const originalUpdatedAt = plannedWeek.updatedAt

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10))

      await act(async () => {
        await result.current.completeWeek()
      })

      await waitFor(() => {
        const newCurrent = result.current.getCurrentWeek()!
        
        // Verify promotion occurred with proper metadata updates
        expect(newCurrent.id).toBe(plannedWeek.id)
        expect(newCurrent.status).toBe('current')
        expect(newCurrent.title).toBe('Next Week')
        expect(newCurrent.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      })
    })

    it('centralizes ceremony state management across all flows', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Test Week')
      })

      // Manual completion
      await act(async () => {
        await result.current.completeWeek()
      })

      await waitFor(() => {
        expect(result.current.showCompletionCeremony).toBe(true)
        expect(result.current.completedWeekData?.status).toBe('completed')
      })

      // Dismiss ceremony
      await act(async () => {
        result.current.dismissCeremony()
      })

      expect(result.current.showCompletionCeremony).toBe(false)
      expect(result.current.completedWeekData).toBeNull()
    })

    it('handles consistent error patterns across transitions', async () => {
      const { result } = renderPlannerHook()
      
      // Test completing non-existent current week
      expect(result.current.getCurrentWeek()).toBeNull()
      
      // Should not throw but also not trigger ceremony
      await act(async () => {
        await result.current.completeWeek()
      })

      expect(result.current.showCompletionCeremony).toBe(false)
      expect(result.current.completedWeekData).toBeNull()
    })

    it('validates preconditions for state transitions', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('planned', 'Planned Week')
      })

      const plannedWeekId = result.current.getPlannedWeek()!.id
      
      await act(async () => {
        await result.current.addMeal(plannedWeekId, 'Planned Meal')
      })

      const mealId = result.current.getPlannedWeek()!.meals[0].id

      // Toggling meal completion on planned week should NOT trigger completion
      await act(async () => {
        await result.current.toggleMealComplete(plannedWeekId, mealId)
      })

      await waitFor(() => {
        expect(result.current.showCompletionCeremony).toBe(false)
        expect(result.current.getPlannedWeek()?.status).toBe('planned')
      })
    })
  })

  describe('✅ Edge Case Handling', () => {
    it('handles completion of empty weeks gracefully', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Empty Week')
      })

      // Complete week with no meals
      await act(async () => {
        await result.current.completeWeek()
      })

      await waitFor(() => {
        // Should still trigger ceremony for empty weeks
        expect(result.current.showCompletionCeremony).toBe(true)
        expect(result.current.completedWeekData?.title).toBe('Empty Week')
        
        // Week should be archived
        const archivedWeeks = result.current.getArchivedWeeks()
        expect(archivedWeeks).toHaveLength(1)
        expect(archivedWeeks[0].status).toBe('archived')
      })
    })

    it('handles completion when no planned week exists', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('current', 'Only Week')
      })

      await act(async () => {
        await result.current.completeWeek()
      })

      await waitFor(() => {
        // Should complete successfully with no current week
        expect(result.current.getCurrentWeek()).toBeNull()
        expect(result.current.getPlannedWeek()).toBeNull()
        expect(result.current.showCompletionCeremony).toBe(true)
        
        const archivedWeeks = result.current.getArchivedWeeks()
        expect(archivedWeeks).toHaveLength(1)
        expect(archivedWeeks[0].title).toBe('Only Week')
      })
    })

    it('prevents automatic completion on non-current weeks', async () => {
      const { result } = renderPlannerHook()
      
      await act(async () => {
        await result.current.createWeek('planned', 'Future Week')
      })
      
      await act(async () => {
        await result.current.addMeal(result.current.getPlannedWeek()!.id, 'Future Meal')
      })

      const plannedWeekId = result.current.getPlannedWeek()!.id
      const mealId = result.current.getPlannedWeek()!.meals[0].id

      // Completing all meals in planned week should NOT trigger completion
      await act(async () => {
        await result.current.toggleMealComplete(plannedWeekId, mealId)
      })

      await waitFor(() => {
        expect(result.current.showCompletionCeremony).toBe(false)
        expect(result.current.getPlannedWeek()?.meals[0].completed).toBe(true)
        expect(result.current.getPlannedWeek()?.status).toBe('planned')
      })
    })
  })
})
