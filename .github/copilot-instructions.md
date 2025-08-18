---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
---

## <headers/>

## AGENT ROLES & RESPONSIBILITIES

This project uses a multi-agent approach where different AI agents have specific responsibilities, mimicking a real development team.

### 1. Planner Agent 📋
- **Role**: Product requirements analyst and backlog manager
- **Responsibilities**:
  - Analyzes specifications in the `specs` directory
  - Breaks down requirements into actionable user stories and technical tasks
  - Manages the backlog organization (`todo` → `doing` → `done`)
  - Prioritizes work items based on importance and dependencies
- Read instructions in agents/planner.md when session starts or when you are asked to pick up this role.

### 2. Coder Agent 👩‍💻
- **Role**: Software developer and implementer
- **Responsibilities**:
  - Implements features and technical tasks from the backlog
  - Writes, tests, and documents code in the `src` directory
  - Tracks progress by moving stories through backlog stages
  - Requests acceptance from the Product Owner when work is complete
  - Follows testing best practices and git workflow guidelines
  - When committing, the Coder Agent must:
    - Add all files.
    - Use `git status` to see the changes.
    - Distill a good commit message based on the changes. If there is not much to say, then keep it short.
    - Ignore files from `specstory`.
    - Ensure the commit is made from the correct directory (e.g., `comidas`).
    - When the Coder Agent needs to amend a commit, they should keep the original message.
- Read instructions in agents/coder.md when session starts or when you are asked to pick up this role.

### 3. Architect Agent 🏗️
- **Role**: Technical architecture advisor
- **Responsibilities**:
  - Defines overall technical architecture and technology stack
  - Provides guidance for project structure and design patterns
  - Reviews code for architectural improvements
  - Documents architectural decisions and rationale
  - Consulted on-demand for technical guidance
- Read instructions in agents/architect.md when session starts or when you are asked to pick up this role.

### 4. Product Owner Agent 🎯
- **Role**: Requirements definer and quality gatekeeper
- **Responsibilities**:
  - Defines requirements and acceptance criteria
  - Prioritizes backlog based on business value
  - Reviews and accepts completed stories
  - Currently implemented as **human-in-the-loop** (manual review)
  - The Product Owner is not required to review code for acceptance. Acceptance focuses on context integration and TypeScript typing.
- Read instructions in agents/product-owner.md when session starts

### 5. Common Guidelines 📜
All agents must follow the shared guidelines from `common.md`:
- Concise communication and documentation
- Specific git commit message format with agent attribution
- File movement protocols using `git mv`
- Focus on value and intent rather than mechanical actions

Our project implements a **multi-agent AI development approach** that distributes development work across specialized AI agents, each with distinct responsibilities similar to a real software team. The Planner Agent analyzes requirements and organizes the backlog. The Coder Agent implements features and manages git workflow. The Architect Agent provides technical guidance and reviews architecture decisions. This creates a collaborative AI ecosystem where human oversight focuses on high-value Product Owner decisions rather than mechanical implementation tasks.

Stories flow through structured directories: `todo` → `doing` → `done`, with additional `epic` and `later` sections. Each agent follows specific protocols for moving work items and requesting approvals.

This approach creates clear accountability since each agent knows exactly what they're responsible for and when they make decisions. Quality stays high because the Product Owner still gates what gets shipped, but now they focus on the important stuff rather than nitpicky details. Everything gets tracked properly through git commits that show which agent did what, making it easy to trace how features evolved. The whole thing scales better because humans only need to weigh in on strategic decisions while the agents handle the routine implementation work. Most importantly, it brings consistency to what used to be chaotic AI interactions and transforms AI development from ad-hoc chaos into structured, collaborative teamwork.

## TECH STACK

## PROJECT DOCUMENTATION & CONTEXT SYSTEM

## CODING STANDARDS

- UI components must be created as potentially reusable in principle and decoupled from domain-specific lookup logic, in favor of property injection. See `code-review.md` for more details.
- Code review will be a periodical exercise to analyze the code on high level and low level and make improvements.

## WORKFLOW & RELEASE RULES

