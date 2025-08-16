# Architecture Overview

This document describes the initial technology choices and architectural direction for the Family Recipe App.

## Frontend

- **Framework**: React (with Vite for fast development and prototyping)
- **Language**: TypeScript
- **Component Library**: Chakra UI (for accessible, modern, and customizable UI components)
- **Internationalization**: i18next (for multilingual support)

## Data Storage

- **Prototype Phase**: Local storage or IndexedDB for single-user, offline-first experience
- **Future Expansion**: Plan for backend integration (Node.js/Express or Firebase) to support multi-user features and cloud sync

## Testing

- **Unit/Integration Testing**: Vitest (Vite-native) and React Testing Library

## Rationale

- The stack is chosen for rapid prototyping, strong community support, and easy transition to mobile or backend integration in the future.
- Chakra UI provides a great developer experience and ensures accessibility out of the box.

---


## Testing Rationale

Vitest is chosen over Jest because it is designed for Vite/ESM projects, requires minimal configuration, and works seamlessly with React, TypeScript, and static assets. It provides a fast, modern, and reliable testing experience for this stack.

This architecture will be reviewed and updated as the project evolves and requirements change.

---

## Data Layer Architecture - Refined Based on Specifications

### Core Principles
- **Start Simple**: Use plain text for ingredients/steps, enhance structure later
- **Family-Focused**: Support cooking assignments and child participation tracking
- **Flexible Planning**: "Comidas weeks" are 3-7 meal units, not calendar-bound
- **Progressive Enhancement**: Begin with basic CRUD, add sophistication iteratively

### Data Models Based on Specifications

```typescript
// Recipe Database - Starting Simple
interface Recipe {
  id: string
  name: string                    // Primary display name for linking from meal planner
  slug?: string                   // URL-friendly identifier (optional, can derive from name)
  ingredients: string             // Plain text initially (per spec: "can convert to sophisticated list later")
  steps: string                   // Plain text initially (per spec)
  createdAt: Date
  updatedAt: Date
}

// "Comidas Week" - Flexible Planning Unit (3-7 meals)
interface ComidasWeek {
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
interface Comida {
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
interface FamilyMember {
  id: string
  name: string
  isChild: boolean                // Children should cook once per week per spec
  weeklyAssignments?: number      // Track cooking frequency
}
```

### Service Layer Interfaces

```typescript
// Recipe Database Operations
interface RecipeService {
  getAll(): Promise<Recipe[]>
  search(query: string): Promise<Recipe[]>
  getById(id: string): Promise<Recipe | null>
  create(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe>
  update(id: string, recipe: Partial<Recipe>): Promise<Recipe>
  delete(id: string): Promise<void>
  
  // Bootstrap with sample recipes from spec
  initializeSampleData(): Promise<void>
}

// Comidas Week Planning Operations  
interface ComidasWeekService {
  getCurrent(): Promise<ComidasWeek | null>
  getPlanned(): Promise<ComidasWeek[]>
  getArchived(): Promise<ComidasWeek[]>
  
  createWeek(mealCount: number): Promise<ComidasWeek>
  addMeal(weekId: string, title: string, recipeId?: string): Promise<ComidasWeek>
  updateMeal(weekId: string, mealId: string, updates: Partial<Comida>): Promise<ComidasWeek>
  reorderMeals(weekId: string, mealIds: string[]): Promise<ComidasWeek>
  
  completeMeal(weekId: string, mealId: string): Promise<ComidasWeek>
  archiveWeek(weekId: string): Promise<ComidasWeek>
}

// Family Management
interface FamilyService {
  getMembers(): Promise<FamilyMember[]>
  addMember(name: string, isChild: boolean): Promise<FamilyMember>
  assignMeal(mealId: string, memberId: string): Promise<void>
  getWeeklyAssignments(weekId: string): Promise<{[memberId: string]: number}>
}
```

### Component Architecture Aligned with Specifications

