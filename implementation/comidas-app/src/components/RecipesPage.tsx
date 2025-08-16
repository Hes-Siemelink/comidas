import { useState } from 'react'
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Spinner,
  Alert
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useRecipes } from '../context/RecipeContext'
import { RecipeList, RecipeForm, RecipeSearchBar } from './recipes'
import AccessibleButton from './ui/AccessibleButton'
import type { Recipe } from '../types/schemas'

function RecipesPage() {
  const { t } = useTranslation()
  const { 
    recipes, 
    loading, 
    error, 
    createRecipe, 
    updateRecipe, 
    searchRecipes 
  } = useRecipes()
  
  const [showForm, setShowForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get filtered recipes based on search
  const displayedRecipes = searchQuery ? searchRecipes(searchQuery) : recipes

  const handleAddNew = () => {
    setEditingRecipe(null)
    setShowForm(true)
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setShowForm(true)
  }

  const handleSave = async (recipeData: { name: string; ingredients: string; steps: string }) => {
    try {
      setIsSubmitting(true)
      
      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, recipeData)
      } else {
        await createRecipe(recipeData)
      }
      
      setShowForm(false)
      setEditingRecipe(null)
    } catch (err) {
      console.error('Failed to save recipe:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingRecipe(null)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  if (loading && recipes.length === 0) {
    return (
      <Box p={8} textAlign="center">
        <VStack gap={4}>
          <Spinner size="lg" />
          <Text>{t('recipes.loading', 'Loading recipes...')}</Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box p={8}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading as="h1" mb={2}>{t('recipes.title', 'Recipe Database')}</Heading>
          <Text color="gray.600">
            {t('recipes.description', 'Browse and manage your family recipes.')}
          </Text>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert.Root status="error">
            <Alert.Title>
              {t('recipes.errorTitle', 'Error loading recipes')}
            </Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        )}

        {/* Form */}
        {showForm && (
          <RecipeForm
            recipe={editingRecipe || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Search and Add Button */}
        {!showForm && (
          <HStack gap={4} align="end">
            <Box flex={1}>
              <RecipeSearchBar 
                onSearch={handleSearch}
                disabled={loading}
              />
            </Box>
            <AccessibleButton
              variant="primary"
              onClick={handleAddNew}
              disabled={loading}
            >
              {t('recipes.addNew', 'Add New Recipe')}
            </AccessibleButton>
          </HStack>
        )}

        {/* Recipe List */}
        {!showForm && (
          <Box>
            {searchQuery && (
              <Text fontSize="sm" color="gray.600" mb={4}>
                {displayedRecipes.length === 0 
                  ? t('recipes.noSearchResults', 'No recipes found for "{{query}}"', { query: searchQuery })
                  : t('recipes.searchResults', 'Found {{count}} recipe(s) for "{{query}}"', { 
                      count: displayedRecipes.length, 
                      query: searchQuery 
                    })
                }
              </Text>
            )}
            
            <RecipeList
              recipes={displayedRecipes}
              onEdit={handleEdit}
            />
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default RecipesPage