# Story: Add Cooking Assistant Section to Home Page

## User Story
As a family member, I want to see the Cooking Assistant section on the home page so that I can quickly access cooking tools.

## Description
Create a dedicated section on the home page that introduces the Cooking Assistant feature with basic navigation links.

## Acceptance Criteria
- [ ] Home page displays a "Cooking Assistant" section with clear heading
- [ ] Section includes a brief description of the cooking assistant functionality
- [ ] "Start Cooking" button to begin a new cooking session
- [ ] "View Cooking History" link to see past cooking sessions
- [ ] Section uses consistent Chakra UI styling with the rest of the app
- [ ] All text supports internationalization (i18next)
- [ ] Section is responsive and works on mobile devices

## Design Notes
- Use Chakra UI's Card or Box components for the section layout
- Include a chef hat icon for visual appeal
- Ensure the section follows the app's color scheme and typography

## Technical Notes
- Update the main App component or HomePage component
- Add translation keys for all Cooking Assistant section text
- Ensure accessibility with proper ARIA labels and semantic HTML

## Dependencies
- Requires basic routing structure (if not yet implemented)

## Out of Scope
- Current cooking status display (requires cooking session state management)
- Active timers or cooking progress (requires timer functionality and persistence)
- Recent cooking activity or favorites (requires cooking history data and logic)
- Recipe selection integration (should be a separate integration story)
- Cooking session data model definition (should be a separate technical task)
- Timer alerts and browser notifications (should be part of timer feature story)