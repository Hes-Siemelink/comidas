# Story: Add Family Meal Planner Section to Home Page

## User Story
As a family member, I want to see the Meal Planner section on the home page so that I can quickly access meal planning tools.

## Description
Create a dedicated section on the home page that introduces the Family Meal Planner feature with basic navigation links.

## Acceptance Criteria
- [ ] Home page displays a "Family Meal Planner" section with clear heading
- [ ] Section includes a brief description of the meal planning functionality
- [ ] "View Full Planner" button/link to navigate to the complete meal planning interface
- [ ] "Plan This Week" quick action button for immediate meal planning
- [ ] Section uses consistent Chakra UI styling with the rest of the app
- [ ] All text supports internationalization (i18next)
- [ ] Section is responsive and works on mobile devices

## Design Notes
- Use Chakra UI's Card or Box components for the section layout
- Include calendar icon for visual appeal
- Ensure the section follows the app's color scheme and typography

## Technical Notes
- Update the main App component or HomePage component
- Add translation keys for all Meal Planner section text
- Ensure accessibility with proper ARIA labels and semantic HTML

## Dependencies
- Requires basic routing structure (if not yet implemented)

## Out of Scope
- Mini calendar or weekly view display (should be implemented in a future story)
- Current meal plans preview (requires meal plan data and state management)
- Progress metrics and planning status (requires meal plan tracking logic)
- Meal plan data model definition (should be a separate technical task)
- Integration with Recipe Database (should be a separate integration story)