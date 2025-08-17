import { HStack, Text, Box, IconButton } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import type { Comida } from '../../types/schemas'

interface CheckableListItemProps {
  meal: Comida
  showDelete?: boolean
  onEdit?: (meal: Comida) => void
  onToggleComplete?: (meal: Comida) => Promise<void>
  onDelete?: (meal: Comida) => Promise<void>
}

function CheckableListItem({ 
  meal, 
  showDelete = false, 
  onEdit, 
  onToggleComplete,
  onDelete 
}: CheckableListItemProps) {
  const { t } = useTranslation()

  const handleToggle = async () => {
    if (onToggleComplete) {
      try {
        await onToggleComplete(meal)
      } catch (error) {
        console.error('Failed to toggle meal completion:', error)
      }
    }
  }

  const handleDelete = async () => {
    if (onDelete && window.confirm(t('planner.meal.confirmDelete', 'Delete this meal?'))) {
      try {
        await onDelete(meal)
      } catch (error) {
        console.error('Failed to delete meal:', error)
      }
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(meal)
    }
  }

  return (
    <HStack 
      gap={3} 
      p={3}
      bg={meal.completed ? 'green.50' : 'white'}
      borderRadius="md"
      border="1px solid"
      borderColor={meal.completed ? 'green.200' : 'gray.200'}
      _hover={{ borderColor: meal.completed ? 'green.300' : 'gray.300' }}
      transition="all 0.2s"
    >
      <input
        type="checkbox"
        checked={meal.completed}
        onChange={handleToggle}
        disabled={!onToggleComplete}
        aria-label={
          meal.completed 
            ? t('planner.meal.markIncomplete', 'Mark meal as incomplete')
            : t('planner.meal.markComplete', 'Mark meal as complete')
        }
        style={{
          width: '20px',
          height: '20px',
          cursor: onToggleComplete ? 'pointer' : 'default'
        }}
      />
      
      <Box flex={1} onClick={handleEdit} cursor={onEdit ? 'pointer' : 'default'}>
        <Text
          fontSize="md"
          fontWeight="medium"
          textDecoration={meal.completed ? 'line-through' : 'none'}
          color={meal.completed ? 'gray.500' : 'gray.800'}
          _hover={onEdit ? { color: 'blue.600' } : undefined}
        >
          {meal.title}
        </Text>
        
        {meal.notes && (
          <Text fontSize="sm" color="gray.600" mt={1}>
            {meal.notes}
          </Text>
        )}
        
        {meal.assignedTo && (
          <Text fontSize="xs" color="blue.600" mt={1}>
            {t('planner.meal.assignedTo', 'Assigned to: {{name}}', { name: meal.assignedTo })}
          </Text>
        )}
      </Box>

      {showDelete && onDelete && (
        <IconButton
          aria-label={t('planner.meal.delete', 'Delete meal')}
          size="sm"
          variant="ghost"
          colorScheme="red"
          onClick={handleDelete}
        >
          ×
        </IconButton>
      )}
    </HStack>
  )
}

export default CheckableListItem