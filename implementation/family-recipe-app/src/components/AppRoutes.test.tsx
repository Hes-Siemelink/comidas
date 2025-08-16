import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import '../i18n'

const TestWrapper = ({ children, initialEntries = ['/'] }: { children: React.ReactNode, initialEntries?: string[] }) => (
  <ChakraProvider value={defaultSystem}>
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  </ChakraProvider>
)

describe('AppRoutes', () => {
  it('renders home page by default', () => {
    render(<AppRoutes />, { wrapper: (props) => <TestWrapper {...props} /> })
    
    expect(screen.getByText('Family Recipe App')).toBeInTheDocument()
    expect(screen.getByText(/record recipes, plan family meals/i)).toBeInTheDocument()
  })

  it('renders recipes page when navigating to /recipes', () => {
    render(<AppRoutes />, { 
      wrapper: (props) => <TestWrapper {...props} initialEntries={['/recipes']} /> 
    })
    
    expect(screen.getByText('Recipe Database')).toBeInTheDocument()
    expect(screen.getByText(/browse and manage your family recipes/i)).toBeInTheDocument()
  })

  it('renders planner page when navigating to /planner', () => {
    render(<AppRoutes />, { 
      wrapper: (props) => <TestWrapper {...props} initialEntries={['/planner']} /> 
    })
    
    expect(screen.getByText('Meal Planner')).toBeInTheDocument()
    expect(screen.getByText(/plan your weekly family meals/i)).toBeInTheDocument()
  })

  it('renders cooking page when navigating to /cooking', () => {
    render(<AppRoutes />, { 
      wrapper: (props) => <TestWrapper {...props} initialEntries={['/cooking']} /> 
    })
    
    expect(screen.getByText('Cooking Assistant')).toBeInTheDocument()
    expect(screen.getByText(/step-by-step cooking guidance/i)).toBeInTheDocument()
  })

  it('includes navigation on all routes', () => {
    const routes = ['/', '/recipes', '/planner', '/cooking']
    
    routes.forEach(route => {
      const { unmount } = render(<AppRoutes />, { 
        wrapper: (props) => <TestWrapper {...props} initialEntries={[route]} /> 
      })
      
      // Navigation should be present on all routes
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Recipes')).toBeInTheDocument()
      expect(screen.getByText('Planner')).toBeInTheDocument()
      expect(screen.getByText('Cooking')).toBeInTheDocument()
      
      // Language switcher should be present
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Español')).toBeInTheDocument()
      expect(screen.getByText('Nederlands')).toBeInTheDocument()
      
      unmount()
    })
  })

  it('has proper layout structure', () => {
    render(<AppRoutes />, { wrapper: (props) => <TestWrapper {...props} /> })
    
    // Should have navigation
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    // Should have main content area with headings
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('maintains minimum height layout', () => {
    const { container } = render(<AppRoutes />, { wrapper: (props) => <TestWrapper {...props} /> })
    
    // The main container should have min height class
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('css-vooagt') // This includes min-height styles
  })
})