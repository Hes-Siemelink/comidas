# Task: Create HomePage Component Architecture

## Description
Refactor the current App component to extract HomePage functionality and establish a clean component architecture that supports the three main feature sections (Recipe Database, Meal Planner, Cooking Assistant).

## Acceptance Criteria
- [x] Create dedicated HomePage component separated from App component
- [x] Move language switching to a reusable header/navigation component
- [x] Structure HomePage to accommodate three main feature sections
- [x] Implement responsive grid layout using Chakra UI
- [x] Remove Hello World demo content and replace with app structure
- [x] Maintain all existing i18next functionality
- [x] Ensure accessibility with proper heading hierarchy and semantic structure
- [x] Component is responsive and works on mobile devices

## Technical Notes
- Extract HomePage as a separate component in `src/components/HomePage.tsx`
- Create reusable LanguageSwitcher component for header
- Use Chakra UI's Grid or SimpleGrid for responsive section layout
- Implement proper TypeScript interfaces for component props
- Follow existing code patterns for i18next integration
- Remove demo-specific code (logos, counter, HMR text)
- Structure components to be easily testable

## Dependencies
- Must work with the basic routing structure being implemented
- Requires existing Chakra UI and i18next setup

## Implementation Notes
Completed HomePage component architecture with the following enhancements:

### Components Enhanced
- **src/components/HomePage.tsx** - Complete redesign with proper architecture
  - Hero section with app title and description
  - Responsive SimpleGrid layout for three feature sections
  - FeatureSection component for consistent styling
  - Proper heading hierarchy (h1, h2, h3)
  - Container-based responsive design

### Key Features Implemented
- **Responsive Grid Layout**: Uses SimpleGrid with responsive columns (1 on mobile, 2 on tablet, 3 on desktop)
- **Semantic HTML Structure**: Proper heading hierarchy with h1 for main title, h2 for features section, h3 for each feature
- **Accessibility Compliance**: ARIA-compliant structure, proper heading levels, focus management
- **Internationalization**: Extended i18n support with new "home.features.title" translation keys
- **Placeholder System**: Feature sections clearly marked as placeholders with "Coming soon..." text
- **TypeScript Interfaces**: Proper FeatureSectionProps interface for component props
- **Container Design**: Uses Chakra UI Container for proper max-width and responsive padding

### Code Structure
- Separated FeatureSection as reusable component within HomePage
- Clean component architecture ready for future feature implementation  
- Maintained existing routing and navigation integration
- Updated all page components to use h1 headings for consistency

### Testing
- Updated comprehensive test suite (18 tests for Pages components)
- Tests verify heading structure, feature sections, placeholder content, and i18n
- All 48 tests passing including accessibility compliance tests

## Ready for Acceptance
Product Owner: The HomePage component architecture is complete and meets all acceptance criteria. The page now has a proper structure for the three main feature sections with responsive design and accessibility compliance.

**To test:**
1. Start the development server
2. Verify the HomePage shows proper structure with hero section and three feature placeholders
3. Test responsive behavior by resizing the browser window
4. Verify language switching works and updates the "Main Features" heading
5. Test accessibility with screen reader or keyboard navigation

✅ Accepted by Hes

## Acceptance notes
- App layout: visual and logical organization was taken out-of-scope because this is a technical story