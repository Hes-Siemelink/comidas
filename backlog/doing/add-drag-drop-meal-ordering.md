# Story: Add Drag-and-Drop Meal Ordering

## User Story
As a meal planner, I want to reorder my meals by dragging and dropping them so that I can organize my weekly meal plan in the sequence that works best for my schedule.

## Description
Users currently add meals to their weekly plan, but they appear in the order they were added. Real meal planning often requires adjusting the sequence based on shopping schedules, preparation complexity, family preferences, or weekly events. Adding drag-and-drop functionality allows users to quickly reorganize their meal list to match their actual planned sequence.

## Acceptance Criteria
- [ ] Users can drag meals up and down within the meal list
- [ ] Visual feedback shows where the meal will be dropped during drag operation
- [ ] Meal order is immediately updated and persisted when dropped
- [ ] Drag handles are clearly visible and accessible
- [ ] Drag-and-drop works on both desktop and touch devices
- [ ] Order changes are reflected in the meal display immediately
- [ ] Meal completion status is preserved during reordering
- [ ] Drag operation can be cancelled (drag outside drop zone)
- [ ] Section uses consistent Chakra UI styling with the rest of the app
- [ ] All text supports internationalization (i18next)
- [ ] Feature is responsive and works on mobile devices

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