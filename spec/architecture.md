# Architecture Overview

This document describes the initial technology choices and architectural direction for the Family Recipe App.

## Frontend

- **Framework**: React (with Vite for fast development and prototyping)
- **Language**: TypeScript
- **Component Library**: Chakra UI (for accessible, modern, and customizable UI components)
- **Internationalization**: i18next (for multilingual support)

## Data Storage

- **Prototype Phase**: Local storage or IndexedDB for single-user, offline-first experience
- **Future Expansion**: Plan for backend integration (Node.js/Express or Firebase) to support multi-user features and cloud sync

## Testing

- **Unit/Integration Testing**: Vitest (Vite-native) and React Testing Library

## Rationale

- The stack is chosen for rapid prototyping, strong community support, and easy transition to mobile or backend integration in the future.
- Chakra UI provides a great developer experience and ensures accessibility out of the box.

---


## Testing Rationale

Vitest is chosen over Jest because it is designed for Vite/ESM projects, requires minimal configuration, and works seamlessly with React, TypeScript, and static assets. It provides a fast, modern, and reliable testing experience for this stack.

This architecture will be reviewed and updated as the project evolves and requirements change.

---

## Application Architecture - High Level

### Core Design Principles
- **Start Simple**: Begin with plain text data structures, enhance incrementally
- **Family-Focused**: Support cooking assignments and child participation tracking
- **Flexible Planning**: "Comidas weeks" are 3-7 meal planning units, not calendar-bound
- **Progressive Enhancement**: Build basic functionality first, add sophistication later

### Key Architectural Concepts

#### Recipe Management
- Simple recipe database with name, plain text ingredients, and plain text steps
- Basic CRUD operations with search functionality
- Bootstrap with family recipe samples for immediate usability
- Design for future enhancement to structured ingredient lists

#### Meal Planning ("Comidas Weeks")
- Flexible planning units of 3-7 meals (not tied to calendar weeks)
- Support for both recipe-linked meals and ad-hoc meal ideas
- Quick planning workflow: type meals line-by-line with enter to continue
- Checkbox-based completion tracking with family member assignments

#### Family Cooking Management
- Track family members and identify children (who should cook once per week)
- Assign meals to specific family members
- Flexible day assignments (not strict calendar scheduling)
- Balance cooking responsibilities across family

### Implementation Strategy

#### Phase 1: Core Functionality
- Recipe database with basic CRUD and search
- Comidas week creation and meal planning
- Simple family member management
- Checkbox-based meal completion

#### Phase 2: Enhanced User Experience  
- Drag-and-drop meal reordering
- Week navigation (current/planned/archived)
- Completion celebrations and animations
- Improved recipe editing

#### Phase 3: Advanced Features
- Shopping list generation from meal plans
- Nutritional balance tracking
- Recipe sharing and collaboration
- Mobile-optimized interface

### Technology Alignment
- **Data Storage**: Start with localStorage, plan for backend evolution
- **User Interface**: Build on existing Chakra UI component system
- **State Management**: Extend current React patterns with Context for shared data
- **Testing**: Continue with Vitest and React Testing Library

### Success Criteria
- Family can quickly plan 3-7 meals for upcoming "comidas week"
- Easy recipe lookup and linking during meal planning
- Clear tracking of who cooks what and when
- Simple completion workflow for finished meals
- Smooth transition from current week to planning next week

For detailed technical specifications and implementation details, see `implementation/comidas-app/architecture.md`.
