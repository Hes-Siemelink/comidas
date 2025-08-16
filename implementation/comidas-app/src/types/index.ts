// Core data models for Comidas app
// Based on architecture specification in implementation/comidas-app/architecture.md

// Recipe Database - Starting Simple
export interface Recipe {
  id: string
  name: string                    // Primary display name for linking from meal planner
  slug?: string                   // URL-friendly identifier (optional, can derive from name)
  ingredients: string             // Plain text initially (per spec: "can convert to sophisticated list later")
  steps: string                   // Plain text initially (per spec)
  createdAt: Date
  updatedAt: Date
}

// "Comidas Week" - Flexible Planning Unit (3-7 meals)
export interface ComidasWeek {
  id: string
  title?: string                  // Optional descriptive title ("Before holiday", "Week 1", etc.)
  status: 'current' | 'planned' | 'archived'
  meals: Comida[]                 // Ordered list of planned meals
  mealCount: number               // 3-7 meals per spec
  createdAt: Date
  updatedAt: Date
  completedAt?: Date              // When last meal was checked off
}

// Individual Meal Planning Entry
export interface Comida {
  id: string
  title: string                   // Meal name (recipe name or ad-hoc like "Supermarket pizza with salad")
  completed: boolean              // Checkbox state - has this meal been cooked?
  recipeId?: string               // Optional link to recipe database
  assignedTo?: string             // Family member assigned to cook (children should cook once per week)
  plannedDay?: string             // Optional day assignment (flexible, not strict calendar)
  order: number                   // Position in the comidas week sequence (drag-and-drop ordering)
  notes?: string                  // Additional meal planning notes
}

// Family Member Management
export interface FamilyMember {
  id: string
  name: string
  isChild: boolean                // Children should cook once per week per spec
  weeklyAssignments?: number      // Track cooking frequency
}

// Status types for ComidasWeek
export type WeekStatus = 'current' | 'planned' | 'archived'