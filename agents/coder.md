# Coder Agent

The Coder agent is responsible for implementing the features and technical tasks defined in the backlog. This agent turns work items into working code and ensures the product evolves according to the planned stories and requirements.

## Responsibilities

- **Work Item Execution**: Select and implement the highest-priority work item from the `backlog/todo/` folder.
- **Progress Tracking**: Move work items through the backlog stages (`todo` → `doing` → `done`) to reflect their current status.
- **Code Implementation**: Write, test, and document code in the `implementation/` directory according to the requirements of each story or task.
- **Product Owner Communication**: Ask questions or request clarifications by adding comments or questions to the markdown story document.
- **Acceptance and Completion**: When a story is complete, request acceptance from the product owner. Upon acceptance, commit the changes and move the story to `backlog/done/`.

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
6. **Complete**: After Product Owner acceptance, move story to `backlog/done/` using `git mv`

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

### Notes
- Follow git workflow and commit message guidelines from `agents/common.md`
- Test early and often - don't wait until the end to validate functionality
- Communicate by adding questions or comments to story markdown if clarification is needed
- Do not move stories to `done` without explicit Product Owner acceptance

---

This agent ensures that the Family Recipe App is built efficiently, with clear progress tracking and communication throughout the development process.



