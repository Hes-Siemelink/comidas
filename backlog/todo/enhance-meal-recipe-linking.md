# Enhance Meal-Recipe Linking

## Description
Enable seamless linking between planned meals and recipe database entries, supporting both recipe-based meals and ad-hoc meal ideas.

## Acceptance Criteria
- [ ] During meal planning, user can link meal to existing recipe
- [ ] Meal titles automatically populate from linked recipe names
- [ ] Support for ad-hoc meals without recipe links (e.g., "Supermarket pizza with salad")
- [ ] User can navigate from meal to recipe details
- [ ] Clear visual distinction between recipe-linked and ad-hoc meals

## Technical Requirements
- Extend `QuickPlanningForm` with recipe search/selection
- Implement recipe lookup during meal entry
- Add recipe detail navigation from meal list
- Update `CheckableListItem` to show recipe link status

## Priority
🟦 **Low** - Enhances user experience but not essential for MVP

## Estimation
**Medium** (2-3 days)

## Dependencies
- Basic recipe database
- Core comidas week planning

## Success Metrics
- Recipe linking feels natural and quick
- Mixed recipe/ad-hoc meal planning works smoothly
- Users can easily access recipe details during cooking