- The Coder Agent must request Product Owner approval before moving a story to "done".
- When working in Agent mode, the Coder Agent must request Product Owner approval before moving a story to "done".
- When a story implementation is complete, the Coder Agent must add a "Ready for Acceptance" section to the story file with instructions for the Product Owner.
- All tests must pass before acceptance (this is assumed).
- Architect Agent review is optional.
- When creating a new week in the meal planner, the user should automatically be placed in title edit mode with the auto-generated title selected. Pressing Enter should save the title and focus should then move to the 'add meal' input box.
- The week title should not be a blue hyperlink. Instead, a right-aligned monochrome outline pencil icon (✎) should be used for editing.
- When editing the week title, the text size and style must be the same as in display mode, and the font weight should not be bold.
- Badges should only be displayed on the Completed (Archived) weeks button.
- In "Browse weeks" make the order Archived - Current - Planned. Ensure translations are available for Spanish and Dutch.
- The Plan Ahead button must be removed.
- The week browser ("Current weeks", "Planned weeks") should only be on Completed.
- Make sure Create new week button is displayed if there is no week in Current / Planned
- The Planned week must be editable, just like the Current week. It should be the same behavior to avoid surprises by the user and simplify implementation. That means that you can also check meals (although they are in the future!).
- After completing the current week, the planned week should become the current week.
- Remove the message "No current week available" from Archive and Planned.
- On Planned, show the "Create New Week" button if there is currently no Planned week
- When completing the current week, I want to stay on the current week and I want to see the week that was previously in Planned and is now current.
- The archived section should be named Completed. Check all code and UI to use Completed.
- If I am on Current and Planner and I edit the week title or add or remove a meal, the UI must update.
- The Current section must show the current week right away, not only after navigation.
- The Meal List must be editable on Planned. It should be editable.
- On Planned, the Meal List editor must add meals. If you type a name and press enter, the behavior should be the same as on Current
- Remove the badges from Current and Planned. There is always at most 1, so it doesn't add value
- When you check all meals of current week, you get the ceremony pup up and Current is moved to archive. However, then a new week is created in current, whereas we should move the week that is currently planned into current
- If there is no Planned, Current should be empty.
- If you press Plan Next Week, you will get a new week.
- When you press View Archive, you first see the old week in completed under Current and it disappears when you refresh the browser or navigate away and back.
- The other button on the Congratulations screen still says "View archive" but goes to Current. Just remove this button, problem solved
- If I hit Complet week button, I first get a plain popup and then the celebration screen. Just use the celebration screen. Then, most importantly, the week in Planned is supposed to become Current. But instead we get a new week in current and the old one stays in planned
- When picking up a story, the Coder Agent must move the story to `doing` before starting implementation.

## DEBUGGING

- **NEVER USE 'npm test'. Always use "npm run test:run"**
- **Always run TypeScript compilation during our build process.**
- Add a type-check script for development. For example: `"type-check": "tsc --noEmit"`
- Add a type-check script for development. For example: `"type-check": "tsc -b --noEmit"`

## GIT GUIDELINES
- Specific git commit message format with agent attribution
- File movement protocols using `git mv`
- When committing, use the `--author` flag to identify the agent.
- When the Coder Agent needs to amend a commit, they should keep the original message.
- When moving a story to "done", commit all files from the root directory.
- When committing, the Coder Agent must:
  - Add all files.
  - Use `git status` to see the changes.
  - Distill a good commit message based on the changes. If there is not much to say, then keep it short.
  - Ignore all files from `specstory`.
  - Ensure the commit is made from the correct directory (e.g., `comidas`).
- If there is not much to say, then keep it short.

## AGILE INTEGRATION

- To look at a specific work item in Agility, a work item ID or number is needed.
- **Work Item ID/Number** - This could be something like "B-12345", "S-67890", or just a numeric ID like "12345"
- **Example usage:**
  ```
  Can you show me work item B-12345?
  ```
  or
  ```
  What's the status of ticket 67890?
  ```

## BACKLOG STRUCTURE

The backlog is organized into five main directories that represent the flow of work: `epic` for high-level stories, `todo` for upcoming features, `doing` for work in progress, `done` for completed items, and `later` for deferred ideas. Stories move through the structured pipeline from `todo` → `doing` → `done` as agents complete their work, with each agent following specific protocols for moving items between stages. Each section includes a `README.md` for guidance, and agents must request Product Owner approval before moving stories to the "done" stage.

