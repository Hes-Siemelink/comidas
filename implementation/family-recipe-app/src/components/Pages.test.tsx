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
      expect(screen.getByText('Main Features')).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Main title should be h1
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Family Recipe App')
      
      // Features section should be h2
      const featuresHeading = screen.getByRole('heading', { level: 2 })
      expect(featuresHeading).toHaveTextContent('Main Features')
    })

    it('renders all three feature sections', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Check for feature section headings
      expect(screen.getByRole('heading', { name: 'Recipe Database' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Meal Planner' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Cooking Assistant' })).toBeInTheDocument()
      
      // Check for feature descriptions
      expect(screen.getByText(/browse and manage your family recipes/i)).toBeInTheDocument()
      expect(screen.getByText(/plan your weekly family meals/i)).toBeInTheDocument()
      expect(screen.getByText(/step-by-step cooking guidance/i)).toBeInTheDocument()
    })

    it('shows placeholder content for features', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Should have multiple "Coming soon..." placeholders
      const comingSoonTexts = screen.getAllByText('Coming soon...')
      expect(comingSoonTexts).toHaveLength(3)
    })

    it('uses internationalization', () => {
      render(<HomePage />, { wrapper: TestWrapper })
      
      // Should use translation keys (falls back to English text)
      expect(screen.getByText('Family Recipe App')).toBeInTheDocument()
      expect(screen.getByText('Main Features')).toBeInTheDocument()
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