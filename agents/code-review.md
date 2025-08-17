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

### 📋 **Code Review Checklist**

## High-Level Architecture Review

### 🏗️ **Component Architecture**
- [ ] **Dependency Injection**: UI components receive dependencies via props
- [ ] **Single Responsibility**: Each component has one clear purpose
- [ ] **Separation of Concerns**: UI logic separate from business logic
- [ ] **Context Usage**: Context only used in smart/coordinator components
- [ ] **Component Hierarchy**: Clear parent-child responsibility boundaries

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
