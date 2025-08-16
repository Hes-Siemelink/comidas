import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from './components/AppRoutes'
import './i18n'

// Wrapper component for Chakra UI provider and Router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </ChakraProvider>
)

describe('App', () => {
  it('renders app title', () => {
    render(<AppRoutes />, { wrapper: TestWrapper })
    expect(screen.getByText(/family recipe app/i)).toBeInTheDocument()
  })

  it('renders app description', () => {
    render(<AppRoutes />, { wrapper: TestWrapper })
    expect(screen.getByText(/record recipes, plan family meals and have a handy assistant while cooking/i)).toBeInTheDocument()
  })

  it('renders language toggle buttons', () => {
    render(<AppRoutes />, { wrapper: TestWrapper })
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
    expect(screen.getByText('Nederlands')).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    render(<AppRoutes />, { wrapper: TestWrapper })
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Recipes')).toBeInTheDocument()
    expect(screen.getByText('Planner')).toBeInTheDocument()
    expect(screen.getByText('Cooking')).toBeInTheDocument()
  })
})
