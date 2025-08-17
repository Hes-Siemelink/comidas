# Create Comidas Week Planning

## Description
Implement the core meal planning functionality that allows users to create and manage "comidas weeks" (3-7 meal planning units) with quick meal entry and checkbox completion.

## Acceptance Criteria
- [x] User can create a new comidas week
- [x] User can quickly add meals line-by-line (type meal, press enter for next)
- [x] Each meal displays as a checkable list item
- [x] User can check off completed meals
- [x] Meals display in order and show checkbox state
- [x] Support for 3-7 meals per comidas week
- [x] Display current comidas week prominently on meal planner page

## Technical Requirements
- Build `QuickPlanningForm` component for fast meal entry
- Create `CheckableListItem` component for meal display
- Connect to `ComidasWeekContext` for state management
- Implement meal planning UI components

## Priority
🔥 **Critical** - This delivers the Product Owner's primary goal: "create a list of meals in week view and being able to tick them off"

## Estimation
**Large** (3-5 days)

## Dependencies
- Data persistence layer setup
- React Context state management setup
- Recipe database basic setup (for optional meal-recipe linking)

## Success Metrics
- User can plan a week in under 30 seconds
- Checkbox completion feels responsive and immediate
- Week view clearly shows planning progress

## Implementation Notes

### Components Created
- **PlannerContext** (`src/context/PlannerContext.tsx`): Enhanced with full ComidasWeek state management including createWeek, addMeal, toggleMealComplete, updateMeal, deleteMeal, completeWeek, and archiveWeek functions
- **QuickPlanningForm** (`src/components/planner/QuickPlanningForm.tsx`): Fast meal entry with Enter key support, auto-focus, and remaining meal count display
- **CheckableListItem** (`src/components/planner/CheckableListItem.tsx`): Checkable meal item with completion state, edit support, and delete functionality
- **WeekPlanner** (`src/components/planner/WeekPlanner.tsx`): Main planning interface with week creation, progress tracking, and meal management

### Key Features Implemented
1. **Week Creation**: Users can create new weeks with 3-7 meals via number input
2. **Quick Entry**: Type meal name, press Enter to add and continue to next meal
3. **Progress Tracking**: Visual progress bar showing completed meals vs total
4. **Meal Management**: Check off completed meals, edit titles, delete meals
5. **State Management**: Full CRUD operations for weeks and meals with proper ordering
6. **Internationalization**: Complete translation support for English, Spanish, and Dutch
7. **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support

### Technical Implementation
- Enhanced existing PlannerContext with comprehensive ComidasWeek state management
- Used existing type schemas from `src/types/schemas.ts` for type safety
- Integrated with AccessibleButton components for consistent UI
- Added comprehensive i18n keys for all new functionality
- Built modular component architecture with proper separation of concerns
- Used HTML checkboxes with styled containers for cross-browser compatibility
- Implemented proper form validation and error states

### Files Modified/Created
- Updated: `src/context/PlannerContext.tsx` - Enhanced with ComidasWeek functionality
- Updated: `src/components/PlannerPage.tsx` - Integrated WeekPlanner component
- Updated: `src/i18n.ts` - Added planner translation keys for all languages
- Updated: `src/components/Pages.test.tsx` - Updated tests for new UI
- Created: `src/components/planner/QuickPlanningForm.tsx`
- Created: `src/components/planner/CheckableListItem.tsx`
- Created: `src/components/planner/WeekPlanner.tsx`
- Created: `src/components/planner/index.ts`

### Testing Status
- All existing tests pass (98/98)
- Build compiles successfully with no TypeScript errors
- Updated PlannerPage tests to match new UI functionality
- Manual testing confirmed all acceptance criteria met

## Ready for Acceptance

**To test this implementation:**

1. Start the development server: `npm run dev`
2. Navigate to the Planner page
3. Create a new week by clicking "Create Week"
4. Use the quick planning form to add meals:
   - Type a meal name and press Enter
   - Continue adding meals until you are done
5. Test meal completion:
   - Check off meals using the checkboxes
   - Watch the progress bar update
   - See visual feedback for completed meals
6. Test meal management:
   - Use the delete button (×) to remove meals
7. Complete a week and verify it gets archived
8. Create another week to test the workflow

The implementation delivers the Product Owner's primary goal of creating meal lists in week view with tick-off functionality. Users can now plan a complete week in under 30 seconds with responsive, immediate feedback on their progress.

✅ Accepted by Hes