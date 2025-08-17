# Code Review Guidelines

This document outlines the principles and practices for conducting code reviews in the Comidas project. Code reviews are periodical exercises to analyze code at both high and low levels, ensuring architectural consistency, code quality, and maintainability.

## Review Frequency

- **Continuous**: During active development iterations
- **Sprint Reviews**: At the end of major feature implementations
- **Architectural Reviews**: When introducing new patterns or major refactoring
- **Pre-Release**: Before significant releases or deployments

## Core Architectural Principles

### 🏗️ **Component Design Principles**

#### **Dependency Injection Over Context Coupling**

**Principle**: UI components should be designed as potentially reusable components that receive their dependencies through props rather than directly coupling to domain-specific contexts.

**✅ Good Example:**
```tsx
interface QuickPlanningFormProps {
  week: ComidasWeek
  onAddMeal: (mealTitle: string) => Promise<void>
  placeholder?: string
}

const QuickPlanningForm = ({ week, onAddMeal }: QuickPlanningFormProps) => {
  // Component only handles UI logic
  // Business logic is injected via onAddMeal callback
  await onAddMeal(mealTitle)
}
```

**❌ Anti-Pattern:**
```tsx
const QuickPlanningForm = ({ isCurrentWeek? }: Props) => {
  const { currentWeek, addMeal, addMealToWeek } = useContext() // ❌ Tight coupling
  const targetWeek = week || currentWeek                       // ❌ Lookup logic
  
  if (isCurrentWeek) {                                        // ❌ Business decisions
    await addMeal(title)
  } else {
    await addMealToWeek(weekId, title)
  }
}
```

**Benefits:**
- **Testability**: Easy to test with mock functions and data
- **Reusability**: Component can work with any week type
- **Separation of Concerns**: UI logic separate from business logic
- **Performance**: No unnecessary context subscriptions
- **Clear Interface**: Explicit dependencies via props

#### **Parent Component Responsibility**

The parent component should handle:
- Context access and data retrieval
- Business logic decisions
- Callback function creation
- Domain-specific knowledge

```tsx
// Parent handles business logic and injects behavior
<QuickPlanningForm 
  week={week}
  onAddMeal={async (mealTitle) => {
    if (isCurrentWeek) {
      await addMeal(mealTitle)         // Optimized path for current week
    } else {
      await addMealToWeek(week.id, mealTitle) // Generic path for any week
    }
  }}
/>
```

### 🎯 **Component Categories**

#### **Pure Components** (Highest Priority for Injection)
- Form components (inputs, selectors, editors)
- Display components (lists, cards, viewers)
- Interactive widgets (drag-drop, modals, dialogs)

**Requirements:**
- All data via props
- All behavior via callback props
- No direct context usage
- Easily testable in isolation

#### **Smart Components** (Context-Aware)
- Page-level components
- Feature coordinators
- Context providers
- Route handlers

**Allowed:**
- Direct context access
- Business logic decisions
- Data fetching and management
- State coordination

#### **Hybrid Components** (Use Sparingly)
- Large feature components that need both context and reusability
- Should clearly separate pure and context-dependent parts
- Consider splitting into smaller components

### � **Function Design Principles**

#### **Avoid Hard-Coded Context Dependencies**

**Principle**: Functions should operate on explicit parameters rather than being tightly coupled to specific context state. This prevents bugs when functions are used in different contexts.

**✅ Good Example:**
```tsx
// Flexible function that works with any week
const updateWeekTitleById = useCallback(async (weekId: string, title: string): Promise<ComidasWeek> => {
  const targetWeek = currentWeek?.id === weekId ? currentWeek : weekHistory.find(week => week.id === weekId);
  if (!targetWeek) throw new Error('Week not found');
  
  const updatedWeek = { ...targetWeek, title: title.trim().slice(0, 50), updatedAt: new Date() };
  await comidasWeekService.update(weekId, updatedWeek);
  return findAndUpdateWeek(weekId, () => updatedWeek);
}, [currentWeek, weekHistory, findAndUpdateWeek]);
```

**❌ Anti-Pattern:**
```tsx
// Tightly coupled to currentWeek only - breaks for planned weeks
const updateWeekTitle = useCallback(async (title: string) => {
  if (!currentWeek) return;  // ❌ Hard-coded assumption
  const updatedWeek = { ...currentWeek, title: title.trim(), updatedAt: new Date() };
  setCurrentWeek(updatedWeek);  // ❌ Only updates current, not planned
  await comidasWeekService.update(updatedWeek.id, updatedWeek);
}, [currentWeek]);  // ❌ Limited dependency scope
```

**Common Coupling Bugs:**
- Functions assume specific context state (e.g., always `currentWeek`)
- Hard-coded logic that doesn't adapt to different use cases
- Implicit dependencies that break when used in new contexts
- Missing parameters that force tight coupling to global state

**Detection Patterns:**
- Functions with fewer parameters than they should need
- Functions that reference global state directly instead of accepting it as parameters
- Functions that make assumptions about which entity they're operating on
- Functions that work in one component but fail in another similar context

**Real-World Example (Comidas Bug):**
```tsx
// ❌ This caused "Planned week title editing doesn't work"
const updateWeekTitle = useCallback(async (title: string) => {
  if (!currentWeek) return;  // Only works for current weeks!
  // ... update logic only for currentWeek
}, [currentWeek]);

// Component tries to use it for planned weeks - silent failure!
<WeekDisplay viewingStatus="planned" />  // Title editing broken
```

