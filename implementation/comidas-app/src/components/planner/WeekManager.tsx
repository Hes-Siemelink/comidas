import { useState } from 'react'
import { VStack } from '@chakra-ui/react'
import WeekNavigation from './WeekNavigation'
import WeekDisplay from './WeekDisplay'
import type { WeekStatus } from '../../types/schemas'

function WeekManager() {
  const [viewingStatus, setViewingStatus] = useState<WeekStatus>('current')

  return (
    <VStack gap={6} align="stretch">
      <WeekNavigation 
        viewingStatus={viewingStatus}
        onStatusChange={setViewingStatus}
      />
      <WeekDisplay viewingStatus={viewingStatus} />
    </VStack>
  )
}

export default WeekManager
