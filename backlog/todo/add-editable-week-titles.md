# Story: Add Editable Week Titles

## User Story
As a meal planner, I want to give my weekly meal plans custom titles so that I can easily identify and organize different planning periods.

## Description
Currently, week plans are created with generic date-based titles. Users should be able to customize these titles to better reflect their planning needs, such as "Vacation Week", "Back to School", "Holiday Meals", or "Budget Week". This enhancement improves organization and makes it easier to navigate between different meal planning contexts.

## Acceptance Criteria
- [ ] Users can edit the week title directly from the meal planner interface
- [ ] Title editing is intuitive (click-to-edit or edit button)
- [ ] Week title is prominently displayed in the current week view
- [ ] Title changes are immediately saved and persisted
- [ ] Title validates for reasonable length limits (e.g., 50 characters)
- [ ] Empty titles fall back to the default date-based format
- [ ] Section uses consistent Chakra UI styling with the rest of the app
- [ ] All text supports internationalization (i18next)
- [ ] Feature is responsive and works on mobile devices

## Design Notes
- Use Chakra UI's Editable component for inline title editing
- Display title prominently at the top of the week planning interface
- Provide visual feedback when title is being edited vs. display mode
- Consider using a pencil icon to indicate editability
- Ensure title doesn't break layout with very long text
- Use appropriate typography hierarchy (likely Heading component)

## Technical Notes
- Extend ComidasWeek schema to make title field more prominent in UI
- Update PlannerContext to handle title updates
- Integrate with existing localStorage persistence system
- Add appropriate validation for title length and characters
- Update week creation flow to allow initial title setting
- Ensure title updates trigger proper re-renders

## Dependencies
- Requires existing meal planning functionality (create-comidas-week-planning.md)
- Depends on current PlannerContext and ComidasWeek data structure

## Out of Scope
- Title history or versioning
- Advanced title formatting or rich text
- Title templates or suggestions
- Sharing or collaboration features around titles
- Bulk title editing across multiple weeks