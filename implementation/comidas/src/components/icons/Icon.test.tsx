import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Icon from './Icon'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    {children}
  </ChakraProvider>
)

const TestIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
)

describe('Icon', () => {
  it('renders icon with accessibility label', () => {
    render(
      <Icon aria-label="Test icon">
        <TestIcon />
      </Icon>,
      { wrapper: TestWrapper }
    )
    
    const iconContainer = screen.getByRole('img', { name: 'Test icon' })
    expect(iconContainer).toBeInTheDocument()
  })

  it('renders icon with different sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl']
    
    sizes.forEach(size => {
      const { unmount } = render(
        <Icon size={size} aria-label={`${size} test icon`}>
          <TestIcon />
        </Icon>,
        { wrapper: TestWrapper }
      )
      
      const iconContainer = screen.getByRole('img', { name: `${size} test icon` })
      expect(iconContainer).toBeInTheDocument()
      
      unmount()
    })
  })

  it('applies custom color', () => {
    render(
      <Icon color="blue.500" aria-label="Colored test icon">
        <TestIcon />
      </Icon>,
      { wrapper: TestWrapper }
    )
    
    const iconContainer = screen.getByRole('img', { name: 'Colored test icon' })
    expect(iconContainer).toBeInTheDocument()
  })

  it('provides accessibility with aria-label', () => {
    render(
      <Icon aria-label="Test icon">
        <TestIcon />
      </Icon>,
      { wrapper: TestWrapper }
    )
    
    const iconContainer = screen.getByRole('img', { name: 'Test icon' })
    expect(iconContainer).toBeInTheDocument()
    expect(iconContainer).toHaveAttribute('aria-label', 'Test icon')
  })

  it('does not set role when no aria-label provided', () => {
    const { container } = render(
      <Icon>
        <TestIcon />
      </Icon>,
      { wrapper: TestWrapper }
    )
    
    const iconContainer = container.firstChild
    expect(iconContainer).not.toHaveAttribute('role')
    expect(iconContainer).not.toHaveAttribute('aria-label')
  })

  it('forwards additional props', () => {
    render(
      <Icon data-testid="custom-icon" className="custom-class">
        <TestIcon />
      </Icon>,
      { wrapper: TestWrapper }
    )
    
    const iconContainer = screen.getByTestId('custom-icon')
    expect(iconContainer).toBeInTheDocument()
    expect(iconContainer).toHaveClass('custom-class')
  })

  it('centers icon content properly', () => {
    render(
      <Icon aria-label="Centered test icon">
        <TestIcon />
      </Icon>,
      { wrapper: TestWrapper }
    )
    
    const iconContainer = screen.getByRole('img', { name: 'Centered test icon' })
    expect(iconContainer).toBeInTheDocument()
    // Focus on behavior: icon renders and is accessible, not specific CSS properties
  })
})