#### Page-Level Components
```typescript
// Main route components matching navigation structure
- RecipeDatabasePage: List view with search, "bare bones but make it nicer later"
- RecipeDetailPage: Individual recipe view/edit
- RecipeCreatePage: Simple form for adding new recipes
- MealPlannerPage: Current comidas week view with checkbox list
- WeekArchivePage: Browse previous completed weeks
```

#### Feature Components  
```typescript
// Core meal planning functionality
- ComidasWeekView: Current week display with checkboxes and drag-and-drop
- QuickPlanningForm: "Type meals line by line, press enter for next" interface
- MealAssignmentSelector: Assign family members to cook specific meals
- WeekNavigation: Navigate between current/planned/archived weeks
- CompletionCeremony: "Nice animation" when last meal is checked off

// Recipe database functionality
- RecipeList: Basic list with search (start simple)
- RecipeCard: Individual recipe preview
- RecipeForm: Plain text ingredients/steps editor
- RecipeSearchBar: Search functionality
```

#### UI Components
```typescript
// Reusable interface elements
- CheckableListItem: Meal with checkbox, title, assignment info
- DragDropOrderList: Reorderable meal list
- PlainTextEditor: Simple text areas for ingredients/steps
- FamilyMemberPicker: Dropdown for cooking assignments
- WeekStatusBadge: Visual indicator for current/planned/archived
```

### Implementation Strategy Based on Specifications

#### Phase 1: MVP (Immediate)
1. **Recipe Database**:
   - Simple CRUD with name, ingredients (plain text), steps (plain text)
   - Basic list view with search
   - Bootstrap with provided sample recipes (Albondigas, Appelmoes, Broccoli Salad)

2. **Meal Planning**:
   - Create "comidas weeks" with 3-7 meals
   - Quick meal entry: "type line by line, press enter"
   - Checkbox completion system
   - Link meals to recipes or use ad-hoc titles

3. **Basic Family Management**:
   - Add family members
   - Assign cooking duties
   - Track that children cook once per week

#### Phase 2: Enhanced UX
1. **Improved Planning**:
   - Drag-and-drop meal reordering
   - Week navigation (current → planned → archived)
   - "Completion ceremony" animations

2. **Recipe Enhancement**:
   - Structured ingredients list (upgrade from plain text)
   - Recipe categories/tags
   - Recipe import/export

#### Phase 3: Advanced Features
1. **Shopping List Generation**: From meal plans
2. **Nutritional Balance**: Track meal variety (meat/vegetarian/pasta/fish)
3. **Mobile Optimization**: Touch-friendly interactions

### Technical Implementation Notes

#### Data Storage Evolution
- **Start**: localStorage with JSON serialization
- **Enhance**: IndexedDB for performance and larger storage
- **Scale**: Backend API with offline sync

#### State Management
```typescript
// React Context for global state
- ComidasWeekContext: Current/planned weeks, meal operations
- RecipeContext: Recipe CRUD operations and search
- FamilyContext: Member management and assignment tracking
```

#### Sample Data Bootstrap
```typescript
// Initialize with spec-provided recipes
const SAMPLE_RECIPES = [
  {
    name: "Albondigas de Marta",
    ingredients: "1 kg carne molida de res\n2 huevos\nMedio kilo de jitomate...",
    steps: "Hervir el jitomate con media cebolla..."
  },
  {
    name: "Appelmoes", 
    ingredients: "1 kg appels\n50 g suiker\n35 ml water...",
    steps: "Schil de appels, verwijder de klokhuizen..."
  },
  {
    name: "Broccoli Salad de Leon",
    ingredients: "500 g broccoli, cut into bite-sized florets...",
    steps: "Put the quinoa in a small pan. Cover with cold water..."
  }
]
```

This architecture directly implements the specifications while maintaining simplicity and allowing for future enhancement. The "comidas week" concept provides the flexibility needed for real family meal planning while the plain text approach for recipes ensures quick implementation and easy data entry.
