// Zod validation schemas for Comidas app data models
// Provides runtime validation and type safety for localStorage operations

import { z } from 'zod'

// Recipe validation schema
export const RecipeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Recipe name is required'),
  slug: z.string().optional(),
  ingredients: z.string().min(1, 'Ingredients are required'),
  steps: z.string().min(1, 'Steps are required'),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Individual meal validation schema
export const ComidaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Meal title is required'),
  completed: z.boolean(),
  recipeId: z.string().optional(),
  assignedTo: z.string().optional(),
  plannedDay: z.string().optional(),
  order: z.number().int().min(0),
  notes: z.string().optional()
})

// Comidas Week validation schema (3-7 meals per spec)
export const ComidasWeekSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  status: z.enum(['current', 'planned', 'archived']),
  meals: z.array(ComidaSchema),
  mealCount: z.number().int().min(3).max(7, 'Comidas week must have 3-7 meals'),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional()
}).refine(
  (data) => data.meals.length === data.mealCount,
  { message: 'Number of meals must match mealCount' }
)

// Family member validation schema
export const FamilyMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Family member name is required'),
  isChild: z.boolean(),
  weeklyAssignments: z.number().int().min(0).optional()
})

// Export types inferred from schemas for consistency
export type Recipe = z.infer<typeof RecipeSchema>
export type Comida = z.infer<typeof ComidaSchema>
export type ComidasWeek = z.infer<typeof ComidasWeekSchema>
export type FamilyMember = z.infer<typeof FamilyMemberSchema>
export type WeekStatus = 'current' | 'planned' | 'archived'