# Navigation and Routing Specification

## Goal
Define how users navigate between different sections of the comidas application, including URL structure, routing behavior, and navigation patterns that support both web and future mobile implementations.

## Navigation Structure

### Primary Navigation
- **Home Page** (`/`) - Entry point with language selection and feature access
- **Meal Planner** (`/planner`) - Weekly meal planning with sub-sections:
  - Current (`/planner` or `/planner/current`) - Default view
  - Planned (`/planner/planned`) - Future week planning
  - Completed (`/planner/completed`) - Historical weeks
- **Recipe Database** (`/recipes`) - Recipe management and browsing

### URL Patterns

#### Base Routes
- `/` - Home page
- `/planner` - Meal planner (defaults to current section)
- `/recipes` - Recipe database

#### Meal Planner Sub-routes
- `/planner/current` - Current week view
- `/planner/planned` - Planned week view
- `/planner/completed` - Completed weeks archive
- `/planner/completed/:weekId` - Specific completed week

#### Recipe Database Sub-routes
- `/recipes` - Recipe list and search
- `/recipes/:recipeId` - Specific recipe details
- `/recipes/new` - Create new recipe
- `/recipes/:recipeId/edit` - Edit existing recipe

## Navigation Behavior

### Page Transitions
- Navigation between main sections is immediate without page reload
- Sub-section navigation preserves parent context
- URL updates reflect current location for bookmarking and back button support

### Back Button Behavior
- Browser back button returns to previous view
- Navigation history is preserved across sessions
- Deep links work correctly when accessed directly

### Mobile Navigation Considerations
- Navigation adapts to touch interfaces
- Swipe gestures may supplement button navigation
- Breadcrumb navigation for nested views

## State Preservation

### Navigation Context
- Active meal planner section (Current/Planned/Completed) is remembered
- Selected week in Completed section persists during session
- Recipe search filters and selection state are preserved

### URL Parameters
- Language preference reflected in URLs when applicable
- Search queries and filters included in URL for bookmarking
- Week and recipe IDs in URLs for direct access

## Accessibility

### Keyboard Navigation
- All navigation elements accessible via keyboard
- Tab order follows logical flow
- Skip links provided for screen readers

### Screen Reader Support
- Navigation landmarks clearly defined
- Current location announced when navigation changes
- Breadcrumb information available to assistive technology

## Error Handling

### Invalid Routes
- Unknown URLs redirect to appropriate default pages
- Missing resources (weeks, recipes) show helpful error messages
- Graceful fallback to home page when navigation fails

### Network Issues
- Offline navigation continues to work with cached data
- Clear indication when network-dependent features are unavailable
- Retry mechanisms for failed navigation requests

---
This specification ensures consistent navigation behavior across the application while supporting both current web implementation and future mobile development.
