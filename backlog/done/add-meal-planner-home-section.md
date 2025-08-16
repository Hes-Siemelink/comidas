# Story: Add Family Meal Planner Section to Home Page

## User Story
As a family member, I want to see the Meal Planner section on the home page so that I can quickly access meal planning tools.

## Description
Create a dedicated section on the home page that introduces the Family Meal Planner feature with basic navigation links.

## Acceptance Criteria
- [x] Home page displays a "Family Meal Planner" section with clear heading
- [x] Section includes a brief description of the meal planning functionality
- [x] "View Full Planner" button/link to navigate to the complete meal planning interface
- [x] "Plan This Week" quick action button for immediate meal planning
- [x] Section uses consistent Chakra UI styling with the rest of the app
- [x] All text supports internationalization (i18next)
- [x] Section is responsive and works on mobile devices

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

## Implementation Notes
Completed the Meal Planner section following the established pattern from Recipe Database section:

### Components Enhanced
- **src/components/HomePage.tsx** - Added MealPlannerSection component
  - Interactive section with "View Full Planner" and "Plan This Week" buttons
  - Green color scheme (green.500) to distinguish from Recipe Database (blue)
  - Hover effects with green border and shadow
  - Proper heading hierarchy and responsive design

### Key Features Implemented
- **Interactive Buttons**: Two action buttons with clear navigation purposes
  - "View Full Planner" → navigates to `/planner`
  - "Plan This Week" → navigates to `/planner/week`
- **Accessibility Compliance**: Full ARIA label support and semantic testing
- **Internationalization**: Complete i18n support for English, Spanish, and Dutch
- **Responsive Design**: Works seamlessly across all device sizes
- **Visual Design**: Calendar icon integration and consistent styling with app theme

### Translation Keys Added
- **English**: "View Full Planner", "Plan This Week" with descriptive ARIA labels
- **Spanish**: "Ver Planificador Completo", "Planificar Esta Semana"
- **Dutch**: "Volledige Planner Bekijken", "Deze Week Plannen"

### Testing
- Updated comprehensive test suite (22 HomePage tests, 70 total tests passing)
- Added semantic tests for Meal Planner buttons and accessibility
- Updated placeholder count test (now only 1 placeholder remaining - Cooking Assistant)
- Verified proper ARIA label functionality

### Code Architecture
- Followed established pattern from RecipeDatabaseSection
- Consistent component structure and styling approach
- Proper TypeScript interfaces and error handling
- Maintainable code that fits existing HomePage architecture

## Ready for Acceptance
Product Owner: The Meal Planner section is complete and meets all acceptance criteria. The HomePage now has an interactive Meal Planner section with proper navigation buttons, accessibility, and responsive design.

**To test:**
1. Start the development server
2. Verify the HomePage shows Meal Planner section with calendar icon and description
3. Test both action buttons navigate to appropriate routes (/planner and /planner/week)
4. Test responsive behavior across different screen sizes
5. Test accessibility with screen reader to verify button labels are announced
6. Switch languages to confirm all text updates properly