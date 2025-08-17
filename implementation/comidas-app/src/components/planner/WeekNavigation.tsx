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
import type { ComidasWeek, WeekStatus } from '../../types/schemas'

interface WeekNavigationProps {
  onWeekSelect: (week: ComidasWeek) => void
  selectedWeek: ComidasWeek | null
}

function WeekNavigation({ onWeekSelect, selectedWeek }: WeekNavigationProps) {
  const { t } = useTranslation()
  const { 
    weekHistory,
    currentWeek,
    createWeek,
    loading 
  } = usePlanner()

  // Group weeks by status
  const allWeeks = [...(currentWeek ? [currentWeek] : []), ...weekHistory]
  const currentWeeks = allWeeks.filter(week => week.status === 'current')
  const plannedWeeks = allWeeks.filter(week => week.status === 'planned')
  const archivedWeeks = allWeeks.filter(week => week.status === 'archived')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Most recent first

  const handleStatusNavigation = (status: WeekStatus) => {
    let targetWeek: ComidasWeek | undefined
    
    switch (status) {
      case 'current':
        targetWeek = currentWeeks[0] || currentWeek
        break
      case 'planned':
        targetWeek = plannedWeeks[0]
        break
      case 'archived':
        targetWeek = archivedWeeks[0]
        break
    }
    
    if (targetWeek) {
      onWeekSelect(targetWeek)
    }
  }

  const handleCreatePlannedWeek = async () => {
    try {
      const newWeek = await createWeek('planned')
      onWeekSelect(newWeek)
    } catch (error) {
      console.error('Failed to create planned week:', error)
    }
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
      case 'archived': return t('planner.navigation.archived', 'Archived')
      default: return status
    }
  }

  const getWeekDisplayName = (week: ComidasWeek) => {
    const baseTitle = week.title || t('planner.week.untitled', 'Untitled Week')
    const date = week.createdAt.toLocaleDateString()
    return `${baseTitle} (${date})`
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
            isActive={selectedWeek?.status === 'archived'}
            onClick={() => handleStatusNavigation('archived')}
            disabled={archivedWeeks.length === 0}
            size="sm"
          >
            {getStatusLabel('archived')}
            {archivedWeeks.length > 0 && (
              <Badge ml={2} colorScheme={getStatusBadgeColor('archived')} size="sm">
                {archivedWeeks.length}
              </Badge>
            )}
          </AccessibleButton>

          <AccessibleButton
            variant="navigation"
            isActive={selectedWeek?.status === 'current'}
            onClick={() => handleStatusNavigation('current')}
            disabled={currentWeeks.length === 0}
            size="sm"
          >
            {getStatusLabel('current')}
          </AccessibleButton>

          <AccessibleButton
            variant="navigation"
            isActive={selectedWeek?.status === 'planned'}
            onClick={() => handleStatusNavigation('planned')}
            disabled={plannedWeeks.length === 0}
            size="sm"
          >
            {getStatusLabel('planned')}
          </AccessibleButton>

          {/* Create planned week button */}
          <AccessibleButton
            variant="outline"
            onClick={handleCreatePlannedWeek}
            disabled={loading}
            size="sm"
          >
            {t('planner.navigation.createPlanned', '+ Plan Ahead')}
          </AccessibleButton>
        </HStack>
      </Box>

      {/* Week List for Current Status */}
      {selectedWeek && (
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <VStack gap={3} align="stretch">
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="medium">
                {getStatusLabel(selectedWeek.status)} {t('planner.navigation.weeks', 'Weeks')}
              </Text>
              <Badge colorScheme={getStatusBadgeColor(selectedWeek.status)} size="sm">
                {selectedWeek.status === 'current' ? currentWeeks.length : 
                 selectedWeek.status === 'planned' ? plannedWeeks.length : 
                 archivedWeeks.length} {t('planner.navigation.available', 'available')}
              </Badge>
            </HStack>

            {/* Week Buttons */}
            <VStack gap={2} align="stretch">
              {selectedWeek.status === 'current' && currentWeeks.map(week => (
                <AccessibleButton
                  key={week.id}
                  variant={week.id === selectedWeek.id ? 'primary' : 'ghost'}
                  onClick={() => onWeekSelect(week)}
                  size="sm"
                  textAlign="left"
                  justifyContent="flex-start"
                >
                  {getWeekDisplayName(week)}
                </AccessibleButton>
              ))}
              {selectedWeek.status === 'planned' && plannedWeeks.map(week => (
                <AccessibleButton
                  key={week.id}
                  variant={week.id === selectedWeek.id ? 'primary' : 'ghost'}
                  onClick={() => onWeekSelect(week)}
                  size="sm"
                  textAlign="left"
                  justifyContent="flex-start"
                >
                  {getWeekDisplayName(week)}
                </AccessibleButton>
              ))}
              {selectedWeek.status === 'archived' && archivedWeeks.map(week => (
                <AccessibleButton
                  key={week.id}
                  variant={week.id === selectedWeek.id ? 'primary' : 'ghost'}
                  onClick={() => onWeekSelect(week)}
                  size="sm"
                  textAlign="left"
                  justifyContent="flex-start"
                >
                  {getWeekDisplayName(week)}
                </AccessibleButton>
              ))}
            </VStack>
          </VStack>
        </Box>
      )}
    </VStack>
  )
}

export default WeekNavigation