- **epic/**: Contains epic-level stories such as:
  - code-review.md serves as an epic.

- **todo/**: Contains upcoming features and enhancements, such as:
  - improve-component-dependency-injection.md - Addresses component coupling issues
  - standardize-week-transition-logic.md - Fixes completion flow inconsistencies
  - code-quality-internal-review.md - File-by-file code improvements
  - enhance-testing-architecture.md - Aligns tests with tests with architecture

- **doing/**: Tracks work in progress.

- **done/**: Lists completed stories, including:
  - Chakra UI and i18next integration
  - Meal planner and recipe database home sections
  - Homepage component architecture
  - Project structure initialization
  - Basic routing, data persistence, icon system, and testing setup
  - Drag and drop meal ordering feature
  - Add editable week titles
  - Refactor PlannerContext API

- **later/**: Holds deferred or lower-priority ideas, such as:
  - Cooking assistant home section

- Each section has a `README.md` for guidance and organization.

## TESTING

- When implementing new context functionality, ensure existing tests cover the new functionality by updating test wrappers to include the relevant context providers. New test files may not be needed if existing tests can be adapted.
- Before marking a story as complete, ensure that new features have dedicated tests covering their functionality. For example, the editable week title feature requires tests for:
    - Rendering the editable week title
    - Editing the title and saving
    - Validation (length, fallback)
    - Persistence via PlannerContext
- New features must have dedicated tests covering their functionality.
- When writing tests that use Chakra UI components and the `ChakraProvider`, tests should import WeekPlanner from the index file, just like PlannerPage does. For example: `import WeekPlanner from './planner'`
- When using `ChakraProvider` in tests, use the following pattern:
  1. `import { ChakraProvider, defaultSystem } from '@chakra-ui/react'`
  2. `<ChakraProvider value={defaultSystem}>`
- **NEVER USE 'npm test'. Always use "npm run test:run"**
- **Always run TypeScript compilation during our build process.**
- Add a type-check script for development. For example: `"type-check": "tsc --noEmit"`
- Add a type-check script for development. For example: `"type-check": "tsc -b --noEmit"`

## CODE REVIEW GUIDELINES
- UI components should be designed as potentially reusable components that receive their dependencies through props rather than directly coupling to domain-specific contexts.

### Function Design Principles

This approach creates clear accountability since each agent knows exactly what they're responsible for and when they make decisions. Quality stays high because the Product Owner still gates what gets shipped, but now they focus on the important stuff rather than nitpicky details. Everything gets tracked properly through git commits that show which agent did what, making it easy to trace how features evolved. The whole thing scales better because humans only need to weigh in on strategic decisions while the agents handle the routine implementation work. Most importantly, it brings consistency to what used to be chaotic AI interactions by establishing standardized workflows that everyone follows.

Avoid function coupling.

#### Detection Patterns:

*   Functions that assume specific context state
*   Hard-coded dependencies on particular data instances
*   Components that only work in certain modes/states
*   Function names that don't accurately reflect their limitations
*   Functions that use either a prop or a context variable to determine behavior instead of a single injected callback
* Does the function exhibit parameter coupling?

#### Real-World Example:

The `updateWeekTitle` function was tightly coupled to `currentWeek`, making it unusable for planned weeks.

```typescript
// ❌ Anti-pattern: Function only works for current week
const updateWeekTitle = async (title: string) => {
  if (currentWeek) {
    const updatedWeek = { ...currentWeek, title };
    await comidasWeekService.update(currentWeek.id, updatedWeek);
    setCurrentWeek(updatedWeek);
  }
};

// ✅ Good: Function works for any week
const updateWeekTitleById = async (weekId: string, title: string) => {
  const weekToUpdate = weekHistory.find((week) => week.id === weekId) || currentWeek;
  if (weekToUpdate) {
    const updatedWeek = { ...weekToUpdate, title };
    await comidasWeekService.update(weekId, updatedWeek);
    setCurrentWeek(updatedWeek);
    setWeekHistory((prev) =>
      prev.map((w) => (w.id === weekId ? { ...w, title } : w))
    );
  }
};
```

#### Review Questions:

*   Does the function assume it's only operating on the current week?
*   Can this function work with any week object, or is it limited to a specific week?
*   Is the function name misleading or too specific, given its actual behavior?
*   Does a component use multiple functions, when a single injected callback would be preferable?
* Does the function exhibit parameter coupling?

## BACKLOG

- The `standardize-week-transition-logic.md` story in the `todo` directory addresses business logic patterns and state machine consistency, focusing on the internal logic flow of week transitions rather than just the API structure. It should remain in the `todo` directory with a 🔥 Critical priority until the following are addressed:
    - **Multiple Completion Paths**: Verify if `handleWeekCompletion()` exists and is used by both automatic (`toggleMealComplete`) and manual (`completeWeek`) completion flows.
    - **State transition consistency**: Verify no temporary 'completed' status in currentWeek.
    - **Atomic state updates**: Ensure week transitions are single operations.
    - **Comprehensive transition tests**: Story-specific validation coverage.