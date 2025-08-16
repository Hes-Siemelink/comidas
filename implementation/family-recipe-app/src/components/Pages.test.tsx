import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import HomePage from './HomePage'
import RecipesPage from './RecipesPage'
import PlannerPage from './PlannerPage'
import CookingPage from './CookingPage'
import '../i18n'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    {children}
  </ChakraProvider>
)

describe('Page Components', () => {
  describe('HomePage', () => {
    it('renders app title and description', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      expect(screen.getByText('Family Recipe App')).toBeInTheDocument()
      expect(screen.getByText(/record recipes, plan family meals/i)).toBeInTheDocument()
      expect(screen.getByText(/home page sections coming soon/i)).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Family Recipe App')
    })
  })

  describe('RecipesPage', () => {
    it('renders recipe database title and description', () => {
      render(<RecipesPage />, { wrapper: TestWrapper })
      
      expect(screen.getByText('Recipe Database')).toBeInTheDocument()
      expect(screen.getByText(/browse and manage your family recipes/i)).toBeInTheDocument()
      expect(screen.getByText(/recipe database functionality coming soon/i)).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(<RecipesPage />, { wrapper: TestWrapper })
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Recipe Database')
    })

    it('uses internationalization', () => {
      render(<RecipesPage />, { wrapper: TestWrapper })
      
      // Should use translation keys (falls back to English text)
      expect(screen.getByText('Recipe Database')).toBeInTheDocument()
    })
  })

  describe('PlannerPage', () => {
    it('renders meal planner title and description', () => {
      render(<PlannerPage />, { wrapper: TestWrapper })
      
      expect(screen.getByText('Meal Planner')).toBeInTheDocument()
      expect(screen.getByText(/plan your weekly family meals/i)).toBeInTheDocument()
      expect(screen.getByText(/meal planning functionality coming soon/i)).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(<PlannerPage />, { wrapper: TestWrapper })
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Meal Planner')
    })

    it('uses internationalization', () => {
      render(<PlannerPage />, { wrapper: TestWrapper })
      
      expect(screen.getByText('Meal Planner')).toBeInTheDocument()
    })
  })

  describe('CookingPage', () => {
    it('renders cooking assistant title and description', () => {
      render(<CookingPage />, { wrapper: TestWrapper })
      
      expect(screen.getByText('Cooking Assistant')).toBeInTheDocument()
      expect(screen.getByText(/step-by-step cooking guidance/i)).toBeInTheDocument()
      expect(screen.getByText(/cooking assistant functionality coming soon/i)).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(<CookingPage />, { wrapper: TestWrapper })
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Cooking Assistant')
    })

    it('uses internationalization', () => {
      render(<CookingPage />, { wrapper: TestWrapper })
      
      expect(screen.getByText('Cooking Assistant')).toBeInTheDocument()
    })
  })

  describe('All Pages Accessibility', () => {
    const pages = [
      { component: HomePage, name: 'HomePage' },
      { component: RecipesPage, name: 'RecipesPage' },
      { component: PlannerPage, name: 'PlannerPage' },
      { component: CookingPage, name: 'CookingPage' }
    ]

    pages.forEach(({ component: Component, name }) => {
      it(`${name} has accessible content structure`, () => {
        render(<Component />, { wrapper: TestWrapper })
        
        // Should have a heading
        const heading = screen.getByRole('heading')
        expect(heading).toBeInTheDocument()
        
        // Should have meaningful text content
        const textElements = screen.getAllByText(/\w+/)
        expect(textElements.length).toBeGreaterThan(0)
      })
    })
  })
})