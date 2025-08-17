import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { vi } from 'vitest'
import WeekNavigation from './WeekNavigation'
import { usePlanner } from '../../context/PlannerContext'

// Mock the usePlanner hook
vi.mock('../../context/PlannerContext', () => ({
  usePlanner: vi.fn()
}))

const mockUsePlanner = usePlanner as ReturnType<typeof vi.fn>

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    {children}
  </ChakraProvider>
)

describe('WeekNavigation', () => {
  const defaultMockPlannerState = {
    getArchivedWeeks: vi.fn(() => []),
    loading: false
  }

  const mockOnStatusChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePlanner.mockReturnValue(defaultMockPlannerState)
  })

  it('renders browse weeks section', () => {
    render(
      <WeekNavigation 
        viewingStatus="current"
        onStatusChange={mockOnStatusChange}
      />,
      { wrapper: TestWrapper }
    )

    expect(screen.getByText('Browse Weeks')).toBeInTheDocument()
  })

  it('shows navigation buttons', () => {
    render(
      <WeekNavigation 
        viewingStatus="current"
        onStatusChange={mockOnStatusChange}
      />,
      { wrapper: TestWrapper }
    )

    expect(screen.getByText('Current')).toBeInTheDocument()
    expect(screen.getByText('Planned')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('shows badge for completed section with count', () => {
    const mockArchivedWeeks = [
      { id: 'week1', status: 'archived' },
      { id: 'week2', status: 'archived' }
    ]
    
    mockUsePlanner.mockReturnValue({
      ...defaultMockPlannerState,
      getArchivedWeeks: vi.fn(() => mockArchivedWeeks)
    })

    render(
      <WeekNavigation 
        viewingStatus="current"
        onStatusChange={mockOnStatusChange}
      />,
      { wrapper: TestWrapper }
    )

    expect(screen.getByText('2')).toBeInTheDocument() // Badge count
  })

  it('calls onStatusChange when status button is clicked', () => {
    render(
      <WeekNavigation 
        viewingStatus="current"
        onStatusChange={mockOnStatusChange}
      />,
      { wrapper: TestWrapper }
    )

    fireEvent.click(screen.getByText('Planned'))
    expect(mockOnStatusChange).toHaveBeenCalledWith('planned')
  })

  it('highlights active status button', () => {
    render(
      <WeekNavigation 
        viewingStatus="planned"
        onStatusChange={mockOnStatusChange}
      />,
      { wrapper: TestWrapper }
    )

    const plannedButton = screen.getByText('Planned')
    const currentButton = screen.getByText('Current')
    
    // Active button should have different styling
    expect(plannedButton).toHaveClass('css-145ldxx') // Active style
    expect(currentButton).toHaveClass('css-gtnuqi') // Inactive style
  })
})
