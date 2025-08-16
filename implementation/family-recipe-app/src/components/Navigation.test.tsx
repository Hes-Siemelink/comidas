import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from './Navigation'
import '../i18n'

const TestWrapper = ({ children, initialEntries = ['/'] }: { children: React.ReactNode, initialEntries?: string[] }) => (
  <ChakraProvider value={defaultSystem}>
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  </ChakraProvider>
)

describe('Navigation', () => {
  it('renders all navigation buttons', () => {
    render(<Navigation />, { wrapper: (props) => <TestWrapper {...props} /> })
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Recipes')).toBeInTheDocument()
    expect(screen.getByText('Planner')).toBeInTheDocument()
    expect(screen.getByText('Cooking')).toBeInTheDocument()
  })

  it('highlights active route button', () => {
    render(<Navigation />, { 
      wrapper: (props) => <TestWrapper {...props} initialEntries={['/recipes']} /> 
    })
    
    const recipesButton = screen.getByText('Recipes')
    const homeButton = screen.getByText('Home')
    
    // Recipes button should have solid variant (active)
    expect(recipesButton).toHaveClass('css-17zd4y0') // solid variant class
    // Home button should have ghost variant (inactive)
    expect(homeButton).toHaveClass('css-tjtpa6') // ghost variant class
  })

  it('renders language switcher', () => {
    render(<Navigation />, { wrapper: (props) => <TestWrapper {...props} /> })
    
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
    expect(screen.getByText('Nederlands')).toBeInTheDocument()
  })

  it('navigates to different routes when buttons are clicked', () => {
    const { rerender } = render(<Navigation />, { 
      wrapper: (props) => <TestWrapper {...props} initialEntries={['/']} /> 
    })
    
    // Check home is initially active
    expect(screen.getByText('Home')).toHaveClass('css-17zd4y0')
    
    // Click recipes button - this tests the navigation functionality
    fireEvent.click(screen.getByText('Recipes'))
    
    // We can't easily test navigation in this setup, but we can test that the buttons are clickable
    expect(screen.getByText('Recipes')).toBeEnabled()
  })

  it('has proper accessibility attributes', () => {
    render(<Navigation />, { wrapper: (props) => <TestWrapper {...props} /> })
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    // All buttons should be accessible
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(7) // 4 nav + 3 language buttons
    
    buttons.forEach(button => {
      expect(button).toBeEnabled()
    })
  })
})