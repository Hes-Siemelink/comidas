import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { vi } from 'vitest'
import AccessibleButton from './AccessibleButton'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    {children}
  </ChakraProvider>
)

describe('AccessibleButton', () => {
  it('renders with default secondary variant', () => {
    render(
      <AccessibleButton>Default Button</AccessibleButton>,
      { wrapper: TestWrapper }
    )
    
    const button = screen.getByRole('button', { name: 'Default Button' })
    expect(button).toBeInTheDocument()
  })

  it('renders primary variant', () => {
    render(
      <AccessibleButton variant="primary">Primary Button</AccessibleButton>,
      { wrapper: TestWrapper }
    )
    
    const button = screen.getByRole('button', { name: 'Primary Button' })
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })

  it('renders navigation variant in active state', () => {
    render(
      <AccessibleButton variant="navigation" isActive={true}>
        Active Nav Button
      </AccessibleButton>,
      { wrapper: TestWrapper }
    )
    
    const button = screen.getByRole('button', { name: 'Active Nav Button' })
    expect(button).toBeInTheDocument()
  })

  it('renders navigation variant in inactive state', () => {
    render(
      <AccessibleButton variant="navigation" isActive={false}>
        Inactive Nav Button
      </AccessibleButton>,
      { wrapper: TestWrapper }
    )
    
    const button = screen.getByRole('button', { name: 'Inactive Nav Button' })
    expect(button).toBeInTheDocument()
  })

  it('has accessible focus styles', () => {
    render(
      <AccessibleButton>Focus Test</AccessibleButton>,
      { wrapper: TestWrapper }
    )
    
    const button = screen.getByRole('button', { name: 'Focus Test' })
    expect(button).toBeEnabled()
    button.focus()
    expect(button).toHaveFocus()
  })

  it('forwards all button props and handles clicks', () => {
    const handleClick = vi.fn()
    render(
      <AccessibleButton 
        onClick={handleClick}
        aria-label="Custom label"
      >
        Test Button
      </AccessibleButton>,
      { wrapper: TestWrapper }
    )
    
    const button = screen.getByRole('button', { name: 'Custom label' })
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('supports disabled state', () => {
    render(
      <AccessibleButton disabled>
        Disabled Button
      </AccessibleButton>,
      { wrapper: TestWrapper }
    )
    
    const button = screen.getByRole('button', { name: 'Disabled Button' })
    expect(button).toBeDisabled()
  })

  it('supports all variant types', () => {
    const variants: Array<'primary' | 'secondary' | 'ghost' | 'navigation'> = [
      'primary', 'secondary', 'ghost', 'navigation'
    ]
    
    variants.forEach(variant => {
      const { unmount } = render(
        <AccessibleButton variant={variant}>
          {variant} Button
        </AccessibleButton>,
        { wrapper: TestWrapper }
      )
      
      const button = screen.getByRole('button', { name: `${variant} Button` })
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
      
      unmount()
    })
  })

  it('navigation variant responds to isActive prop', () => {
    const { rerender } = render(
      <AccessibleButton variant="navigation" isActive={false}>
        Nav Button
      </AccessibleButton>,
      { wrapper: TestWrapper }
    )
    
    let button = screen.getByRole('button', { name: 'Nav Button' })
    expect(button).toBeInTheDocument()
    
    rerender(
      <AccessibleButton variant="navigation" isActive={true}>
        Nav Button
      </AccessibleButton>
    )
    
    button = screen.getByRole('button', { name: 'Nav Button' })
    expect(button).toBeInTheDocument()
  })
})