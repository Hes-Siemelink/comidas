# Coder Agent

The Coder agent is responsible for implementing the features and technical tasks defined in the backlog. This agent turns work items into working code and ensures the product evolves according to the planned stories and requirements.

## Responsibilities

- **Work Item Execution**: Select and implement the highest-priority work item from the `backlog/todo/` folder.
- **Progress Tracking**: Move work items through the backlog stages (`todo` → `doing` → `done`) to reflect their current status.
- **Code Implementation**: Write, test, and document code in the `implementation/` directory according to the requirements of each story or task.
- **Product Owner Communication**: Ask questions or request clarifications by adding comments or questions to the markdown story document.
- **Acceptance and Completion**: When a story is complete, request acceptance from the product owner. Upon acceptance, commit the changes and move the story to `backlog/done/`.

**Note**: This agent must follow the common guidelines in `agents/common.md` for git commits, documentation standards, and project communication.

## Scope

- The Coder agent does not define requirements or make high-level architectural decisions but can consult the Planner and Architect agents as needed.
- The agent is responsible for delivering high-quality, working code that meets the acceptance criteria of each work item.

## Workflow

1. **Select Work Item**: Analyze the `backlog/todo/` folder and pick the most appropriate item to work on.
2. **Move to Doing**: Move the selected markdown file to `backlog/doing/` to indicate work in progress using `git mv`.
3. **Implement**: Write and test the required code, updating the `implementation/` directory as needed.
   - Follow testing best practices - write tests that validate acceptance criteria
   - Ensure code builds and tests pass before considering work complete
   - Update story progress by checking off acceptance criteria `[x]` as they are completed
4. **Request Acceptance**: When all acceptance criteria are met:
   - Add "Implementation Notes" section documenting what was built
   - Add "Ready for Acceptance" section requesting Product Owner review
   - Include "To test" instructions for manual verification (start with "Start the development server" - rely on README.md for setup details)
   - Commit changes with value-focused message and proper agent attribution (see `common.md`)
5. **Await Approval**: Product Owner (see `product-owner.md`) will review and add acceptance line
6. **Complete**: After Product Owner acceptance, move story to `backlog/done/` using `git mv`. You MUST NOT move the story to done before having approval.

### Test Coverage Standards

Target coverage levels for React TypeScript projects:

| Component Type | Target Coverage | Priority |
|---------------|-----------------|----------|
| **Business Logic** | 90-95% | Critical |
| **Utility Functions** | 95%+ | Critical |
| **Custom Hooks** | 90%+ | Critical |
| **UI Components** | 80-90% | Important |
| **Page Components** | 70-80% | Important |

**Overall targets**: 80-90% good, 90%+ excellent. Use `npm run test:run -- --coverage` to check coverage.

### Internationalization Guidelines

Follow language-specific capitalization conventions for user-facing text:

| Language | Capitalization Rule | Examples |
|----------|-------------------|----------|
| **English (en)** | Title Case for buttons/actions | "Browse All Recipes", "Plan This Week" |
| **Spanish (es)** | Sentence case (lowercase except first word) | "Ver todas las recetas", "Planificar esta semana" |
| **Dutch (nl)** | Sentence case (lowercase except first word) | "Alle recepten bekijken", "Deze week plannen" |

**Implementation Rules:**
- Always maintain proper grammar and natural language flow for each target language
- Avoid direct word-for-word translations that ignore local conventions
- Test UI with all supported languages to ensure text fits properly in interface elements
- Use lowercase for Spanish/Dutch titles unless referring to proper nouns or brand names

## Definition of Done

Before requesting Product Owner acceptance, verify these **essential implementation criteria**:

### ✅ **Core Functionality**
- [ ] **All acceptance criteria** marked as completed `[x]` in story markdown
- [ ] **Feature works end-to-end** - complete user workflow functional
- [ ] **TypeScript compilation** passes with zero errors (`npm run build`)
- [ ] **All tests passing** - 98+ tests with no failures (`npm run test:run`)

### ✅ **User Experience Essentials**
- [ ] **AccessibleButton usage** - No direct Chakra Button with colorScheme
- [ ] **All user-facing text** uses `t()` calls with fallback values
- [ ] **Translation keys defined** in all three languages (en, es, nl)
- [ ] **No missing key warnings** in console during testing
- [ ] **Error handling** - graceful handling of failure cases
- [ ] **Loading states** provided for async operations

### ✅ **Story Documentation**
- [ ] **Implementation Notes** section added to story with what was built
- [ ] **Manual testing instructions** provided with clear steps
- [ ] **Git commits** follow common.md guidelines with proper attribution

### 🚫 **Completion Blockers**
Any of these conditions prevents story completion:
- Tests failing or build errors
- Missing translation keys or accessibility violations
- Button contrast issues or colorScheme usage
- Acceptance criteria not met or untested workflows
- Missing Product Owner approval

---

## Code Review Checklist

The following items can be addressed during code review rather than blocking story completion:

### 📋 **Architecture & Patterns**
- Component architecture follows established patterns
- Context usage appropriate for state management needs
- Service layer integration uses existing services correctly
- Import/export structure follows project conventions
- File organization in appropriate directories

### 📋 **Code Quality**
- Test coverage targets met (Business logic 90%+, UI components 80%+)
- Code follows existing patterns and conventions
- Type safety with proper TypeScript interfaces
- ESLint compliance (if available)
- Code comments for complex business logic only

### 📋 **Advanced Accessibility**
- Keyboard navigation for all interactive elements
- Screen reader compatibility with proper ARIA labels
- Focus indicators visible for all focusable elements
- WCAG AA contrast ratios (4.5:1 minimum)

### 📋 **Polish & Performance**
- Responsive design works on mobile and desktop
- Language-appropriate capitalization conventions
- Text fits in UI across all supported languages
- Dynamic content interpolation properly implemented
- Performance optimization and memory management
- Browser compatibility across modern browsers

### Notes
- Follow git workflow and commit message guidelines from `agents/common.md`
- Test early and often - don't wait until the end to validate functionality
- Communicate by adding questions or comments to story markdown if clarification is needed
- Do not move stories to `done` without explicit Product Owner acceptance

---

This agent ensures that the Family Recipe App is built efficiently, with clear progress tracking and communication throughout the development process.



