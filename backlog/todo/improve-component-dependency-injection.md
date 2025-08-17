# Improve Component Dependency Injection

## Description

Refactor planner UI components to follow dependency injection principles, reducing tight coupling to PlannerContext and improving reusability and testability.

## Acceptance Criteria

### 📋 **QuickPlanningForm Enhancement**

- [ ] **Remove context coupling**: Component should receive all data/behavior via props
- [ ] **Generic meal addition**: Accept `onAddMeal(title: string)` callback instead of context access
- [ ] **Week-agnostic design**: Works with any week type (current, planned, archived)
- [ ] **Improved testability**: Can be tested with mock props instead of context mocking

### 📋 **DraggableListItem Isolation**

- [ ] **Pure component design**: No context dependencies, all props injected
- [ ] **Callback-based actions**: `onEdit`, `onDelete`, `onToggleComplete` via props
- [ ] **Data through props**: Meal data and editing state from parent
- [ ] **Reusable across contexts**: Works outside meal planning if needed

### 📋 **WeekDisplay Simplification**

- [ ] **Smart component pattern**: Handles context access and business logic
- [ ] **Delegate to pure components**: Pass down data and callbacks to child components
- [ ] **Reduce direct context usage**: Minimize the surface area of context interaction
- [ ] **Clear data flow**: Parent fetches, children display and callback

### 📋 **Component Testing**

- [ ] **Unit test pure components**: Test with props, no context provider needed
- [ ] **Integration test smart components**: Test context interaction separately
- [ ] **Improve test coverage**: Target 85%+ for refactored components

## Technical Focus

**Before (Coupled):**
```tsx
const QuickPlanningForm = () => {
  const { currentWeek, addMeal, addMealToWeek } = usePlanner()
  // Complex logic deciding which function to use
}
```

**After (Injected):**
```tsx
const QuickPlanningForm = ({ week, onAddMeal }: Props) => {
  // Simple UI logic, behavior injected via onAddMeal
}
```

## Priority

🔥 **High** - Improves component architecture and enables better testing patterns
