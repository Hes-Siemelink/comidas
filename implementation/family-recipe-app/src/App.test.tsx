import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import App from './App'
import './i18n'

// Wrapper component for Chakra UI provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
)

describe('App', () => {
  it('renders Hello World message', () => {
    render(<App />, { wrapper: TestWrapper })
    expect(screen.getByText(/hello world/i)).toBeInTheDocument()
  })

  it('renders welcome message', () => {
    render(<App />, { wrapper: TestWrapper })
    expect(screen.getByText(/welcome to the family recipe app/i)).toBeInTheDocument()
  })

  it('renders language toggle buttons', () => {
    render(<App />, { wrapper: TestWrapper })
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
    expect(screen.getByText('Nederlands')).toBeInTheDocument()
  })
})
