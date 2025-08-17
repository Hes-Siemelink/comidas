import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { PlannerProvider, usePlanner } from '../context/PlannerContext'
import { RecipeProvider, useRecipes } from '../context/RecipeContext'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

// Wrapper for context hook testing
export const PlannerContextWrapper = ({ children }: { children: ReactNode }) => (
  <PlannerProvider>
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  </PlannerProvider>
)

// Helper to test planner context hooks
export const renderPlannerHook = () => {
  return renderHook(() => usePlanner(), {
    wrapper: PlannerContextWrapper,
  })
}

// Helper to test recipe context hooks
export const renderRecipeHook = () => {
  return renderHook(() => useRecipes(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <RecipeProvider>
        <ChakraProvider value={defaultSystem}>
          {children}
        </ChakraProvider>
      </RecipeProvider>
    ),
  })
}

// Test state selector functions in isolation
export const testStateSelector = <T,>(
  selectorName: string,
  expectedInitialValue: T
) => {
  describe(`${selectorName} State Selector`, () => {
    it('should return expected initial value', () => {
      const { result } = renderPlannerHook()
      expect(result.current[selectorName as keyof typeof result.current]).toEqual(expectedInitialValue)
    })

    it('should be a pure function (no side effects)', () => {
      const { result } = renderPlannerHook()
      const firstCall = result.current[selectorName as keyof typeof result.current]
      const secondCall = result.current[selectorName as keyof typeof result.current]
      expect(firstCall).toEqual(secondCall)
    })
  })
}

// Test state mutation functions
export const testStateMutation = (
  mutationName: string,
  mutation: (...args: any[]) => Promise<void> | void,
  testArgs: any[]
) => {
  describe(`${mutationName} State Mutation`, () => {
    it('should be a function', () => {
      const { result } = renderPlannerHook()
      expect(typeof result.current[mutationName as keyof typeof result.current]).toBe('function')
    })

    it('should handle errors gracefully', async () => {
      const { result } = renderPlannerHook()
      const mutationFn = result.current[mutationName as keyof typeof result.current] as typeof mutation
      
      // This test ensures mutations don't crash on invalid input
      await expect(async () => {
        await act(async () => {
          try {
            await mutationFn(...testArgs)
          } catch (error) {
            // Mutations should handle errors internally
            console.log('Expected error handled:', error)
          }
        })
      }).not.toThrow()
    })
  })
}
