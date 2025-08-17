import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, HStack, IconButton } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { usePlanner } from '../../context/PlannerContext'
import CheckableListItem from './CheckableListItem'
import type { Comida, ComidasWeek } from '../../types/schemas'

interface DraggableListItemProps {
  meal: Comida
  showDelete?: boolean
  onEdit?: (meal: Comida) => void
  week?: ComidasWeek
  isCurrentWeek?: boolean
}

function DraggableListItem({ meal, showDelete = false, onEdit, week, isCurrentWeek = false }: DraggableListItemProps) {
  const { t } = useTranslation()
  const { currentWeek, reorderMeals, reorderMealsInWeek } = usePlanner()
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down' | null>(null)
  
  // Use provided week or fall back to currentWeek
  const targetWeek = week || currentWeek
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: meal.id })

  // Combine drag transform with keyboard animation
  const keyboardTransform = isAnimating 
    ? animationDirection === 'up' ? 'translateY(-8px)' : 'translateY(8px)'
    : null
  
  const combinedTransform = keyboardTransform || CSS.Transform.toString(transform)

  const style = {
    transform: combinedTransform,
    transition: isAnimating ? 'transform 200ms ease-out' : transition,
  }

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (!targetWeek) return
    
    const currentIndex = targetWeek.meals
      .sort((a, b) => a.order - b.order)
      .findIndex(m => m.id === meal.id)
    
    if (event.key === 'ArrowUp' && currentIndex > 0) {
      event.preventDefault()
      setAnimationDirection('up')
      setIsAnimating(true)
      
      try {
        if (isCurrentWeek) {
          await reorderMeals(currentIndex, currentIndex - 1)
        } else {
          await reorderMealsInWeek(targetWeek.id, currentIndex, currentIndex - 1)
        }
        setTimeout(() => {
          setIsAnimating(false)
          setAnimationDirection(null)
        }, 200)
      } catch (error) {
        console.error('Failed to move meal up:', error)
        setIsAnimating(false)
        setAnimationDirection(null)
      }
    } else if (event.key === 'ArrowDown' && currentIndex < targetWeek.meals.length - 1) {
      event.preventDefault()
      setAnimationDirection('down')
      setIsAnimating(true)
      
      try {
        if (isCurrentWeek) {
          await reorderMeals(currentIndex, currentIndex + 1)
        } else {
          await reorderMealsInWeek(targetWeek.id, currentIndex, currentIndex + 1)
        }
        setTimeout(() => {
          setIsAnimating(false)
          setAnimationDirection(null)
        }, 200)
      } catch (error) {
        console.error('Failed to move meal down:', error)
        setIsAnimating(false)
        setAnimationDirection(null)
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
            week={week}
            isCurrentWeek={isCurrentWeek}
          />
        </Box>
      </HStack>
    </Box>
  )
}

export default DraggableListItem