# Add Family Member Management

## Description
Implement basic family member management to support cooking assignments, making sure everybody should cook once per week.

## Acceptance Criteria
- [ ] User can add family members with name and cooking frequency
- [ ] User can assign meals to specific family members during planning
- [ ] System tracks who has cooking assignments in current week
- [ ] Simple interface to modify family member assignments
- [ ] Basic validation that everybody gets cooking opportunities

## Technical Requirements
- Implement `FamilyMember` data model per architecture
- Create `FamilyService` with localStorage persistence
- Build `FamilyMemberPicker` component for meal assignments
- Add assignment tracking to `Comida` model
- Extend `QuickPlanningForm` to support assignment selection

## Priority
🟩 **Medium** - Important for family engagement but not critical for MVP

## Estimation
**Small** (1-2 days)

## Dependencies
- Core comidas week planning functionality

## Success Metrics
- Family members can be assigned during meal planning
- Everybody gets fair distribution of cooking assignments
- Assignment interface feels intuitive and quick