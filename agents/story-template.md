# Story Template

Use this template when creating new user stories and technical tasks for the Family Recipe App backlog.

## User Story Template

```markdown
# Story: [Concise Title of the Feature/Task]

## User Story
As a [USER ROLE], I want to [DESIRED FUNCTIONALITY] so that [BENEFIT/VALUE ACHIEVED].

## Description
[Detailed description of what needs to be implemented, providing context and background information about the feature or task.]

## Acceptance Criteria
- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]
- [ ] [Specific, testable criterion 3]
- [ ] [Additional criteria as needed]
- [ ] Section uses consistent Chakra UI styling with the rest of the app
- [ ] All text supports internationalization (i18next)
- [ ] Feature is responsive and works on mobile devices

## Design Notes
- [UI/UX considerations and design guidance]
- [Chakra UI component recommendations]
- [Visual design requirements]
- [Accessibility considerations]

## Technical Notes
- [Implementation approach and technical considerations]
- [Integration points with existing code]
- [Data model or state management requirements]
- [Performance or security considerations]

## Dependencies
- [List any prerequisite stories or technical requirements]
- [External dependencies or integrations needed]

## Out of Scope
- [Additional features that would complicate this story]
- [Enhancements that should be implemented in future stories]
- [Complex functionality that should be split into separate stories]
```

## Technical Task Template

For non-feature work (setup, infrastructure, refactoring):

```markdown
# Task: [Concise Title of the Technical Work]

## Description
[Detailed description of the technical work that needs to be completed.]

## Acceptance Criteria
- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]
- [ ] [Specific, testable criterion 3]

## Technical Notes
- [Implementation approach and technical details]
- [Tools, libraries, or frameworks involved]
- [Configuration or setup requirements]

## Dependencies
- [Prerequisites or related work items]
```

## Guidelines

- **User Role Examples**: family member, recipe contributor, meal planner, home cook
- **Keep titles concise**: Focus on the main functionality being added
- **Make criteria testable**: Each acceptance criterion should be verifiable
- **Include standard requirements**: Always consider Chakra UI styling, i18next support, and mobile responsiveness
- **Be specific in technical notes**: Provide clear guidance for implementation
- **Link dependencies**: Reference related stories by filename when possible
- **Keep scope focused**: A story should do one thing and do it well. Define a clear, single purpose for each story
- **Define out of scope**: Explicitly list additional features that would complicate execution and should be implemented in future stories