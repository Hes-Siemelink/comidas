import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, HStack, IconButton } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { usePlanner } from '../../context/PlannerContext'
import CheckableListItem from './CheckableListItem'
import type { Comida } from '../../types/schemas'

interface DraggableListItemProps {
  meal: Comida
  showDelete?: boolean
  onEdit?: (meal: Comida) => void
}

function DraggableListItem({ meal, showDelete = false, onEdit }: DraggableListItemProps) {
  const { t } = useTranslation()
  const { currentWeek, reorderMeals } = usePlanner()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: meal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (!currentWeek) return
    
    const currentIndex = currentWeek.meals
      .sort((a, b) => a.order - b.order)
      .findIndex(m => m.id === meal.id)
    
    if (event.key === 'ArrowUp' && currentIndex > 0) {
      event.preventDefault()
      try {
        await reorderMeals(currentIndex, currentIndex - 1)
      } catch (error) {
        console.error('Failed to move meal up:', error)
      }
    } else if (event.key === 'ArrowDown' && currentIndex < currentWeek.meals.length - 1) {
      event.preventDefault()
      try {
        await reorderMeals(currentIndex, currentIndex + 1)
      } catch (error) {
        console.error('Failed to move meal down:', error)
      }
    }
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      opacity={isDragging ? 0.5 : 1}
    >
      <HStack gap={2} align="center">
        {/* Drag handle */}
        <IconButton
          {...attributes}
          {...listeners}
          aria-label={t('planner.meal.dragHandle', 'Drag to reorder meal')}
          title={t('planner.meal.dragHandleTooltip', 'Drag to reorder or use arrow keys to move up/down')}
          size="sm"
          variant="ghost"
          colorScheme="gray"
          cursor={isDragging ? 'grabbing' : 'grab'}
          _hover={{ bg: 'gray.100' }}
          _active={{ bg: 'gray.200' }}
          _focus={{ 
            bg: 'blue.100', 
            borderColor: 'blue.500',
            boxShadow: '0 0 0 2px var(--chakra-colors-blue-200)'
          }}
          minW="32px"
          h="32px"
          onKeyDown={handleKeyDown}
        >
          ⋮⋮
        </IconButton>
        
        {/* Existing CheckableListItem */}
        <Box flex={1}>
          <CheckableListItem
            meal={meal}
            showDelete={showDelete}
            onEdit={onEdit}
          />
        </Box>
      </HStack>
    </Box>
  )
}

export default DraggableListItem