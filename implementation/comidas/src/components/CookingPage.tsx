import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

function CookingPage() {
  const { t } = useTranslation()

  return (
    <Box p={8} textAlign="center">
      <VStack gap={6}>
        <Heading as="h1">{t('cooking.title', 'Cooking Assistant')}</Heading>
        <Text>{t('cooking.description', 'Step-by-step cooking guidance and timers.')}</Text>
        
        <Text fontSize="sm" color="gray.500">
          Cooking assistant functionality coming soon...
        </Text>
      </VStack>
    </Box>
  )
}

export default CookingPage