# Task: Create HomePage Component Architecture

## Description
Refactor the current App component to extract HomePage functionality and establish a clean component architecture that supports the three main feature sections (Recipe Database, Meal Planner, Cooking Assistant).

## Acceptance Criteria
- [ ] Create dedicated HomePage component separated from App component
- [ ] Move language switching to a reusable header/navigation component
- [ ] Structure HomePage to accommodate three main feature sections
- [ ] Implement responsive grid layout using Chakra UI
- [ ] Remove Hello World demo content and replace with app structure
- [ ] Maintain all existing i18next functionality
- [ ] Ensure accessibility with proper heading hierarchy and semantic structure
- [ ] Component is responsive and works on mobile devices

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