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

## DEBUGGING

## GIT GUIDELINES
- Specific git commit message format with agent attribution
- File movement protocols using `git mv`
- When committing, use the `--author` flag to identify the agent.
- When the Coder Agent needs to amend a commit, they should keep the original message.

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