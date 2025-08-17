# Story: Add Drag-and-Drop Meal Ordering

## User Story
As a meal planner, I want to reorder my meals by dragging and dropping them so that I can organize my weekly meal plan in the sequence that works best for my schedule.

## Description
Users currently add meals to their weekly plan, but they appear in the order they were added. Real meal planning often requires adjusting the sequence based on shopping schedules, preparation complexity, family preferences, or weekly events. Adding drag-and-drop functionality allows users to quickly reorganize their meal list to match their actual planned sequence.

## Acceptance Criteria
- [x] Users can drag meals up and down within the meal list
- [x] Visual feedback shows where the meal will be dropped during drag operation
- [x] Meal order is immediately updated and persisted when dropped
- [x] Drag handles are clearly visible and accessible
- [x] Drag-and-drop works on both desktop and touch devices
- [x] Order changes are reflected in the meal display immediately
- [x] Meal completion status is preserved during reordering
- [x] Drag operation can be cancelled (drag outside drop zone)
- [x] Section uses consistent Chakra UI styling with the rest of the app
- [x] All text supports internationalization (i18next)
- [x] Feature is responsive and works on mobile devices

## Design Notes
- Use clear drag handles (⋮⋮ or ≡ icon) on each meal item
- Provide visual feedback during drag (highlight drop zones, ghost image)
- Use Chakra UI's color system for drag states (hover, active, drop zones)
- Ensure drag handles are large enough for touch interaction
- Consider adding subtle animation for smooth reordering
- Maintain visual consistency with existing CheckableListItem design
- Provide appropriate cursor changes during drag operations

## Technical Notes
- Implement drag-and-drop using a React DnD library (react-beautiful-dnd recommended)
- Update meal `order` property in Comida schema during reorder operations
- Integrate with existing PlannerContext meal management functions
- Ensure drag-and-drop doesn't interfere with meal completion toggles
- Update meal list rendering to respect updated order values
- Handle edge cases (single meal, empty list, rapid reordering)
- Maintain accessibility for keyboard users (consider implementing keyboard shortcuts)

## Dependencies
- Requires existing meal planning functionality (create-comidas-week-planning.md)
- Depends on CheckableListItem component and current meal list implementation
- May require adding drag-and-drop library dependency

## Out of Scope
- Cross-week meal moving (dragging meals between different weeks)
- Advanced sorting options (alphabetical, by complexity, etc.)
- Meal grouping or categorization within the week
- Undo/redo functionality for reordering
- Bulk meal reordering operations
- Animation presets or customization options

## Implementation Notes

### What Was Built
- **@dnd-kit Integration**: Implemented modern drag-and-drop using @dnd-kit/core and @dnd-kit/sortable libraries
- **PlannerContext Enhancement**: Added `reorderMeals(startIndex, endIndex)` function for persistent meal reordering
- **DraggableListItem Component**: Created wrapper component that adds drag functionality to existing CheckableListItem
- **WeekPlanner Updates**: Integrated DndContext and SortableContext for sortable meal list rendering
- **Accessibility Support**: Full keyboard navigation with arrow key shortcuts and enhanced focus indicators
- **Internationalization**: Added drag handle translations in English, Spanish, and Dutch

### Technical Implementation
- **Drag Handles**: Clear ⋮⋮ icons with hover states and cursor changes
- **Visual Feedback**: Opacity changes during drag, proper drop zone highlighting
- **Persistent Storage**: Order changes immediately saved to localStorage via existing comidasWeekService
- **Error Handling**: Graceful handling of drag failures with console error logging
- **State Management**: Optimistic updates with proper order recalculation after reordering
- **Keyboard Accessibility**: Arrow key shortcuts (↑↓) for reordering when drag handle is focused
- **Enhanced Focus**: Clear focus indicators with blue highlight and border for accessibility

### Files Modified
- `src/context/PlannerContext.tsx` - Added reorderMeals function
- `src/components/planner/DraggableListItem.tsx` - New drag wrapper component
- `src/components/planner/WeekPlanner.tsx` - Integrated drag-and-drop context
- `src/components/planner/index.ts` - Export new component
- `src/i18n.ts` - Added dragHandle translations
- `package.json` - Added @dnd-kit dependencies

## Ready for Acceptance

All acceptance criteria have been implemented and tested. The drag-and-drop meal ordering feature is fully functional with:

- ✅ Intuitive drag handles on each meal item
- ✅ Smooth drag-and-drop interaction for reordering
- ✅ Immediate persistence of order changes
- ✅ Preserved meal completion status during reordering
- ✅ Full accessibility support with keyboard navigation
- ✅ Internationalization support in all three languages
- ✅ Responsive design for mobile and desktop
- ✅ Integration with existing Chakra UI styling

## To Test

1. **Start the development server** (see README.md for setup details)
2. **Navigate to the Planner page** and create a new week
3. **Add multiple meals** using the quick entry form (minimum 3 meals for testing)
4. **Test drag-and-drop functionality**:
   - Look for ⋮⋮ drag handles on the left side of each meal item
   - Click and drag a meal up or down in the list
   - Verify the meal moves to the new position
   - Check that the order persists after page refresh
5. **Test completion preservation**:
   - Mark some meals as complete (checkbox)
   - Drag meals around and verify completion status is preserved
6. **Test accessibility**:
   - Use Tab key to navigate to drag handles
   - Use arrow keys (↑↓) to move items up and down when drag handle is focused
   - Verify focus indicator is clearly visible on drag handles
   - Test that keyboard reordering persists like mouse drag-and-drop
7. **Test mobile responsiveness**:
   - Test touch drag-and-drop on mobile/tablet devices
   - Verify drag handles are large enough for touch interaction

The feature is ready for Product Owner review and acceptance.

✅ Accepted by Hes