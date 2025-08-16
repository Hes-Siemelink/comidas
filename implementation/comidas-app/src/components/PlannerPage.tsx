import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { usePlanner } from '../context/PlannerContext'

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
        <Button onClick={() => setWeekPlan(['Pasta', 'Salad', 'Soup'])} colorScheme="teal">
          Set Example Week Plan
        </Button>
      </VStack>
    </Box>
  )
}

export default PlannerPage