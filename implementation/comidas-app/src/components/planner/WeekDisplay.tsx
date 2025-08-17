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
import type { ComidasWeek, WeekStatus, Comida } from '../../types/schemas'

// Constants
const MAX_TITLE_LENGTH = 50
const TITLE_INPUT_FOCUS_DELAY = 100

interface WeekDisplayProps {
  viewingStatus: WeekStatus
}

// Helper functions
const calculateProgress = (week: ComidasWeek | null) => {
  if (!week) return { completedMeals: 0, totalMeals: 0, progressPercent: 0 }
  
  const completedMeals = week.meals.filter(meal => meal.completed).length
  const totalMeals = week.mealCount || 0
  const progressPercent = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0
  
  return { completedMeals, totalMeals, progressPercent }
}

const handleTitleUpdate = async (
  editTitle: string,
  week: ComidasWeek | null,
  updateWeekTitle: (weekId: string, title: string) => Promise<any>
) => {
  const trimmed = editTitle.trim().slice(0, MAX_TITLE_LENGTH)
  if (trimmed && week) {
    await updateWeekTitle(week.id, trimmed)
  }
}

const renderMealItems = (
  week: ComidasWeek,
  isEditable: boolean,
  handleMealToggleComplete: (meal: Comida) => Promise<void>,
  handleMealDelete: (meal: Comida) => Promise<void>,
  handleMealReorder: (fromIndex: number, toIndex: number) => Promise<void>
) => {
  const sortedMeals = week.meals.sort((a, b) => a.order - b.order)
  
  return sortedMeals.map((meal, index) => (
    <DraggableListItem
      key={meal.id}
      meal={meal}
      showDelete={isEditable}
      onToggleComplete={isEditable ? handleMealToggleComplete : undefined}
      onDelete={isEditable ? handleMealDelete : undefined}
      onReorder={isEditable ? handleMealReorder : undefined}
      currentIndex={index}
      totalItems={week.meals.length}
    />
  ))
}

const getStatusBadgeColor = (status: WeekStatus): string => {
  switch (status) {
    case 'current': return 'blue'
    case 'planned': return 'orange'
    default: return 'gray'
  }
}

