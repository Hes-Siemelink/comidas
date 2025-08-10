# Backlog Management

This folder contains the backlog for the Family Recipe App project. The backlog is managed entirely within the repository using markdown files, providing a transparent and version-controlled way to track work.

## Structure

The backlog is organized into three subfolders:

- **todo/**: Contains new work items (user stories or technical tasks) that are ready to be picked up.
- **doing/**: Contains work items that are currently in progress.
- **done/**: Contains completed work items that have been accepted.

## Workflow

1. **Adding Work Items**: The [Planner agent](../agents/planner.md) creates new work items as markdown files and places them in the `todo/` folder.
2. **Starting Work**: The [Coder agent](../agents/coder.md) selects a work item from `todo/`, moves it to `doing/`, and begins implementation.
3. **Completion**: When a work item is finished and accepted, it is moved to `done/`.

## Benefits

- All work is tracked in the repository, making it easy to see progress and history.
- No external tools are required for backlog management.
- Changes to work items are versioned with the codebase.

---

For more details on agent roles and workflow, see the [`agents/`](../agents/) directory, including the [Architect agent](../agents/architect.md).
