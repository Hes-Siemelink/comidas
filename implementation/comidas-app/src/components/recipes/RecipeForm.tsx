import { useState, useEffect } from 'react'
import { 
  Box, 
  VStack, 
  HStack,
  Text,
  Input,
  Textarea,
  Card
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import AccessibleButton from '../ui/AccessibleButton'
import type { Recipe } from '../../types/schemas'

interface RecipeFormProps {
  recipe?: Recipe
  onSave: (recipeData: { name: string; ingredients: string; steps: string }) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

function RecipeForm({ recipe, onSave, onCancel, isSubmitting = false }: RecipeFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    steps: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        steps: recipe.steps
      })
    }
  }, [recipe])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = t('recipes.form.nameRequired', 'Recipe name is required')
    }
    if (!formData.ingredients.trim()) {
      newErrors.ingredients = t('recipes.form.ingredientsRequired', 'Ingredients are required')
    }
    if (!formData.steps.trim()) {
      newErrors.steps = t('recipes.form.stepsRequired', 'Steps are required')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Failed to save recipe:', error)
    }
  }

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const isEditing = !!recipe

  return (
    <Card.Root variant="outline">
      <Card.Header>
        <Text fontSize="lg" fontWeight="semibold">
          {isEditing 
            ? t('recipes.form.editTitle', 'Edit Recipe') 
            : t('recipes.form.addTitle', 'Add New Recipe')
          }
        </Text>
      </Card.Header>
      
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                {t('recipes.form.name', 'Recipe Name')} *
              </Text>
              <Input
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder={t('recipes.form.namePlaceholder', 'Enter recipe name')}
                // invalid={!!errors.name}
                disabled={isSubmitting}
              />
              {errors.name && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.name}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                {t('recipes.form.ingredients', 'Ingredients')} *
              </Text>
              <Textarea
                value={formData.ingredients}
                onChange={(e) => handleFieldChange('ingredients', e.target.value)}
                placeholder={t('recipes.form.ingredientsPlaceholder', 'List ingredients, one per line')}
                rows={6}
                // invalid={!!errors.ingredients}
                disabled={isSubmitting}
              />
              {errors.ingredients && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.ingredients}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                {t('recipes.form.steps', 'Cooking Steps')} *
              </Text>
              <Textarea
                value={formData.steps}
                onChange={(e) => handleFieldChange('steps', e.target.value)}
                placeholder={t('recipes.form.stepsPlaceholder', 'Describe the cooking steps')}
                rows={8}
                // invalid={!!errors.steps}
                disabled={isSubmitting}
              />
              {errors.steps && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.steps}
                </Text>
              )}
            </Box>

            <HStack gap={3} justify="end">
              <AccessibleButton
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {t('recipes.form.cancel', 'Cancel')}
              </AccessibleButton>
              <AccessibleButton
                type="submit"
                variant="primary"
                loading={isSubmitting}
                loadingText={isEditing 
                  ? t('recipes.form.updating', 'Updating...') 
                  : t('recipes.form.saving', 'Saving...')
                }
              >
                {isEditing 
                  ? t('recipes.form.updateButton', 'Update Recipe')
                  : t('recipes.form.saveButton', 'Save Recipe')
                }
              </AccessibleButton>
            </HStack>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  )
}

export default RecipeForm