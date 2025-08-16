import { Box, Card, Text, VStack, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import AccessibleButton from '../ui/AccessibleButton'
import type { Recipe } from '../../types/schemas'

interface RecipeListProps {
  recipes: Recipe[]
  onEdit?: (recipe: Recipe) => void
  onView?: (recipe: Recipe) => void
}

function RecipeList({ recipes, onEdit, onView }: RecipeListProps) {
  const { t } = useTranslation()

  if (recipes.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">
          {t('recipes.noRecipes', 'No recipes found. Add your first recipe to get started!')}
        </Text>
      </Box>
    )
  }

  return (
    <VStack gap={4} align="stretch">
      {recipes.map((recipe) => (
        <Card.Root key={recipe.id} variant="outline">
          <Card.Body>
            <VStack align="stretch" gap={3}>
              <HStack justify="space-between" align="start">
                <Box flex={1}>
                  <Text fontSize="lg" fontWeight="semibold" mb={2}>
                    {recipe.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600" lineClamp={2}>
                    {recipe.ingredients.substring(0, 100)}
                    {recipe.ingredients.length > 100 ? '...' : ''}
                  </Text>
                </Box>
                <VStack gap={2}>
                  {onView && (
                    <AccessibleButton 
                      size="sm" 
                      variant="outline"
                      onClick={() => onView(recipe)}
                      aria-label={t('recipes.viewRecipe', 'View recipe details')}
                    >
                      {t('recipes.view', 'View')}
                    </AccessibleButton>
                  )}
                  {onEdit && (
                    <AccessibleButton 
                      size="sm" 
                      variant="secondary"
                      onClick={() => onEdit(recipe)}
                      aria-label={t('recipes.editRecipe', 'Edit recipe')}
                    >
                      {t('recipes.edit', 'Edit')}
                    </AccessibleButton>
                  )}
                </VStack>
              </HStack>
              <Text fontSize="xs" color="gray.400">
                {t('recipes.lastUpdated', 'Last updated')}: {' '}
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }).format(recipe.updatedAt)}
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      ))}
    </VStack>
  )
}

export default RecipeList