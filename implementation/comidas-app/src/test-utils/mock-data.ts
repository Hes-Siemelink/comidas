import type { ComidasWeek } from '../types/schemas'
import { z } from 'zod'
import { ComidaSchema } from '../types/schemas'
import { vi } from 'vitest'

type Comida = z.infer<typeof ComidaSchema>

// Mock week data for testing
export const mockWeek: ComidasWeek = {
  id: 'test-week-1',
  title: 'Test Week',
  status: 'current',
  meals: [],
  mealCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockCurrentWeek: ComidasWeek = {
  ...mockWeek,
  status: 'current',
  title: 'Current Test Week',
}

export const mockPlannedWeek: ComidasWeek = {
  ...mockWeek,
  id: 'test-week-planned',
  status: 'planned',
  title: 'Planned Test Week',
}

export const mockArchivedWeek: ComidasWeek = {
  ...mockWeek,
  id: 'test-week-archived',
  status: 'archived',
  title: 'Archived Test Week',
}

// Mock meal data
export const mockMeal: Comida = {
  id: 'test-meal-1',
  title: 'Test Meal',
  completed: false,
  order: 0,
}

export const mockCompletedMeal: Comida = {
  ...mockMeal,
  id: 'test-meal-completed',
  title: 'Completed Test Meal',
  completed: true,
}

export const mockWeekWithMeals: ComidasWeek = {
  ...mockWeek,
  meals: [
    mockMeal,
    { ...mockMeal, id: 'test-meal-2', title: 'Second Test Meal', order: 1 },
    mockCompletedMeal,
  ],
  mealCount: 3,
}

// Mock props for testing component dependency injection
export const mockWeekDisplayProps = {
  week: mockWeek,
  onAddMeal: vi.fn(),
  onUpdateMeal: vi.fn(),
  onDeleteMeal: vi.fn(),
  onToggleMeal: vi.fn(),
  onReorderMeals: vi.fn(),
  onUpdateTitle: vi.fn(),
  onCompleteWeek: vi.fn(),
}

export const mockQuickPlanningFormProps = {
  week: mockWeek,
  onAddMeal: vi.fn(),
}

export const mockCheckableListItemProps = {
  meal: mockMeal,
  week: mockWeek,
  onToggle: vi.fn(),
  onDelete: vi.fn(),
  onUpdate: vi.fn(),
}

// Mock functions for context testing
export const mockPlannerContextFunctions = {
  createWeek: vi.fn(),
  addMealToWeek: vi.fn(),
  updateMealInWeek: vi.fn(),
  deleteMealFromWeek: vi.fn(),
  toggleMealCompleteInWeek: vi.fn(),
  reorderMealsInWeek: vi.fn(),
  updateWeekTitleById: vi.fn(),
  completeWeek: vi.fn(),
  archiveWeek: vi.fn(),
  showCeremony: vi.fn(),
  dismissCeremony: vi.fn(),
}

// Reset all mocks helper
export const resetAllMocks = () => {
  Object.values(mockPlannerContextFunctions).forEach(mock => mock.mockReset())
  Object.values(mockWeekDisplayProps).forEach(prop => {
    if (typeof prop === 'function' && 'mockReset' in prop) {
      prop.mockReset()
    }
  })
  Object.values(mockQuickPlanningFormProps).forEach(prop => {
    if (typeof prop === 'function' && 'mockReset' in prop) {
      prop.mockReset()
    }
  })
  Object.values(mockCheckableListItemProps).forEach(prop => {
    if (typeof prop === 'function' && 'mockReset' in prop) {
      prop.mockReset()
    }
  })
}
