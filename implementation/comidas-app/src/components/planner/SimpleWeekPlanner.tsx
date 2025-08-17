import { 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Box
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { usePlanner } from '../../context/PlannerContext'
import AccessibleButton from '../ui/AccessibleButton'

function SimpleWeekPlanner() {
  const { t } = useTranslation()
  const { currentWeek, loading, createWeek } = usePlanner()

  const handleCreateWeek = async () => {
    try {
      await createWeek()
    } catch (error) {
      console.error('Failed to create week:', error)
    }
  }

  if (loading) {
    return (
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Text>{t('planner.week.loading', 'Loading week data...')}</Text>
        </Box>
      </VStack>
    )
  }

  if (!currentWeek) {
    return (
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading as="h2" size="lg" mb={2}>
            {t('planner.week.createNew', 'Create New Comidas Week')}
          </Heading>
          <Text color="gray.600">
            {t('planner.week.createDescription', 'Start planning meals for this week - add as many as you need!')}
          </Text>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <VStack gap={4}>
            <AccessibleButton
              variant="primary"
              onClick={handleCreateWeek}
              size="lg"
            >
              {t('planner.week.create', 'Create Week')}
            </AccessibleButton>
          </VStack>
        </Box>
      </VStack>
    )
  }

  return (
    <VStack gap={6} align="stretch">
      {/* Week Header */}
      <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <HStack justify="space-between" align="center" mb={4}>
          <Box>
            {/* Simple static title for test */}
            <Heading size="lg">
              {currentWeek.title || t('planner.week.current', 'Current Week')}
            </Heading>
            <Text color="gray.600" fontSize="sm">
              {t('planner.week.created', 'Created {{date}}', { 
                date: currentWeek.createdAt.toLocaleDateString() 
              })}
            </Text>
          </Box>
        </HStack>
      </Box>
    </VStack>
  )
}

export default SimpleWeekPlanner
