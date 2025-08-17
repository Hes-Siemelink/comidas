# Standardize Week Status Transition Logic

## Description

Consolidate and simplify week status transition logic to eliminate inconsistencies between automatic and manual completion flows, and reduce complex state management patterns.

## Acceptance Criteria

### 📋 **Unified Completion Logic**

- [ ] **Single completion function**: Consolidate automatic and manual completion into one consistent flow
- [ ] **Predictable state transitions**: `current → completed → archived` with clear rules
- [ ] **Immediate planned promotion**: When current completes, planned becomes current atomically
- [ ] **Consistent ceremony triggering**: Same ceremony flow regardless of completion method

### 📋 **State Management Cleanup**

- [ ] **Remove temporary statuses**: Eliminate `status: 'completed'` appearing in UI contexts
- [ ] **Atomic state updates**: Week transitions happen as single operations, not multi-step
- [ ] **Clear week ownership**: `currentWeek` always represents actual current week (never completed)
- [ ] **History management**: Completed weeks immediately move to history

### 📋 **Business Logic Consolidation**

- [ ] **Week promotion rules**: Extract to single function handling planned→current logic
- [ ] **Ceremony state management**: Centralize show/dismiss ceremony logic
- [ ] **Error handling**: Consistent error patterns across all transition functions
- [ ] **Validation rules**: Clear preconditions for each state transition

### 📋 **Testing & Validation**

- [ ] **State transition tests**: Cover all valid and invalid transition paths
- [ ] **Completion flow tests**: Verify automatic and manual flows produce identical results
- [ ] **Edge case handling**: Empty weeks, missing planned weeks, concurrent operations

## Technical Focus

**Current Issues:**
- Automatic completion: `toggleMealComplete` → complex completion logic
- Manual completion: `completeWeek` → different completion logic  
- Ceremony handling: Multiple paths to show/dismiss ceremony
- State inconsistency: Temporary 'completed' status in currentWeek

**Target Architecture:**
- Single `handleWeekCompletion()` function used by both flows
- Predictable state machine: current → [planned becomes current] → ceremony
- No intermediate states visible to UI components

## Priority

🔥 **Critical** - Core business logic must be consistent and predictable
