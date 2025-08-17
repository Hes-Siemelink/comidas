import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, HStack, IconButton } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import CheckableListItem from './CheckableListItem'
import type { Comida } from '../../types/schemas'

interface DraggableListItemProps {
  meal: Comida
  showDelete?: boolean
  onEdit?: (meal: Comida) => void
}

function DraggableListItem({ meal, showDelete = false, onEdit }: DraggableListItemProps) {
  const { t } = useTranslation()
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
          size="sm"
          variant="ghost"
          colorScheme="gray"
          cursor={isDragging ? 'grabbing' : 'grab'}
          _hover={{ bg: 'gray.100' }}
          _active={{ bg: 'gray.200' }}
          minW="32px"
          h="32px"
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