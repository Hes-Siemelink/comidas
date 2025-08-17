import {
  VStack,
  HStack,
  Text,
  Box,
  Heading
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import AccessibleButton from '../ui/AccessibleButton'
import { usePlanner } from '../../context/PlannerContext'

function WeekCompletionCeremony() {
  const { t } = useTranslation()
  const { 
    showCompletionCeremony, 
    completedWeekData, 
    dismissCeremony, 
    proceedToNextWeek 
  } = usePlanner()
  
  const [showCelebration, setShowCelebration] = useState(false)

  // Only show if ceremony is active and we have completed week data
  if (!showCompletionCeremony || !completedWeekData) {
    return null
  }

  useEffect(() => {
    if (showCompletionCeremony) {
      // Trigger celebration animation after appearing
      const timer = setTimeout(() => setShowCelebration(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowCelebration(false)
    }
  }, [showCompletionCeremony])

  const completedMeals = completedWeekData.meals.filter(meal => meal.completed).length

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0, 0, 0, 0.8)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="overlay"
      p={4}
    >
      <Box
        bg="white"
        borderRadius="xl"
        p={8}
        maxW="lg"
        w="full"
        textAlign="center"
        transform={showCelebration ? "scale(1)" : "scale(0.9)"}
        transition="all 0.3s ease-in-out"
        boxShadow="2xl"
      >
        <VStack gap={6}>
          {/* Celebration Header */}
          <VStack gap={3}>
            <Box
              fontSize="4xl"
              transform={showCelebration ? "scale(1.2)" : "scale(1)"}
              transition="all 0.5s ease-in-out"
            >
              🎉
            </Box>
            <Heading size="lg" color="green.600">
              {t('planner.ceremony.title', 'Week Completed!')}
            </Heading>
            <Text fontSize="lg" fontWeight="medium">
              {t('planner.ceremony.congratulations', 'Congratulations! You\'ve completed your week.')}
            </Text>
          </VStack>
          
          {/* Completion Details */}
          <Box
            bg="green.50"
            border="1px solid"
            borderColor="green.200"
            p={4}
            borderRadius="md"
            w="full"
          >
            <VStack gap={3}>
              <Text fontWeight="bold" color="green.700" fontSize="lg">
                "{completedWeekData.title || t('planner.week.untitled', 'Untitled Week')}"
              </Text>
              <HStack gap={6} justify="center">
                <VStack gap={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {completedMeals}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {t('planner.ceremony.mealsCompleted', 'Meals Completed')}
                  </Text>
                </VStack>
                <Text fontSize="lg" color="gray.400">•</Text>
                <VStack gap={1}>
                  <Text fontSize="sm" color="gray.600">
                    {t('planner.ceremony.completedOn', 'Completed on')}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {new Date().toLocaleDateString()}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          <Text color="gray.600">
            {t(
              'planner.ceremony.archiveMessage', 
              'Your week has been moved to the archive where you can review it anytime.'
            )}
          </Text>

          {/* Action Buttons */}
          <HStack gap={3} w="full" justify="center">
            <AccessibleButton
              variant="outline"
              onClick={dismissCeremony}
            >
              {t('planner.ceremony.viewArchive', 'View Archive')}
            </AccessibleButton>
            <AccessibleButton
              variant="primary"
              onClick={proceedToNextWeek}
            >
              {t('planner.ceremony.planNext', 'Plan Next Week')}
            </AccessibleButton>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}

export default WeekCompletionCeremony
