import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { WeekManager, WeekCompletionCeremony } from './planner'
import { usePlanner } from '../context/PlannerContext'

function PlannerPage() {
  const { t } = useTranslation()
  const { showCompletionCeremony } = usePlanner()

  return (
    <Box p={8}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading as="h1" mb={2}>{t('planner.title', 'Meal Planner')}</Heading>
          <Text color="gray.600">
            {t('planner.description', 'Plan your weekly family meals.')}
          </Text>
        </Box>

        {/* Week Manager Component */}
        <WeekManager />

        {/* Week Completion Ceremony */}
        {showCompletionCeremony && <WeekCompletionCeremony />}
      </VStack>
    </Box>
  )
}

export default PlannerPage