import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

function RecipesPage() {
  const { t } = useTranslation()

  return (
    <Box p={8} textAlign="center">
      <VStack gap={6}>
        <Heading as="h1">{t('recipes.title', 'Recipe Database')}</Heading>
        <Text>{t('recipes.description', 'Browse and manage your family recipes.')}</Text>
        
        <Text fontSize="sm" color="gray.500">
          Recipe database functionality coming soon...
        </Text>
      </VStack>
    </Box>
  )
}

export default RecipesPage