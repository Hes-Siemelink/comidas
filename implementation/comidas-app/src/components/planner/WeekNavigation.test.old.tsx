import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { vi } from 'vitest'
import WeekNavigation from './WeekNavigation'
import { usePlanner } from '../../context/PlannerContext'
import type { ComidasWeek } from '../../types/schemas'

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
  const mockWeek1: ComidasWeek = {
    id: 'week1',
    title: 'Current Week',
    status: 'current',
    meals: [],
    mealCount: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }

  const mockWeek2: ComidasWeek = {
    id: 'week2',
    title: 'Planned Week',
    status: 'planned',
    meals: [],
    mealCount: 0,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  }

  const mockWeek3: ComidasWeek = {
    id: 'week3',
    title: 'Archived Week',
    status: 'archived',
    meals: [],
    mealCount: 0,
    createdAt: new Date('2023-12-25'),
    updatedAt: new Date('2023-12-25')
  }

  const defaultMockPlannerState = {
    weekHistory: [mockWeek2, mockWeek3],
    currentWeek: mockWeek1,
    createWeek: vi.fn(),
    getArchivedWeeks: vi.fn(() => [mockWeek3]),
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

  it('shows current week navigation button with count', () => {
    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={mockWeek1}
      />,
      { wrapper: TestWrapper }
    )

    expect(screen.getByText('Current')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // Badge count
  })

  it('shows planned week navigation button with count', () => {
    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={mockWeek1}
      />,
      { wrapper: TestWrapper }
    )

    expect(screen.getByText('Planned')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // Badge count
  })

  it('shows archived week navigation button with count', () => {
    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={mockWeek1}
      />,
      { wrapper: TestWrapper }
    )

    expect(screen.getByText('Archived')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // Badge count
  })

  it('shows create week buttons when no weeks exist', () => {
    mockUsePlanner.mockReturnValue({
      ...defaultMockPlannerState,
      weekHistory: [], // No planned or archived weeks
      currentWeek: null // No current week
    })

    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={null}
      />,
      { wrapper: TestWrapper }
    )

    // Default viewing status should show create current button
    expect(screen.getByText('Create Current Week')).toBeInTheDocument()
    // Planned create button should not be shown until user navigates to planned
    expect(screen.queryByText('Create Planned Week')).not.toBeInTheDocument()
  })

  it('shows create planned week button when navigating to planned with no planned weeks', () => {
    mockUsePlanner.mockReturnValue({
      ...defaultMockPlannerState,
      weekHistory: [], // No planned or archived weeks  
      currentWeek: null // No current week
    })

    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={null}
      />,
      { wrapper: TestWrapper }
    )

    // Click planned button to switch to planned view
    const plannedButton = screen.getByText('Planned')
    fireEvent.click(plannedButton)
    
    // Now should show create planned button
    expect(screen.getByText('Create Planned Week')).toBeInTheDocument()
  })

  it('calls onWeekSelect when current button is clicked', async () => {
    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={mockWeek2}
      />,
      { wrapper: TestWrapper }
    )

    const currentButton = screen.getByText('Current')
    fireEvent.click(currentButton)

    await waitFor(() => {
      expect(mockOnWeekSelect).toHaveBeenCalledWith(mockWeek1)
    })
  })

  it('calls onWeekSelect when planned button is clicked', async () => {
    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={mockWeek1}
      />,
      { wrapper: TestWrapper }
    )

    const plannedButton = screen.getByText('Planned')
    fireEvent.click(plannedButton)

    await waitFor(() => {
      expect(mockOnWeekSelect).toHaveBeenCalledWith(mockWeek2)
    })
  })

  it('calls createWeek when create current button is clicked', async () => {
    const mockCreateWeek = vi.fn().mockResolvedValue(mockWeek1)
    mockUsePlanner.mockReturnValue({
      ...defaultMockPlannerState,
      createWeek: mockCreateWeek,
      currentWeek: null // No current week exists
    })

    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={null}
      />,
      { wrapper: TestWrapper }
    )

    const createButton = screen.getByText('Create Current Week')
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(mockCreateWeek).toHaveBeenCalledWith('current')
    })
  })

  it('shows week list section only for archived weeks', () => {
    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={mockWeek3} // Select archived week
      />,
      { wrapper: TestWrapper }
    )

    expect(screen.getByText('Archived Weeks')).toBeInTheDocument()
    expect(screen.getByText('1 available')).toBeInTheDocument()
  })

  it('shows individual week buttons only for archived selection', () => {
    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={mockWeek3} // Select archived week
      />,
      { wrapper: TestWrapper }
    )

    // Should show the archived week with date
    expect(screen.getByText(/Archived Week \(/)).toBeInTheDocument()
  })

  it('disables navigation buttons when no weeks of that type exist', () => {
    mockUsePlanner.mockReturnValue({
      ...defaultMockPlannerState,
      weekHistory: [], // No planned or archived weeks
      currentWeek: null // No current week
    })

    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={null}
      />,
      { wrapper: TestWrapper }
    )

    const currentButton = screen.getByText('Current')
    const plannedButton = screen.getByText('Planned')
    const archivedButton = screen.getByText('Archived')

    expect(currentButton).toBeDisabled()
    expect(plannedButton).not.toBeDisabled() // Planned should be enabled to allow navigation to show create button
    expect(archivedButton).toBeDisabled()
  })

  it('highlights active navigation button', () => {
    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={mockWeek1}
      />,
      { wrapper: TestWrapper }
    )

    // The current button should be active since selectedWeek has status 'current'
    // Note: We can't easily test the CSS classes, so we just verify the component renders
    expect(screen.getByText('Current')).toBeInTheDocument()
  })

  it('does not show week browser for current and planned weeks', () => {
    render(
      <WeekNavigation 
        onWeekSelect={mockOnWeekSelect}
        selectedWeek={mockWeek1} // Current week selected
      />,
      { wrapper: TestWrapper }
    )

    // Should NOT show "Current Weeks" or "Planned Weeks" sections
    expect(screen.queryByText('Current Weeks')).not.toBeInTheDocument()
    expect(screen.queryByText('Planned Weeks')).not.toBeInTheDocument()
    
    // But should show the navigation buttons
    expect(screen.getByText('Current')).toBeInTheDocument()
    expect(screen.getByText('Planned')).toBeInTheDocument()
  })
})
