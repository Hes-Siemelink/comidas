import {
  HStack,
  VStack,
  Text,
  Badge,
  Box,
  Heading
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { usePlanner } from '../../context/PlannerContext'
import AccessibleButton from '../ui/AccessibleButton'
import type { WeekStatus } from '../../types/schemas'

interface WeekNavigationProps {
  viewingStatus: WeekStatus
  onStatusChange: (status: WeekStatus) => void
}

function WeekNavigation({ viewingStatus, onStatusChange }: WeekNavigationProps) {
  const { t } = useTranslation()
  const { 
    getArchivedWeeks
  } = usePlanner()
  
  // Get archived weeks count for badge (only section that shows multiple weeks)
  const archivedWeeks = getArchivedWeeks()

  const handleStatusNavigation = (status: WeekStatus) => {
    onStatusChange(status)
  }

  const getStatusBadgeColor = (status: WeekStatus) => {
    switch (status) {
      case 'current': return 'blue'
      case 'planned': return 'orange'
      case 'archived': return 'gray'
      default: return 'gray'
    }
  }

  const getStatusLabel = (status: WeekStatus) => {
    switch (status) {
      case 'current': return t('planner.navigation.current', 'Current')
      case 'planned': return t('planner.navigation.planned', 'Planned')
      case 'archived': return t('planner.navigation.completed', 'Completed')
      default: return status
    }
  }

  return (
    <VStack gap={4} align="stretch">
      {/* Status Navigation */}
      <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Heading size="sm" mb={3}>
          {t('planner.navigation.browseWeeks', 'Browse Weeks')}
        </Heading>
        
        <HStack gap={2} flexWrap="wrap">
          <AccessibleButton
            variant="navigation"
            isActive={viewingStatus === 'archived'}
            onClick={() => handleStatusNavigation('archived')}
            disabled={archivedWeeks.length === 0}
            size="sm"
          >
            <HStack gap={2}>
              <Text>{getStatusLabel('archived')}</Text>
              <Badge colorScheme={getStatusBadgeColor('archived')}>
                {archivedWeeks.length}
              </Badge>
            </HStack>
          </AccessibleButton>

          <AccessibleButton
            variant="navigation"
            isActive={viewingStatus === 'current'}
            onClick={() => handleStatusNavigation('current')}
            size="sm"
          >
            {getStatusLabel('current')}
          </AccessibleButton>

          <AccessibleButton
            variant="navigation"
            isActive={viewingStatus === 'planned'}
            onClick={() => handleStatusNavigation('planned')}
            size="sm"
          >
            {getStatusLabel('planned')}
          </AccessibleButton>
        </HStack>
      </Box>
    </VStack>
  )
}

export default WeekNavigation
