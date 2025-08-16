# Comidas App - Technical Architecture

This document contains implementation-specific architectural decisions and technical details for the Comidas application.

## Data Models Based on Specifications

### Core Entities

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

## Service Layer Interfaces

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

## Component Architecture

### Page-Level Components
```typescript
// Main route components matching navigation structure
- RecipeDatabasePage: List view with search, "bare bones but make it nicer later"
- RecipeDetailPage: Individual recipe view/edit
- RecipeCreatePage: Simple form for adding new recipes
- MealPlannerPage: Current comidas week view with checkbox list
- WeekArchivePage: Browse previous completed weeks
```

### Feature Components  
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

### UI Components
```typescript
// Reusable interface elements
- CheckableListItem: Meal with checkbox, title, assignment info
- DragDropOrderList: Reorderable meal list
- PlainTextEditor: Simple text areas for ingredients/steps
- FamilyMemberPicker: Dropdown for cooking assignments
- WeekStatusBadge: Visual indicator for current/planned/archived
```

## State Management Strategy

### React Context Architecture
```typescript
// Provide services and global state through React Context
- ComidasWeekContext: Current/planned weeks, meal operations
- RecipeContext: Recipe CRUD operations and search
- FamilyContext: Member management and assignment tracking
```

### Custom Hooks
```typescript
// Encapsulate data fetching and state management logic
- useRecipes(): Recipe list with search and filtering
- useRecipe(id): Single recipe with loading states
- useComidasWeek(week): Weekly meal plan with operations
- useRecipeForm(): Form state and validation for recipe editing
- useFamilyMembers(): Family member management
```

## Data Storage Implementation

### Phase 1: localStorage Implementation
```typescript
// JSON serialization with TypeScript validation
class LocalStorageRecipeService implements RecipeService {
  private STORAGE_KEY = 'comidas_recipes'
  
  async getAll(): Promise<Recipe[]> {
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }
  
  async create(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const newRecipe: Recipe = {
      ...recipe,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const recipes = await this.getAll()
    recipes.push(newRecipe)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes))
    
    return newRecipe
  }
  
  // ... other methods
}
```

### Data Validation
```typescript
// Use zod for runtime validation
import { z } from 'zod'

const RecipeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  ingredients: z.string(),
  steps: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

const ComidasWeekSchema = z.object({
  id: z.string(),
  status: z.enum(['current', 'planned', 'archived']),
  meals: z.array(ComidaSchema),
  mealCount: z.number().min(3).max(7),
  createdAt: z.date(),
  updatedAt: z.date()
})
```

## Sample Data Bootstrap

```typescript
// Initialize with spec-provided recipes
const SAMPLE_RECIPES: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Albondigas de Marta",
    ingredients: `1 kg carne molida de res
2 huevos
Medio kilo de jitomate
Medio cebolla
Cilantro
Canela (ramo?)
Clavos`,
    steps: `Hervir el jitomate con media cebolla y una rama de cilantro, luego muelles en la licuadora y cuelas. Freír con poquito aceite, sal tanto azúcar, canela, 2 clavos, chipotle al gusto. Que espese

Carne crudo de res, 1 kilo, dos huevos, sal y pimienta. Hacer bolitas tamaño al gusto.

Hechas las bolas sin freír al caldo.`
  },
  {
    name: "Appelmoes", 
    ingredients: `1 kg appels
50 g suiker
35 ml water 
Citroenrasp
Kaneel en/of pigment`,
    steps: `Schil de appels, verwijder de klokhuizen en snijd de appel in grove stukken. Doe de appelstukjes met het water, het citroenrasp en de suiker in een pan en breng het op middelhoog vuur aan de kook. Laat de appels ongeveer 15 minuten zachtjes doorkoken en roer het mengsel daarbij af en toe om.

Wil je grove appelmoes, pureer de appel dan met een pureestamper, er zullen nog wat kleine stukjes appel te proeven zijn. Wil je een gladde appelmoes, gebruik dan een staafmixer om de moes glad te mixen. 
Breng de appelmoes tot slot op smaak met de kaneel of piment laat afkoelen.`
  },
  {
    name: "Broccoli Salad de Leon",
    ingredients: `500 g broccoli, cut into bite-sized florets
300 g peas, fresh or frozen
1/2 komkommer, cut into slim batons
200 g good-quality feta cheese, crumbled
50 g alfalfa
50 g toasted seeds (we use sesame, sunflower, flax and pumpkin)
1 avocado, cut into pieces
75 g quinoa
Small handful flat-leaf parsley, rough chopped
Small handful mint, rough chopped
2 dessert spoons lemon juice
4 dessert spoons extra virgin olive oil`,
    steps: `Put the quinoa in a small pan. Cover with cold water plus about an inch then let it gently simmer until the water's gone - about 15 minutes. Spread it on a tray to cool to room temperature.

Put an inch of hot water into a saucepan with a pinch of salt and cover it. Once boiling, drop in the broccoli and peas and put the lid back on. Drain after three minutes and run the veg under cold water to take all the heat out and keep them good and green.

Now build your salad in layers, starting with the first ingredient on the list and ending up with the dressing (but only dress it just before you eat it).`
  }
]

// Bootstrap function to initialize sample data
export async function initializeSampleData(recipeService: RecipeService): Promise<void> {
  const existingRecipes = await recipeService.getAll()
  
  if (existingRecipes.length === 0) {
    for (const recipe of SAMPLE_RECIPES) {
      await recipeService.create(recipe)
    }
  }
}
```

## Implementation Priorities

### High Priority (MVP)
1. **Recipe Database**:
   - LocalStorageRecipeService implementation
   - Basic RecipeList and RecipeForm components
   - Sample data initialization
   - Simple search functionality

2. **Meal Planning**:
   - ComidasWeek data model and service
   - QuickPlanningForm for fast meal entry
   - CheckableListItem for meal completion
   - Current week view

3. **Basic Family Management**:
   - FamilyMember model and localStorage service
   - Simple assignment interface

### Medium Priority 
1. **Enhanced UX**:
   - Drag-and-drop meal reordering
   - Week navigation and archive system
   - Completion ceremony animations

2. **Recipe Enhancement**:
   - Recipe detail and edit views
   - Better search and filtering

### Low Priority (Future Enhancement)
1. **Advanced Features**:
   - Shopping list generation from meal plans
   - Recipe import/export
   - Mobile optimizations

## Technical Considerations

### Performance
- Implement React.memo for recipe list items
- Use useMemo for expensive computations (search filtering)
- Consider virtualization for large recipe lists

### Accessibility
- Ensure keyboard navigation for drag-and-drop interfaces
- Provide proper ARIA labels for dynamic content
- Test with screen readers for meal planning workflows

### Testing Strategy
- Unit tests for service layer methods
- Integration tests for React Context providers
- E2E tests for critical user workflows (meal planning, recipe creation)

### Future Migration Path
- Service interfaces designed to easily swap localStorage for REST API
- Data models compatible with backend database schemas
- Component architecture supports server-side rendering