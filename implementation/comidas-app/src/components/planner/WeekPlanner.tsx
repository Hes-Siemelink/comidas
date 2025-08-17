import { 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Box,
  Badge,
  Input
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { usePlanner } from '../../context/PlannerContext'
import AccessibleButton from '../ui/AccessibleButton'
import QuickPlanningForm from './QuickPlanningForm'
import DraggableListItem from './DraggableListItem'

function WeekPlanner() {
  const { t } = useTranslation()
  const { currentWeek, loading, createWeek, completeWeek, reorderMeals, updateWeekTitle, addMeal } = usePlanner()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)
  const mealInputRef = useRef<HTMLInputElement>(null)

  // Auto-select text when entering title edit mode
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      // Small delay to ensure input is focused before selecting
      setTimeout(() => {
        titleInputRef.current?.select()
      }, 0)
    }
  }, [isEditingTitle])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleCreateWeek = async () => {
    try {
      const newWeek = await createWeek()
      // Automatically enter title edit mode for new weeks
      setEditTitle(newWeek.title || t('planner.week.current', 'Current Week'))
      setIsEditingTitle(true)
    } catch (error) {
      console.error('Failed to create week:', error)
    }
  }

  const handleCompleteWeek = async () => {
    if (currentWeek) {
      try {
        await completeWeek()
      } catch (error) {
        console.error('Failed to complete week:', error)
      }
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !currentWeek) return

    const oldIndex = currentWeek.meals.findIndex((meal) => meal.id === active.id)
    const newIndex = currentWeek.meals.findIndex((meal) => meal.id === over.id)

    if (oldIndex !== newIndex) {
      try {
        await reorderMeals(currentWeek.id, oldIndex, newIndex)
      } catch (error) {
        console.error('Failed to reorder meals:', error)
      }
    }
  }

  const completedMeals = currentWeek?.meals.filter(meal => meal.completed).length || 0
  const totalMeals = currentWeek?.mealCount || 0
  const progressPercent = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0

  if (loading) {
    return (
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Text>{t('planner.week.loading', 'Loading week data...')}</Text>
        </Box>
      </VStack>
    )
  }

  if (!currentWeek) {
    return (
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading as="h2" size="lg" mb={2}>
            {t('planner.week.createNew', 'Create New Comidas Week')}
          </Heading>
          <Text color="gray.600">
            {t('planner.week.createDescription', 'Start planning meals for this week - add as many as you need!')}
          </Text>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <VStack gap={4}>
            <AccessibleButton
              variant="primary"
              onClick={handleCreateWeek}
              size="lg"
            >
              {t('planner.week.create', 'Create Week')}
            </AccessibleButton>
          </VStack>
        </Box>
      </VStack>
    )
  }

  return (
    <VStack gap={6} align="stretch">
      {/* Week Header */}
      <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <HStack justify="space-between" align="center" mb={4}>
          <Box>
            {/* Editable week title */}
            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={async () => {
                  const trimmed = editTitle.trim().slice(0, 50)
                  if (trimmed && currentWeek) {
                    await updateWeekTitle(currentWeek.id, trimmed)
                  }
                  setIsEditingTitle(false)
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const trimmed = editTitle.trim().slice(0, 50)
                    if (trimmed && currentWeek) {
                      await updateWeekTitle(currentWeek.id, trimmed)
                    }
                    setIsEditingTitle(false)
                    // Focus the meal input after saving title
                    setTimeout(() => {
                      mealInputRef.current?.focus()
                    }, 100)
                  } else if (e.key === 'Escape') {
                    setIsEditingTitle(false)
                    setEditTitle(currentWeek.title || t('planner.week.current', 'Current Week'))
                  }
                }}
                autoFocus
                maxLength={50}
                fontSize="lg"
                variant="flushed"
              />
            ) : (
              <HStack 
                justifyContent="space-between" 
                alignItems="center"
                onClick={() => {
                  setEditTitle(currentWeek.title || t('planner.week.current', 'Current Week'))
                  setIsEditingTitle(true)
                }}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
                title={t('planner.week.editTitle', 'Click to edit title')}
                width="100%"
              >
                <Heading
                  size="lg"
                  color="inherit"
                  flex="1"
                >
                  {currentWeek.title || t('planner.week.current', 'Current Week')}
                </Heading>
                <Box
                  fontSize="lg"
                  color="gray.500"
                  _groupHover={{ color: 'gray.700' }}
                  ml={2}
                >
                  ✎
                </Box>
              </HStack>
            )}
            <Text color="gray.600" fontSize="sm">
              {t('planner.week.created', 'Created {{date}}', { 
                date: currentWeek.createdAt.toLocaleDateString() 
              })}
            </Text>
          </Box>
          
          <Badge 
            colorScheme={progressPercent === 100 ? 'green' : 'blue'} 
            size="lg"
            px={3}
            py={1}
          >
            {completedMeals}/{totalMeals} {t('planner.week.completed', 'completed')}
          </Badge>
        </HStack>

        <Box
          w="full"
          h={2}
          bg="gray.200"
          borderRadius="full"
          mb={4}
          overflow="hidden"
        >
          <Box
            h="full"
            bg="green.500"
            w={`${progressPercent}%`}
            transition="width 0.3s"
          />
        </Box>

        <HStack gap={3}>
          <AccessibleButton
            variant="outline"
            onClick={handleCompleteWeek}
            disabled={totalMeals === 0}
          >
            {t('planner.week.complete', 'Complete Week')}
          </AccessibleButton>
        </HStack>
      </Box>

      {/* Combined Meal List with Quick Entry */}
      <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Heading as="h3" size="md" mb={4}>
          {t('planner.week.mealList', 'Meal List')}
        </Heading>
        <VStack gap={3} align="stretch">
          {/* Existing meals with drag-and-drop */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentWeek.meals.map(meal => meal.id)}
              strategy={verticalListSortingStrategy}
            >
              {currentWeek.meals
                .sort((a, b) => a.order - b.order)
                .map((meal) => (
                  <DraggableListItem
                    key={meal.id}
                    meal={meal}
                    week={currentWeek}
                    showDelete={true}
                  />
                ))}
            </SortableContext>
          </DndContext>
          
          {/* Quick entry form at the bottom */}
          {currentWeek && (
            <QuickPlanningForm 
              ref={mealInputRef} 
              week={currentWeek}
              onAddMeal={(mealTitle) => currentWeek ? addMeal(currentWeek.id, mealTitle).then(() => {}) : Promise.resolve()}
            />
          )}
        </VStack>
      </Box>
    </VStack>
  )
}

export default WeekPlanner