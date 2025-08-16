import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

function HomePage() {
  const { t } = useTranslation()

  return (
    <Box p={8} textAlign="center">
      <VStack gap={6}>
        <Heading>{t('app.title', 'Family Recipe App')}</Heading>
        <Text>{t('app.description', 'Record recipes, plan family meals and have a handy assistant while cooking!')}</Text>
        
        {/* Placeholder for the three main sections that will be added in future stories */}
        <Text fontSize="sm" color="gray.500">
          Home page sections coming soon...
        </Text>
      </VStack>
    </Box>
  )
}

export default HomePage