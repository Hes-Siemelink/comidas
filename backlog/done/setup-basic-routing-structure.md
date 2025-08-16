# Task: Setup Basic Routing Structure

## Description
Implement basic routing infrastructure using React Router to support navigation between different sections of the Family Recipe App, enabling the home page sections to link to their respective feature pages.

## Acceptance Criteria
- [x] Install and configure React Router DOM
- [x] Create basic route structure with Home route as default
- [x] Add placeholder routes for Recipe Database, Meal Planner, and Cooking Assistant
- [x] Implement navigation wrapper that preserves language switching functionality
- [x] Update App component to use router-based navigation
- [x] All routes support internationalization (i18next)
- [x] Routing works on mobile devices and is accessible

## Technical Notes
- Use React Router v6 for modern routing patterns
- Implement BrowserRouter as the main router wrapper
- Create route definitions for: `/`, `/recipes`, `/planner`, `/cooking`
- Add placeholder components for each route that can be enhanced later
- Preserve existing Chakra UI and i18next setup
- Ensure proper TypeScript integration
- Consider lazy loading for future performance optimization

## Dependencies
- Requires React Router DOM package installation
- Must maintain compatibility with existing Chakra UI and i18next setup

## Implementation Notes
Completed basic routing infrastructure with the following components:

### Packages Installed
- `react-router-dom@^7.8.1` - Main routing library
- `@types/react-router-dom@^5.3.3` - TypeScript types

### Components Created
- `src/components/AppRoutes.tsx` - Main routing component with route definitions
- `src/components/HomePage.tsx` - Home page with app title and description
- `src/components/RecipesPage.tsx` - Recipe Database placeholder page
- `src/components/PlannerPage.tsx` - Meal Planner placeholder page  
- `src/components/CookingPage.tsx` - Cooking Assistant placeholder page
- `src/components/Navigation.tsx` - Navigation component with route buttons and language switcher
- `src/components/LanguageSwitcher.tsx` - Extracted language switching component

### Key Features
- React Router v7 with BrowserRouter wrapper
- Route structure: `/` (home), `/recipes`, `/planner`, `/cooking`
- Navigation with active route highlighting using useLocation
- Preserved all existing i18next functionality with expanded translations
- Responsive Chakra UI styling throughout
- Updated tests to work with routing (using MemoryRouter)
- All routes accessible via keyboard navigation

### Code Structure
- Separated App (router wrapper) from AppRoutes (route definitions) for better testability
- Used useNavigate hook for programmatic navigation to avoid TypeScript issues
- Maintained consistent component architecture and naming patterns

## Ready for Acceptance
Product Owner: The basic routing structure is complete and meets all acceptance criteria. Navigation works between all four main sections, language switching is preserved, and all tests pass.

**To test:**
1. Start the development server
2. Test navigation between Home, Recipes, Planner, and Cooking pages
3. Verify language switching works on all pages

✅ Accepted by Hes