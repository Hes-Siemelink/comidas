import { HStack, Text, Box, IconButton } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { usePlanner } from '../../context/PlannerContext'
import type { Comida, ComidasWeek } from '../../types/schemas'

interface CheckableListItemProps {
  meal: Comida
  showDelete?: boolean
  onEdit?: (meal: Comida) => void
  week?: ComidasWeek
  isCurrentWeek?: boolean
}

function CheckableListItem({ meal, showDelete = false, onEdit, week, isCurrentWeek = false }: CheckableListItemProps) {
  const { t } = useTranslation()
  const { 
    toggleMealComplete, 
    deleteMeal, 
    toggleMealCompleteInWeek, 
    deleteMealFromWeek 
  } = usePlanner()

  const handleToggle = async () => {
    try {
      if (week && !isCurrentWeek) {
        await toggleMealCompleteInWeek(week.id, meal.id)
      } else {
        await toggleMealComplete(meal.id)
      }
    } catch (error) {
      console.error('Failed to toggle meal completion:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(t('planner.meal.confirmDelete', 'Delete this meal?'))) {
      try {
        if (week && !isCurrentWeek) {
          await deleteMealFromWeek(week.id, meal.id)
        } else {
          await deleteMeal(meal.id)
        }
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
        aria-label={
          meal.completed 
            ? t('planner.meal.markIncomplete', 'Mark meal as incomplete')
            : t('planner.meal.markComplete', 'Mark meal as complete')
        }
        style={{
          width: '20px',
          height: '20px',
          cursor: 'pointer'
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

      {showDelete && (
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