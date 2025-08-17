# Story: Add Editable Week Titles

## User Story
As a meal planner, I want to give my weekly meal plans custom titles so that I can easily identify and organize different planning periods.

## Description
Currently, week plans are created with generic date-based titles. Users should be able to customize these titles to better reflect their planning needs, such as "Vacation Week", "Back to School", "Holiday Meals", or "Budget Week". This enhancement improves organization and makes it easier to navigate between different meal planning contexts.

## Acceptance Criteria
- [ ] Users can edit the week title directly from the meal planner interface
- [ ] Title editing is intuitive (click-to-edit or edit button)
- [ ] Week title is prominently displayed in the current week view
- [ ] Title changes are immediately saved and persisted
- [ ] Title validates for reasonable length limits (e.g., 50 characters)
- [ ] Empty titles fall back to the default date-based format
- [ ] Section uses consistent Chakra UI styling with the rest of the app
- [ ] All text supports internationalization (i18next)
- [ ] Feature is responsive and works on mobile devices

## Design Notes
- Use Chakra UI's Editable component for inline title editing
- Display title prominently at the top of the week planning interface
- Provide visual feedback when title is being edited vs. display mode
- Consider using a pencil icon to indicate editability
- Ensure title doesn't break layout with very long text
- Use appropriate typography hierarchy (likely Heading component)

## Technical Notes
- Extend ComidasWeek schema to make title field more prominent in UI
- Update PlannerContext to handle title updates
- Integrate with existing localStorage persistence system
- Add appropriate validation for title length and characters
- Update week creation flow to allow initial title setting
- Ensure title updates trigger proper re-renders

## Dependencies
- Requires existing meal planning functionality (create-comidas-week-planning.md)
- Depends on current PlannerContext and ComidasWeek data structure

## Out of Scope
- Title history or versioning
- Advanced title formatting or rich text
- Title templates or suggestions
- Sharing or collaboration features around titles
- Bulk title editing across multiple weeks

## Ready for Acceptance ✅

### Implementation Summary
The editable week titles feature has been successfully implemented with enhanced user experience based on feedback. Here's what was completed:

#### Core Functionality
- ✅ Click-to-edit week titles with visual feedback
- ✅ Custom Input/Heading toggle (compatible with Chakra UI v3)
- ✅ Keyboard controls (Enter to save, Escape to cancel)
- ✅ Title validation (max 50 characters, auto-trim)
- ✅ Automatic fallback to default if empty
- ✅ Persistent storage via PlannerContext and localStorage

#### Enhanced User Experience Flow
- ✅ **Auto-edit mode**: When creating a new week, user automatically enters title edit mode
- ✅ **Text selection**: Auto-generated title is pre-selected for easy replacement
- ✅ **Focus flow**: After saving title with Enter, focus automatically moves to meal input
- ✅ **Seamless workflow**: Users can quickly create weeks and start adding meals without extra clicks

#### Visual Design Improvements
- ✅ **No link styling**: Removed confusing blue hyperlink appearance for better UX
- ✅ **Monochrome pencil icon**: Added clean outline pencil icon (✎) positioned on the right side
- ✅ **Consistent sizing**: Edit input maintains same font size to prevent layout jumping
- ✅ **Proper font weight**: Display mode is bold, edit mode uses normal weight for natural editing experience
- ✅ **Flushed input style**: Clean, minimal border style during editing for polished look

#### Technical Implementation
- **WeekPlanner.tsx**: Custom editable component with refs for enhanced UX
- **PlannerContext.tsx**: `updateWeekTitle()` function integrated with localStorage
- **QuickPlanningForm.tsx**: Updated to accept forwarded ref for focus management
- **Testing**: 2 dedicated test cases covering editing and validation scenarios
- **Type Safety**: Full TypeScript integration with proper type definitions

### Context Integration
- Fully integrated with existing PlannerContext state management
- Uses established localStorage persistence layer via comidasWeekService
- Maintains all existing functionality while adding new capabilities
- No breaking changes to existing components or API

### TypeScript Compliance
- All new functions properly typed with explicit return types
- Component props include proper TypeScript interfaces
- State management follows established patterns
- No TypeScript errors or warnings in implementation

**Status**: Implementation complete with enhanced UX flow, all tests passing (106/106) ✅

## Product Owner Testing Workflow

### High-Level Validation
1. **Title Editing**: Click title → edit → Enter to save, Escape to cancel
2. **Visual Design**: Verify monochrome pencil icon (✎), no blue links, consistent sizing
3. **Enhanced Flow**: Create new week → auto-edit mode → Enter → focus moves to meal input
4. **Validation**: Test long titles (truncated), empty titles (fallback), persistence (refresh)

**Expected Behavior**: Seamless editing experience with professional styling and enhanced user flow.

**Acceptance Criteria**: All functionality works smoothly, no visual glitches, natural workflow from week creation to meal planning.

✅ Accepted by Hes