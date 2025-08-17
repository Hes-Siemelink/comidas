import { 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Box,
  Badge
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { usePlanner } from '../../context/PlannerContext'
import AccessibleButton from '../ui/AccessibleButton'
import QuickPlanningForm from './QuickPlanningForm'
import CheckableListItem from './CheckableListItem'

function WeekPlanner() {
  const { t } = useTranslation()
  const { currentWeek, loading, createWeek, completeWeek } = usePlanner()

  const handleCreateWeek = async () => {
    try {
      await createWeek()
    } catch (error) {
      console.error('Failed to create week:', error)
    }
  }

  const handleCompleteWeek = async () => {
    if (currentWeek && window.confirm(t('planner.week.confirmComplete', 'Complete this week and archive it?'))) {
      try {
        await completeWeek()
      } catch (error) {
        console.error('Failed to complete week:', error)
      }
    }
  }

  const completedMeals = currentWeek?.meals.filter(meal => meal.completed).length || 0
  const totalMeals = currentWeek?.mealCount || 0
  const progressPercent = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0

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
            <Heading as="h2" size="lg">
              {currentWeek.title || t('planner.week.current', 'Current Week')}
            </Heading>
            <Text color="gray.600" fontSize="sm">
              {t('planner.week.created', 'Created {{date}}', { 
                date: currentWeek.createdAt.toLocaleDateString() 
              })}
            </Text>
          </Box>
          
          <Badge 
            colorScheme={progressPercent === 100 ? 'green' : 'blue'} 
            size="lg"
            px={3}
            py={1}
          >
            {completedMeals}/{totalMeals} {t('planner.week.completed', 'completed')}
          </Badge>
        </HStack>

        <Box
          w="full"
          h={2}
          bg="gray.200"
          borderRadius="full"
          mb={4}
          overflow="hidden"
        >
          <Box
            h="full"
            bg="green.500"
            w={`${progressPercent}%`}
            transition="width 0.3s"
          />
        </Box>

        <HStack gap={3}>
          <AccessibleButton
            variant="outline"
            onClick={handleCompleteWeek}
            disabled={totalMeals === 0}
          >
            {t('planner.week.complete', 'Complete Week')}
          </AccessibleButton>
        </HStack>
      </Box>

      {/* Combined Meal List with Quick Entry */}
      <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Heading as="h3" size="md" mb={4}>
          {t('planner.week.mealList', 'Meal List')}
        </Heading>
        <VStack gap={3} align="stretch">
          {/* Existing meals */}
          {currentWeek.meals
            .sort((a, b) => a.order - b.order)
            .map((meal) => (
              <CheckableListItem
                key={meal.id}
                meal={meal}
                showDelete={true}
              />
            ))}
          
          {/* Quick entry form at the bottom */}
          <QuickPlanningForm />
        </VStack>
      </Box>
    </VStack>
  )
}

export default WeekPlanner