**Resolution:**
```tsx
// ✅ Function works for any week by accepting explicit ID
const updateWeekTitleById = useCallback(async (weekId: string, title: string) => {
  const targetWeek = findWeek(weekId);  // Works for any week
  // ... update logic for specified week
}, []);

// Now works everywhere
await updateWeekTitleById(week.id, newTitle);  // Works for current AND planned
```

### �📋 **Code Review Checklist**

## High-Level Architecture Review

### 🏗️ **Component Architecture**
- [ ] **Dependency Injection**: UI components receive dependencies via props
- [ ] **Single Responsibility**: Each component has one clear purpose
- [ ] **Separation of Concerns**: UI logic separate from business logic
- [ ] **Context Usage**: Context only used in smart/coordinator components
- [ ] **Component Hierarchy**: Clear parent-child responsibility boundaries

### 🔄 **Function Design**
- [ ] **Parameter Explicitness**: Functions receive data they need as parameters
- [ ] **Context Independence**: Functions don't assume specific global state
- [ ] **Reusability**: Functions work across different contexts and use cases
- [ ] **Clear Dependencies**: Function dependencies are explicit in signature
- [ ] **No Hidden Coupling**: Functions don't rely on implicit context assumptions

### 🔄 **Data Flow Patterns**
- [ ] **Unidirectional Flow**: Data flows down, events flow up
- [ ] **State Management**: Appropriate level of state management (local vs context vs global)
- [ ] **Side Effects**: Properly contained and managed
- [ ] **Error Boundaries**: Appropriate error handling and recovery

### 🎯 **Domain Modeling**
- [ ] **Interface Design**: Clear, well-defined interfaces
- [ ] **Type Safety**: Comprehensive TypeScript usage
- [ ] **Domain Logic**: Business rules properly encapsulated
- [ ] **Service Layer**: Clean separation between UI and business logic

## Low-Level Code Quality Review

### 🧪 **Testing Strategy**
- [ ] **Test Coverage**: Meets project targets (Business Logic 90%+, UI 80%+)
- [ ] **Test Quality**: Tests validate behavior, not implementation
- [ ] **Mock Usage**: Appropriate mocking of dependencies
- [ ] **Edge Cases**: Error conditions and boundary cases tested

### 🎨 **Code Style & Patterns**
- [ ] **Naming Conventions**: Clear, descriptive naming
- [ ] **Function Size**: Functions focused and reasonably sized
- [ ] **Code Duplication**: Minimal repetition, appropriate abstraction
- [ ] **Import Organization**: Clean, organized imports

### 🔧 **Technical Implementation**
- [ ] **TypeScript Usage**: Proper typing, no `any` types
- [ ] **Performance**: No obvious performance issues
- [ ] **Memory Management**: Proper cleanup and resource management
- [ ] **Error Handling**: Graceful error handling and user feedback

### 🔗 **Coupling & Design Quality**
- [ ] **Function Parameters**: Functions accept explicit parameters rather than assuming context state
- [ ] **Context Usage**: Components don't hard-code specific context values (e.g., always using `currentWeek`)
- [ ] **Component Flexibility**: UI components work with any valid data, not just specific instances
- [ ] **State Dependencies**: Check if component only works in one specific state/mode
- [ ] **Function Naming**: Function names accurately reflect their actual behavior and limitations

### 🌐 **Internationalization & Accessibility**
- [ ] **Translation Keys**: All user text uses `t()` with fallbacks
- [ ] **Language Conventions**: Proper capitalization per language
- [ ] **Accessibility**: AccessibleButton usage, proper ARIA labels
- [ ] **Keyboard Navigation**: All interactive elements accessible

## Review Process

### 📝 **Documentation Requirements**
- Update architectural decisions in relevant documentation
- Document new patterns or deviations from established patterns
- Update component interfaces and usage examples
- Record refactoring decisions and reasoning

### 🔍 **Review Focus Areas**

#### **New Features**
- Architectural consistency with existing patterns
- Appropriate abstraction levels
- Integration with existing systems
- Test coverage and quality

#### **Refactoring**
- Improvement in code organization
- Reduction in coupling and complexity
- Maintenance of existing functionality
- Performance implications

#### **Bug Fixes**
- Root cause analysis
- Prevention of similar issues
- Impact on system stability
- Test coverage for the fixed scenario

### 🎯 **Action Items**

Reviews should produce:
- **Immediate Actions**: Critical issues requiring immediate attention
- **Short-term Improvements**: Enhancements for next iteration
- **Long-term Architectural**: Strategic improvements for future planning
- **Documentation Updates**: Knowledge capture and sharing

## Anti-Patterns to Watch For

### 🚫 **Component Design**
- Direct context usage in pure UI components
- Components making business logic decisions
- Tight coupling between unrelated components
- Large, multi-purpose components

### 🚫 **Data Management**
- Props drilling through multiple levels
- Context overuse for simple state
- Side effects scattered throughout components
- Inconsistent state management patterns

### 🚫 **Code Organization**
- Business logic mixed with UI logic
- Circular dependencies
- Unclear component hierarchies
- Inconsistent file organization

## Success Metrics

- **Reusability**: Components can be easily reused across different contexts
- **Testability**: High test coverage with meaningful tests
- **Maintainability**: Changes require minimal modifications across codebase
- **Performance**: No performance regressions with architectural changes
- **Developer Experience**: Clear patterns that team members can follow consistently

---

Regular code reviews using these guidelines will ensure the Comidas codebase remains maintainable, scalable, and follows best practices for React TypeScript applications.
