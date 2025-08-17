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
import type { ComidasWeek } from '../../types/schemas'

interface WeekDisplayProps {
  week: ComidasWeek | null
  isCurrentWeek: boolean
}

function WeekDisplay({ week, isCurrentWeek }: WeekDisplayProps) {
  const { t } = useTranslation()
  const { loading, createWeek, completeWeek, reorderMeals, updateWeekTitle } = usePlanner()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)
  const mealInputRef = useRef<HTMLInputElement>(null)

  // Auto-select text when entering title edit mode
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
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
      setEditTitle(newWeek.title || t('planner.week.current', 'Current Week'))
      setIsEditingTitle(true)
    } catch (error) {
      console.error('Failed to create week:', error)
    }
  }

  const handleCompleteWeek = async () => {
    if (week && window.confirm(t('planner.week.confirmComplete', 'Complete this week and archive it?'))) {
      try {
        await completeWeek()
      } catch (error) {
        console.error('Failed to complete week:', error)
      }
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !week || !isCurrentWeek) return

    const oldIndex = week.meals.findIndex((meal) => meal.id === active.id)
    const newIndex = week.meals.findIndex((meal) => meal.id === over.id)

    if (oldIndex !== newIndex) {
      try {
        await reorderMeals(oldIndex, newIndex)
      } catch (error) {
        console.error('Failed to reorder meals:', error)
      }
    }
  }

  const completedMeals = week?.meals.filter(meal => meal.completed).length || 0
  const totalMeals = week?.mealCount || 0
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

  if (!week) {
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
            {/* Editable week title - only for current weeks */}
            {isEditingTitle && isCurrentWeek ? (
              <Input
                ref={titleInputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={async () => {
                  const trimmed = editTitle.trim().slice(0, 50)
                  if (trimmed) {
                    await updateWeekTitle(trimmed)
                  }
                  setIsEditingTitle(false)
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const trimmed = editTitle.trim().slice(0, 50)
                    if (trimmed) {
                      await updateWeekTitle(trimmed)
                    }
                    setIsEditingTitle(false)
                    setTimeout(() => {
                      mealInputRef.current?.focus()
                    }, 100)
                  } else if (e.key === 'Escape') {
                    setIsEditingTitle(false)
                    setEditTitle(week.title || t('planner.week.current', 'Current Week'))
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
                onClick={isCurrentWeek ? () => {
                  setEditTitle(week.title || t('planner.week.current', 'Current Week'))
                  setIsEditingTitle(true)
                } : undefined}
                cursor={isCurrentWeek ? "pointer" : "default"}
                _hover={isCurrentWeek ? { opacity: 0.8 } : undefined}
                title={isCurrentWeek ? t('planner.week.editTitle', 'Click to edit title') : undefined}
                width="100%"
              >
                <Heading
                  size="lg"
                  color="inherit"
                  flex="1"
                >
                  {week.title || t('planner.week.current', 'Current Week')}
                </Heading>
                {isCurrentWeek && (
                  <Box
                    fontSize="lg"
                    color="gray.500"
                    _groupHover={{ color: 'gray.700' }}
                    ml={2}
                  >
                    ✎
                  </Box>
                )}
              </HStack>
            )}
            <HStack gap={2} align="center">
              <Text color="gray.600" fontSize="sm">
                {t('planner.week.created', 'Created {{date}}', { 
                  date: week.createdAt.toLocaleDateString() 
                })}
              </Text>
              <Badge colorScheme={
                week.status === 'current' ? 'blue' : 
                week.status === 'planned' ? 'orange' : 'gray'
              } size="sm">
                {week.status}
              </Badge>
            </HStack>
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
          {isCurrentWeek && (
            <AccessibleButton
              variant="outline"
              onClick={handleCompleteWeek}
              disabled={totalMeals === 0}
            >
              {t('planner.week.complete', 'Complete Week')}
            </AccessibleButton>
          )}
          {week.status === 'archived' && (
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              {t('planner.week.archived', 'This week has been completed and archived')}
            </Text>
          )}
          {week.status === 'planned' && (
            <Text fontSize="sm" color="orange.600" fontStyle="italic">
              {t('planner.week.planned', 'This is a planned week for the future')}
            </Text>
          )}
        </HStack>
      </Box>

      {/* Meal List */}
      <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Heading as="h3" size="md" mb={4}>
          {t('planner.week.mealList', 'Meal List')}
        </Heading>
        <VStack gap={3} align="stretch">
          {/* Existing meals with drag-and-drop (only for current weeks) */}
          {isCurrentWeek ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={week.meals.map(meal => meal.id)}
                strategy={verticalListSortingStrategy}
              >
                {week.meals
                  .sort((a, b) => a.order - b.order)
                  .map((meal) => (
                    <DraggableListItem
                      key={meal.id}
                      meal={meal}
                      showDelete={true}
                    />
                  ))}
              </SortableContext>
            </DndContext>
          ) : (
            // Read-only view for planned/archived weeks
            <>
              {week.meals
                .sort((a, b) => a.order - b.order)
                .map((meal) => (
                  <DraggableListItem
                    key={meal.id}
                    meal={meal}
                    showDelete={false}
                  />
                ))}
            </>
          )}
          
          {/* Quick entry form only for current weeks */}
          {isCurrentWeek && <QuickPlanningForm ref={mealInputRef} />}
          
          {/* Empty state for non-current weeks */}
          {!isCurrentWeek && week.meals.length === 0 && (
            <Text color="gray.500" textAlign="center" py={4} fontStyle="italic">
              {week.status === 'planned' 
                ? t('planner.week.emptyPlanned', 'No meals planned yet') 
                : t('planner.week.emptyArchived', 'No meals were recorded')
              }
            </Text>
          )}
        </VStack>
      </Box>
    </VStack>
  )
}

export default WeekDisplay
