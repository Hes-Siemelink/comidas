import { useState, useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import { usePlanner } from '../../context/PlannerContext'
import WeekNavigation from './WeekNavigation'
import WeekDisplay from './WeekDisplay'
import type { ComidasWeek } from '../../types/schemas'

function WeekManager() {
  const { currentWeek } = usePlanner()
  const [selectedWeek, setSelectedWeek] = useState<ComidasWeek | null>(null)

  // Initialize selected week with current week
  useEffect(() => {
    if (currentWeek && !selectedWeek) {
      setSelectedWeek(currentWeek)
    }
  }, [currentWeek, selectedWeek])

  const handleWeekSelect = (week: ComidasWeek) => {
    setSelectedWeek(week)
  }

  return (
    <VStack gap={6} align="stretch">
      <WeekNavigation 
        onWeekSelect={handleWeekSelect}
        selectedWeek={selectedWeek}
      />
      <WeekDisplay 
        week={selectedWeek}
        isCurrentWeek={selectedWeek?.status === 'current'}
      />
    </VStack>
  )
}

export default WeekManager
