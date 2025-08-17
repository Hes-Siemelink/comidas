import { render, screen, waitFor } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WeekManager from './WeekManager'
import { PlannerProvider } from '../../context/PlannerContext'

const renderWeekManager = () => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <PlannerProvider>
        <WeekManager />
      </PlannerProvider>
    </ChakraProvider>
  )
}

describe('WeekManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders navigation and display components', () => {
    renderWeekManager()
    
    // Should show navigation
    expect(screen.getByText('Browse Weeks')).toBeInTheDocument()
    
    // Should show current status button
    expect(screen.getByText('Current')).toBeInTheDocument()
  })

  it('shows week creation interface when no current week exists', async () => {
    renderWeekManager()
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading week data...')).not.toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Should show create week option when no week exists
    expect(screen.getByText('Create Week')).toBeInTheDocument()
  })
})
