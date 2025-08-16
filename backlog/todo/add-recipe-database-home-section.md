# Story: Add Recipe Database Section to Home Page

## User Story
As a family member, I want to see the Recipe Database section on the home page so that I can quickly access our family recipes, see what's available, and easily add new ones.

## Description
Create a dedicated section on the home page that introduces the Recipe Database feature with basic navigation links.

## Acceptance Criteria
- [ ] Home page displays a "Recipe Database" section with clear heading
- [ ] Section includes a brief description of the recipe database functionality
- [ ] "Browse All Recipes" button/link to navigate to the full recipe list
- [ ] "Add New Recipe" button/link for creating new recipes
- [ ] Section uses consistent Chakra UI styling with the rest of the app
- [ ] All text supports internationalization (i18next)
- [ ] Section is responsive and works on mobile devices

## Design Notes
- Use Chakra UI's Card or Box components for the section layout
- Include a cookbook icon to make the section visually appealing
- Ensure the section follows the app's color scheme and typography

## Technical Notes
- Update the main App component or create a dedicated HomePage component
- Add translation keys for all Recipe Database section text
- Ensure accessibility with proper ARIA labels and semantic HTML

## Dependencies
- Requires basic routing structure (if not yet implemented)

## Out of Scope
- Recipe preview cards or thumbnails (should be implemented in a future story)
- Featured or recent recipes display (requires recipe data and filtering logic)
- Recipe data model definition (should be a separate technical task)
- Advanced recipe browsing features (filtering, search, categories)