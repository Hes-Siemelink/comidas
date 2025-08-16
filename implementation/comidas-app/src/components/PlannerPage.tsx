import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

function PlannerPage() {
  const { t } = useTranslation()

  return (
    <Box p={8} textAlign="center">
      <VStack gap={6}>
        <Heading as="h1">{t('planner.title', 'Meal Planner')}</Heading>
        <Text>{t('planner.description', 'Plan your weekly family meals.')}</Text>
        
        <Text fontSize="sm" color="gray.500">
          Meal planning functionality coming soon...
        </Text>
      </VStack>
    </Box>
  )
}

export default PlannerPage