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

## Data Layer Architecture Recommendations

### Core Principles
- **Start Simple**: Use JSON-based local storage with TypeScript interfaces
- **Plan for Growth**: Design interfaces that can accommodate future backend integration
- **Type Safety**: Leverage TypeScript for data integrity and developer experience
- **Separation of Concerns**: Abstract data operations behind service interfaces

### Proposed Data Layer

#### 1. Data Models (TypeScript Interfaces)
```typescript
// Core entities with unique IDs and timestamps
interface Recipe {
  id: string
  title: string
  description?: string
  ingredients: Ingredient[]
  instructions: string[]
  cookingTime?: number
  servings?: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface Ingredient {
  name: string
  amount: number
  unit: string
  notes?: string
}

interface MealPlan {
  id: string
  weekStartDate: Date
  meals: { [key: string]: PlannedMeal[] } // "monday", "tuesday", etc.
  createdAt: Date
  updatedAt: Date
}

interface PlannedMeal {
  id: string
  timeSlot: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipeId?: string
  customTitle?: string
  notes?: string
}
```

#### 2. Service Layer Pattern
```typescript
// Abstract interfaces for future flexibility
interface RecipeService {
  getAll(): Promise<Recipe[]>
  getById(id: string): Promise<Recipe | null>
  create(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe>
  update(id: string, recipe: Partial<Recipe>): Promise<Recipe>
  delete(id: string): Promise<void>
  search(query: string, tags?: string[]): Promise<Recipe[]>
}

interface MealPlanService {
  getByWeek(weekStartDate: Date): Promise<MealPlan | null>
  create(mealPlan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealPlan>
  update(id: string, mealPlan: Partial<MealPlan>): Promise<MealPlan>
  addMeal(planId: string, day: string, meal: PlannedMeal): Promise<MealPlan>
  removeMeal(planId: string, mealId: string): Promise<MealPlan>
}
```

#### 3. Initial Implementation Strategy

**Phase 1: Local Storage Implementation**
- Use `localStorage` with JSON serialization
- Implement services with in-memory caching for performance
- Add data validation and migration utilities
- Use `uuid` library for ID generation

**Phase 2: Enhanced Local Storage (Future)**
- Migrate to IndexedDB for better performance and storage limits
- Add offline-first capabilities
- Implement data export/import functionality

**Phase 3: Backend Integration (Future)**
- Implement REST API services conforming to same interfaces
- Add authentication and multi-user support
- Cloud sync capabilities

### Component Architecture Recommendations

#### 1. Page-Level Components
```typescript
// Large, route-level components that orchestrate data and layout
- RecipeDatabasePage: Search, filter, list recipes
- RecipeDetailPage: Display and edit individual recipes  
- MealPlannerPage: Weekly view with drag-and-drop meal planning
- MealPlanWeekPage: Focused weekly planning interface
```

#### 2. Feature Components
```typescript
// Mid-level components handling specific functionality
- RecipeList: Displays paginated/filtered recipe collections
- RecipeCard: Individual recipe preview with actions
- RecipeForm: Create/edit recipe with validation
- WeeklyCalendar: Meal planning grid with time slots
- MealSlot: Individual meal planning slot with drag-and-drop
- IngredientList: Editable list of recipe ingredients
```

#### 3. UI Components
```typescript
// Small, reusable components extending Chakra UI
- TagSelector: Multi-select for recipe tags
- ServingAdjuster: Interactive serving size controls  
- TimerDisplay: Cooking time visualization
- SearchBar: Recipe search with filters
- DragDropZone: Meal planning interactions
```

### State Management Strategy

#### 1. Local Component State
- Use `useState` for simple form inputs and UI state
- Use `useReducer` for complex state transitions (recipe editing)

#### 2. Context for Shared Data
```typescript
// Provide services and global state through React Context
- RecipeContext: Recipe CRUD operations and cache
- MealPlanContext: Meal planning operations and current week
- AppContext: User preferences, theme, language
```

#### 3. Custom Hooks
```typescript
// Encapsulate data fetching and state management logic
- useRecipes(): Recipe list with search and filtering
- useRecipe(id): Single recipe with loading states
- useMealPlan(week): Weekly meal plan with operations
- useRecipeForm(): Form state and validation for recipe editing
```

### Implementation Priorities

#### High Priority (MVP)
1. Recipe data models and local storage service
2. Basic recipe list and detail pages
3. Simple meal planning with weekly view
4. Recipe creation and editing forms

#### Medium Priority 
1. Advanced search and filtering
2. Drag-and-drop meal planning
3. Recipe import/export functionality
4. Enhanced meal planning features

#### Low Priority (Future Enhancement)
1. Recipe sharing and collaboration
2. Shopping list generation  
3. Nutritional information integration
4. Mobile-responsive optimizations

### Technical Considerations

#### Data Validation
- Use `zod` or similar for runtime type validation
- Validate data at service boundaries
- Handle migration between data schema versions

#### Performance
- Implement lazy loading for large recipe lists
- Use React.memo and useMemo for expensive computations
- Consider virtualization for very large datasets

#### Accessibility
- Ensure all interactions work with keyboard navigation
- Provide proper ARIA labels for complex interactions
- Test with screen readers, especially for meal planning interface

#### Internationalization
- Design data models to support multiple languages
- Consider locale-specific formatting (dates, numbers, measurements)
- Plan for right-to-left language support if needed

This architecture provides a solid foundation that can evolve from simple local storage to a full-featured cloud-based application while maintaining clean separation of concerns and type safety throughout.
