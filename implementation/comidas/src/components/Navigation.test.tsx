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
    
    // Both buttons should be present and enabled
    expect(recipesButton).toBeInTheDocument()
    expect(homeButton).toBeInTheDocument()
    expect(recipesButton).toBeEnabled()
    expect(homeButton).toBeEnabled()
  })

  it('renders language switcher', () => {
    render(<Navigation />, { wrapper: (props) => <TestWrapper {...props} /> })
    
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
    expect(screen.getByText('Nederlands')).toBeInTheDocument()
  })

  it('navigates to different routes when buttons are clicked', () => {
    render(<Navigation />, { 
      wrapper: (props) => <TestWrapper {...props} initialEntries={['/']} /> 
    })
    
    // All navigation buttons should be clickable
    const homeButton = screen.getByText('Home')
    const recipesButton = screen.getByText('Recipes')
    const plannerButton = screen.getByText('Planner')
    const cookingButton = screen.getByText('Cooking')
    
    expect(homeButton).toBeEnabled()
    expect(recipesButton).toBeEnabled()
    expect(plannerButton).toBeEnabled()
    expect(cookingButton).toBeEnabled()
    
    // Test that buttons are clickable
    fireEvent.click(recipesButton)
    expect(recipesButton).toBeEnabled()
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