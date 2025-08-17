# Add Week Navigation and Archive

## Description
Implement navigation between current, planned, and archived comidas weeks with completion ceremony when weeks finish.

## Acceptance Criteria
- [ ] User can navigate between current and planned weeks
- [ ] When last meal is completed, week moves to archive with confirmation
- [ ] User can browse archived weeks to see previous meal plans
- [ ] Clear visual indicators for week status (current/planned/archived)
- [ ] "Nice animation" for week completion ceremony

## Technical Requirements
- Implement week status transitions in `ComidasWeekService`
- Create `WeekNavigation` component
- Build archive browse interface
- Add `CompletionCeremony` component with animations
- Update `ComidasWeekContext` to handle multiple weeks

## Priority
🟦 **Low** - Improves organization but not critical for core functionality

## Estimation
**Medium** (2-3 days)

## Dependencies
- Core comidas week planning functionality

## Success Metrics
- Week completion feels celebratory and satisfying
- Archive browsing helps with future meal planning ideas
- Navigation between weeks feels intuitive

✅ Old story, seems to be covered now