function WeekDisplay({ viewingStatus }: WeekDisplayProps) {
  const { t } = useTranslation()
  const { 
    loading,
    getCurrentWeek,
    getPlannedWeek,
    getArchivedWeeks,
    getLatestArchivedWeek,
    createWeek, 
    completeWeek, 
    reorderMeals, 
    updateWeekTitle,
    addMeal,
    toggleMealComplete,
    deleteMeal
  } = usePlanner()
  
  // For archived section, we need to track which week is selected
  const [selectedArchivedWeekId, setSelectedArchivedWeekId] = useState<string | null>(null)

  // Determine which week to display based on viewing status
  const determineWeekToDisplay = (): ComidasWeek | null => {
    switch (viewingStatus) {
      case 'current':
        return getCurrentWeek()
      case 'planned':
        return getPlannedWeek()
      case 'archived':
        const archivedWeeks = getArchivedWeeks()
        if (selectedArchivedWeekId) {
          return archivedWeeks.find(week => week.id === selectedArchivedWeekId) || null
        }
        return getLatestArchivedWeek()
      default:
        return null
    }
  }

  const week = determineWeekToDisplay()
  const isCurrentWeek = week?.status === 'current'
  const isEditable = week?.status === 'current' || week?.status === 'planned'
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
      const newWeek = await createWeek(viewingStatus)
      setEditTitle(newWeek.title || t('planner.week.current', 'Current Week'))
      setIsEditingTitle(true)
    } catch (error) {
      console.error('Failed to create week:', error)
    }
  }

  const handleCompleteWeek = async () => {
    if (week) {
      try {
        await completeWeek()
      } catch (error) {
        console.error('Failed to complete week:', error)
      }
    }
  }

  // Callback functions for meal operations
  const handleMealToggleComplete = async (meal: Comida) => {
    if (week) {
      await toggleMealComplete(week.id, meal.id)
    }
  }

  const handleMealDelete = async (meal: Comida) => {
    if (week) {
      await deleteMeal(week.id, meal.id)
    }
  }

  const handleMealReorder = async (fromIndex: number, toIndex: number) => {
    if (week) {
      await reorderMeals(week.id, fromIndex, toIndex)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !week || !isEditable) return

    const oldIndex = week.meals.findIndex((meal) => meal.id === active.id)
    const newIndex = week.meals.findIndex((meal) => meal.id === over.id)

    if (oldIndex !== newIndex) {
      try {
        await reorderMeals(week.id, oldIndex, newIndex)
      } catch (error) {
        console.error('Failed to reorder meals:', error)
      }
    }
  }

  const { completedMeals, totalMeals, progressPercent } = calculateProgress(week)

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
      {/* Week Selector for Completed section */}
      {viewingStatus === 'archived' && (
        <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <VStack gap={3}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {t('planner.week.selectCompleted', 'Select Completed Week')}
            </Text>
            <select
              value={selectedArchivedWeekId || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedArchivedWeekId(e.target.value || null)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">
                {t('planner.week.selectCompletedPlaceholder', 'Choose a completed week...')}
              </option>
              {getArchivedWeeks().map((archivedWeek) => (
                <option key={archivedWeek.id} value={archivedWeek.id}>
                  {archivedWeek.title || t('planner.week.untitled', 'Untitled Week')} - {new Date(archivedWeek.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </VStack>
        </Box>
      )}

      {/* Week Header */}
      <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <HStack justify="space-between" align="center" mb={4}>
          <Box>
            {/* Editable week title - for current and planned weeks */}
            {isEditingTitle && isEditable ? (
              <Input
                ref={titleInputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={async () => {
                  await handleTitleUpdate(editTitle, week, updateWeekTitle)
                  setIsEditingTitle(false)
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    await handleTitleUpdate(editTitle, week, updateWeekTitle)
                    setIsEditingTitle(false)
                    setTimeout(() => {
                      mealInputRef.current?.focus()
                    }, TITLE_INPUT_FOCUS_DELAY)
                  } else if (e.key === 'Escape') {
                    setIsEditingTitle(false)
                    setEditTitle(week.title || t('planner.week.current', 'Current Week'))
                  }
                }}
                autoFocus
                maxLength={MAX_TITLE_LENGTH}
                fontSize="lg"
                variant="flushed"
              />
            ) : (
              <HStack 
                justifyContent="space-between" 
                alignItems="center"
                onClick={isEditable ? () => {
                  setEditTitle(week.title || t('planner.week.current', 'Current Week'))
                  setIsEditingTitle(true)
                } : undefined}
                cursor={isEditable ? "pointer" : "default"}
                _hover={isEditable ? { opacity: 0.8 } : undefined}
                title={isEditable ? t('planner.week.editTitle', 'Click to edit title') : undefined}
                width="100%"
              >
                <Heading
                  size="lg"
                  color="inherit"
                  flex="1"
                >
                  {week.title || t('planner.week.current', 'Current Week')}
                </Heading>
                {isEditable && (
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
              <Badge colorScheme={getStatusBadgeColor(week.status)} size="sm">
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
              {t('planner.week.completed', 'This week has been completed')}
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
          {/* Existing meals with drag-and-drop (for current and planned weeks) */}
          {isEditable ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={week.meals.map(meal => meal.id)}
                strategy={verticalListSortingStrategy}
              >
                {renderMealItems(week, isEditable, handleMealToggleComplete, handleMealDelete, handleMealReorder)}
              </SortableContext>
            </DndContext>
          ) : (
            // Read-only view for completed weeks only
            <>
              {renderMealItems(week, isEditable, handleMealToggleComplete, handleMealDelete, handleMealReorder)}
            </>
          )}
          
          {/* Quick entry form for current and planned weeks */}
          {isEditable && week && (
            <QuickPlanningForm 
              ref={mealInputRef} 
              week={week}
              onAddMeal={async (mealTitle: string) => {
                await addMeal(week.id, mealTitle)
              }}
            />
          )}
          
          {/* Empty state for completed weeks only */}
          {week.status === 'archived' && week.meals.length === 0 && (
            <Text color="gray.500" textAlign="center" py={4} fontStyle="italic">
              {t('planner.week.emptyCompleted', 'No meals were recorded')}
            </Text>
          )}
        </VStack>
      </Box>
    </VStack>
  )
}

export default WeekDisplay
