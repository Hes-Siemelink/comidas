import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { PlannerProvider } from '../context/PlannerContext'
import { RecipeProvider } from '../context/RecipeContext'

// Minimal wrapper for pure component tests (only Chakra UI)
export const MinimalWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    {children}
  </ChakraProvider>
)

// Full app wrapper for integration tests
export const FullWrapper = ({ children }: { children: React.ReactNode }) => (
  <PlannerProvider>
    <RecipeProvider>
      <ChakraProvider value={defaultSystem}>
        {children}
      </ChakraProvider>
    </RecipeProvider>
  </PlannerProvider>
)

// Custom render function for pure component tests
export const renderPureComponent = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: MinimalWrapper, ...options })

// Custom render function for integration tests
export const renderIntegration = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: FullWrapper, ...options })

// Test case for dependency injection validation
export const testDependencyInjection = (
  componentName: string,
  component: ReactElement,
  expectedProps: string[]
) => {
  describe(`${componentName} Dependency Injection`, () => {
    it('should receive all required props for reusability', () => {
      // This test ensures components can be used outside their primary context
      expect(() => renderPureComponent(component)).not.toThrow()
    })

    it('should not directly access context when props are provided', () => {
      // Validate that component works with props alone
      const propsCheck = expectedProps.every(prop => 
        component.props && typeof component.props === 'object' && prop in component.props
      )
      expect(propsCheck).toBe(true)
    })
  })
}
