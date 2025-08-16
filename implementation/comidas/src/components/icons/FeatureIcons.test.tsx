import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { RecipeIcon, PlannerIcon, CookingIcon } from './FeatureIcons'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    {children}
  </ChakraProvider>
)

describe('FeatureIcons', () => {
  describe('RecipeIcon', () => {
    it('renders with default props', () => {
      render(<RecipeIcon />, { wrapper: TestWrapper })
      
      const icon = screen.getByRole('img', { name: 'Recipe Database' })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('aria-label', 'Recipe Database')
    })

    it('renders with custom size', () => {
      render(<RecipeIcon size="lg" />, { wrapper: TestWrapper })
      
      const icon = screen.getByRole('img', { name: 'Recipe Database' })
      expect(icon).toBeInTheDocument()
    })

    it('renders with custom color', () => {
      render(<RecipeIcon color="red.500" />, { wrapper: TestWrapper })
      
      const icon = screen.getByRole('img', { name: 'Recipe Database' })
      expect(icon).toBeInTheDocument()
    })
  })

  describe('PlannerIcon', () => {
    it('renders with default props', () => {
      render(<PlannerIcon />, { wrapper: TestWrapper })
      
      const icon = screen.getByRole('img', { name: 'Meal Planner' })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('aria-label', 'Meal Planner')
    })

    it('renders with custom size', () => {
      render(<PlannerIcon size="sm" />, { wrapper: TestWrapper })
      
      const icon = screen.getByRole('img', { name: 'Meal Planner' })
      expect(icon).toBeInTheDocument()
    })

    it('renders with custom color', () => {
      render(<PlannerIcon color="purple.500" />, { wrapper: TestWrapper })
      
      const icon = screen.getByRole('img', { name: 'Meal Planner' })
      expect(icon).toBeInTheDocument()
    })
  })

  describe('CookingIcon', () => {
    it('renders with default props', () => {
      render(<CookingIcon />, { wrapper: TestWrapper })
      
      const icon = screen.getByRole('img', { name: 'Cooking Assistant' })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('aria-label', 'Cooking Assistant')
    })

    it('renders with custom size', () => {
      render(<CookingIcon size="xl" />, { wrapper: TestWrapper })
      
      const icon = screen.getByRole('img', { name: 'Cooking Assistant' })
      expect(icon).toBeInTheDocument()
    })

    it('renders with custom color', () => {
      render(<CookingIcon color="teal.500" />, { wrapper: TestWrapper })
      
      const icon = screen.getByRole('img', { name: 'Cooking Assistant' })
      expect(icon).toBeInTheDocument()
    })
  })

  describe('All Feature Icons', () => {
    it('all icons have unique aria-labels for accessibility', () => {
      render(
        <div>
          <RecipeIcon />
          <PlannerIcon />
          <CookingIcon />
        </div>,
        { wrapper: TestWrapper }
      )
      
      expect(screen.getByRole('img', { name: 'Recipe Database' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Meal Planner' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Cooking Assistant' })).toBeInTheDocument()
    })

    it('all icons support different sizes', () => {
      const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl']
      
      sizes.forEach((size) => {
        const { unmount } = render(
          <div>
            <RecipeIcon size={size} />
            <PlannerIcon size={size} />
            <CookingIcon size={size} />
          </div>,
          { wrapper: TestWrapper }
        )
        
        const icons = screen.getAllByRole('img')
        expect(icons).toHaveLength(3)
        icons.forEach(icon => {
          expect(icon).toBeInTheDocument()
        })
        
        unmount()
      })
    })
  })
})