# Implement Basic Recipe Database

## Description
Create minimal viable recipe database to support meal planning with simple CRUD operations, sample data, and basic search functionality.

## Acceptance Criteria
- [ ] User can view list of recipes
- [ ] User can add new recipe with name, ingredients (plain text), steps (plain text)
- [ ] User can edit existing recipes
- [ ] User can search recipes by name
- [ ] Bootstrap application with sample recipes from specification
- [ ] Recipes can be linked from meal planner (foundation for future stories)

## Technical Requirements
- Implement `Recipe` data model per architecture
- Create `RecipeService` with localStorage persistence
- Build `RecipeList`, `RecipeForm`, `RecipeSearchBar` components
- Initialize sample data: Albondigas de Marta, Appelmoes, Broccoli Salad de Leon
- Add `RecipeContext` for state management

## Priority
🟨 **High** - Required to support meal planning with recipe references

## Estimation
**Medium** (2-3 days)

## Dependencies
- None (standalone functionality)

## Success Metrics
- Sample recipes display immediately on first app load
- Adding new recipe takes less than 2 minutes
- Search returns relevant results quickly