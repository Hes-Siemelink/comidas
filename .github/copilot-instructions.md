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

### 2. Coder Agent 👩‍💻
- **Role**: Software developer and implementer
- **Responsibilities**:
  - Implements features and technical tasks from the backlog
  - Writes, tests, and documents code in the `src` directory
  - Tracks progress by moving stories through backlog stages
  - Requests acceptance from the Product Owner when work is complete
  - Follows testing best practices and git workflow guidelines

### 3. Architect Agent 🏗️
- **Role**: Technical architecture advisor
- **Responsibilities**:
  - Defines overall technical architecture and technology stack
  - Provides guidance for project structure and design patterns
  - Reviews code for architectural improvements
  - Documents architectural decisions and rationale
  - Consulted on-demand for technical guidance

### 4. Product Owner Agent 🎯
- **Role**: Requirements definer and quality gatekeeper
- **Responsibilities**:
  - Defines requirements and acceptance criteria
  - Prioritizes backlog based on business value
  - Reviews and accepts completed stories
  - Currently implemented as **human-in-the-loop** (manual review)

### 5. Common Guidelines 📜
All agents must follow the shared guidelines from `common.md`:
- Concise communication and documentation
- Specific git commit message format with agent attribution
- File movement protocols using `git mv`
- Focus on value and intent rather than mechanical actions

This structure creates a collaborative AI development team where each agent has clear responsibilities and workflows, ensuring organized development with proper quality gates and progress tracking.

## TECH STACK

## PROJECT DOCUMENTATION & CONTEXT SYSTEM

## CODING STANDARDS

## WORKFLOW & RELEASE RULES

- The Coder Agent must request Product Owner approval before moving a story to "done".
- When working in Agent mode, the Coder Agent must request Product Owner approval before moving a story to "done".
- When a story implementation is complete, the Coder Agent must add a "Ready for Acceptance" section to the story file with instructions for the Product Owner.
- The Product Owner is not required to review code for acceptance. Acceptance focuses on context integration and TypeScript typing.
- All tests must pass before acceptance (this is assumed).
- Architect Agent review is optional.
- When creating a new week in the meal planner, the user should automatically be placed in title edit mode with the auto-generated title selected. Pressing Enter should save the title and focus should then move to the 'add meal' input box.
- The week title should not be a blue hyperlink. Instead, a right-aligned monochrome outline pencil icon (✎) should be used for editing.
- When editing the week title, the text size and style must be the same as in display mode, and the font weight should not be bold.

## DEBUGGING

## GIT GUIDELINES
- Specific git commit message format with agent attribution
- File movement protocols using `git mv`
- When committing, use the `--author` flag to identify the agent.
- When the Coder Agent needs to amend a commit, they should keep the original message.
- When moving a story to "done", commit all files from the root directory.
- When committing, the Coder Agent must:
  - Add all files.
  - Use `git status` to see the changes.
  - Distill a good commit message based on the changes.
  - Ignore files from `specstory`.
  - Ensure the commit is made from the correct directory (e.g., `comidas`).

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

- **todo/**: Contains upcoming features and enhancements, such as:
  - Family member management
  - Week navigation and archive
  - Meal-recipe linking improvements
  - Basic recipe database implementation

- **doing/**: Tracks work in progress.

- **done/**: Lists completed stories, including:
  - Chakra UI and i18next integration
  - Meal planner and recipe database home sections
  - Homepage component architecture
  - Project structure initialization
  - Basic routing, data persistence, icon system, and testing setup
  - Drag and drop meal ordering feature
  - Add editable week titles

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