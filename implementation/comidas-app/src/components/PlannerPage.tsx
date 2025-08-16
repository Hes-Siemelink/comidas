import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { usePlanner } from '../context/PlannerContext'
import AccessibleButton from './ui/AccessibleButton'

function PlannerPage() {
  const { t } = useTranslation()
  const { weekPlan, setWeekPlan } = usePlanner()

  return (
    <Box p={8} textAlign="center">
      <VStack gap={6}>
        <Heading as="h1">{t('planner.title', 'Meal Planner')}</Heading>
        <Text>{t('planner.description', 'Plan your weekly family meals.')}</Text>
        <Text fontSize="md" color="gray.700">
          Current week plan: {weekPlan.length > 0 ? weekPlan.join(', ') : 'No meals planned yet.'}
        </Text>
        <AccessibleButton onClick={() => setWeekPlan(['Pasta', 'Salad', 'Soup'])} variant="primary">
          Set Example Week Plan
        </AccessibleButton>
      </VStack>
    </Box>
  )
}

export default PlannerPage