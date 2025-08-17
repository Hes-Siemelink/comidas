# Refactor PlannerContext API Surface

## Description

Simplify and standardize the PlannerContext API to reduce complexity and eliminate function duplication. The context currently has 20+ functions with overlapping responsibilities and inconsistent patterns.

## Acceptance Criteria

### 📋 **API Simplification**

- [ ] **Consolidate duplicate functions**: Remove `addMeal/addMealToWeek`, `updateWeekTitle/updateWeekTitleById` duplication
- [ ] **Standardize parameter patterns**: All week operations should use `weekId` consistently
- [ ] **Reduce function count**: Target maximum 15 core functions in context interface
- [ ] **Separate concerns**: Split state selectors from state mutations
- [ ] **Remove redundant convenience functions**: Keep only essential operations

### 📋 **Function Organization**

- [ ] **Week Management**: `createWeek`, `completeWeek`, `archiveWeek`, `updateWeekTitle`
- [ ] **Meal Operations**: `addMeal`, `updateMeal`, `deleteMeal`, `toggleMealComplete`, `reorderMeals`
- [ ] **State Selectors**: `getCurrentWeek`, `getPlannedWeek`, `getArchivedWeeks`
- [ ] **Ceremony Control**: `showCeremony`, `dismissCeremony`

### 📋 **Breaking Changes**

- [ ] **Remove currentWeek-specific functions**: Replace with explicit weekId parameters
- [ ] **Update all components**: Migrate from old API to simplified API
- [ ] **Update tests**: Ensure all function usage follows new patterns

## Technical Focus

**Current Issues:**
- `addMeal()` vs `addMealToWeek()` - same logic, different parameters
- `updateWeekTitle()` vs `updateWeekTitleById()` - coupling vs flexibility
- 20+ functions creating cognitive overhead for developers

**Target Architecture:**
- Single function per operation type with explicit parameters
- Consistent async patterns across all mutations
- Clear separation between selectors and mutations

## Priority

🔥 **High** - Reduces technical debt and improves maintainability before adding new features
