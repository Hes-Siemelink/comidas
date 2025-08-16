import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from './HomePage'
import RecipesPage from './RecipesPage'
import PlannerPage from './PlannerPage'
import CookingPage from './CookingPage'
import '../i18n'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  </BrowserRouter>
)

describe('Page Components', () => {
  describe('HomePage', () => {
    it('renders app title and description', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      expect(screen.getByText('Comidas')).toBeInTheDocument()
      expect(screen.getByText(/record recipes, plan family meals/i)).toBeInTheDocument()
      expect(screen.getByText('Main Features')).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Main title should be h1
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Comidas')
      
      // Features section should be h2
      const featuresHeading = screen.getByRole('heading', { level: 2 })
      expect(featuresHeading).toHaveTextContent('Main Features')
    })

    it('renders all three feature sections with icons', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Check for feature section headings
      expect(screen.getByRole('heading', { name: 'Recipe Database' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Meal Planner' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Cooking Assistant' })).toBeInTheDocument()
      
      // Check for feature descriptions
      expect(screen.getByText(/browse and manage your family recipes/i)).toBeInTheDocument()
      expect(screen.getByText(/plan your weekly family meals/i)).toBeInTheDocument()
      expect(screen.getByText(/step-by-step cooking guidance/i)).toBeInTheDocument()
      
      // Check for feature icons with accessibility labels
      expect(screen.getByRole('img', { name: 'Recipe Database' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Meal Planner' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Cooking Assistant' })).toBeInTheDocument()
    })

    it('shows placeholder content for features', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Should have 1 "Coming soon..." placeholder (Cooking Assistant only)
      // Recipe Database and Meal Planner are no longer placeholders
      const comingSoonTexts = screen.getAllByText('Coming soon...')
      expect(comingSoonTexts).toHaveLength(1)
    })

    it('uses internationalization', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Should use translation keys (falls back to English text)
      expect(screen.getByText('Comidas')).toBeInTheDocument()
      expect(screen.getByText('Main Features')).toBeInTheDocument()
    })

    it('renders Recipe Database section with interactive buttons', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Check for Recipe Database section
      expect(screen.getByRole('heading', { name: 'Recipe Database' })).toBeInTheDocument()
      expect(screen.getByText(/browse and manage your family recipes/i)).toBeInTheDocument()
      
      // Check for action buttons by their accessible names (aria-label)
      expect(screen.getByRole('button', { name: 'Browse all family recipes' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Add a new recipe to the collection' })).toBeInTheDocument()
    })

    it('Recipe Database buttons have proper accessibility labels', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Check for proper ARIA labels
      expect(screen.getByLabelText(/browse all family recipes/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/add a new recipe to the collection/i)).toBeInTheDocument()
    })

    it('renders Meal Planner section with interactive buttons', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Check for Meal Planner section
      expect(screen.getByRole('heading', { name: 'Meal Planner' })).toBeInTheDocument()
      expect(screen.getByText(/plan your weekly family meals/i)).toBeInTheDocument()
      
      // Check for action buttons by their accessible names (aria-label)
      expect(screen.getByRole('button', { name: 'View the complete meal planning interface' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Start planning meals for this week' })).toBeInTheDocument()
    })

    it('Meal Planner buttons have proper accessibility labels', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Check for proper ARIA labels
      expect(screen.getByLabelText(/view the complete meal planning interface/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/start planning meals for this week/i)).toBeInTheDocument()
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
      
      const heading = screen.getByRole('heading', { level: 1 })
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
      
      const heading = screen.getByRole('heading', { level: 1 })
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
      
      const heading = screen.getByRole('heading', { level: 1 })
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
        
        // Should have at least one heading
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
        
        // Should have meaningful text content
        const textElements = screen.getAllByText(/\w+/)
        expect(textElements.length).toBeGreaterThan(0)
      })
    })
  })
})