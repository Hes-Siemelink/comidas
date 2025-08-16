# UI Components

This directory contains reusable UI components that ensure accessibility and consistent design patterns.

## AccessibleButton

A button component that ensures WCAG AA compliance with high contrast ratios and proper focus states.

### Usage

```tsx
import AccessibleButton from './ui/AccessibleButton'

// Primary button (high contrast blue)
<AccessibleButton variant="primary" onClick={handleSubmit}>
  Submit
</AccessibleButton>

// Navigation button with active state
<AccessibleButton 
  variant="navigation" 
  isActive={isCurrentPage}
  onClick={navigate}
>
  Home
</AccessibleButton>

// Secondary button (gray, high contrast)
<AccessibleButton variant="secondary" onClick={handleCancel}>
  Cancel
</AccessibleButton>

// Ghost button (transparent, hover states)
<AccessibleButton variant="ghost" onClick={handleAction}>
  Action
</AccessibleButton>
```

### Variants

- **primary**: Blue background (`blue.600`), white text - for main actions
- **secondary**: Gray background (`gray.100`), dark text - for secondary actions  
- **ghost**: Transparent background, dark text - for subtle actions
- **navigation**: Blue when active, transparent when inactive - for navigation

### Accessibility Features

- WCAG AA compliant contrast ratios (4.5:1 minimum)
- High contrast focus indicators
- Proper semantic button attributes
- Keyboard navigation support
- Screen reader compatible

### Design Principles

- **Consistency**: All buttons use the same base styling system
- **Accessibility**: High contrast ensures readability for all users
- **Flexibility**: Multiple variants for different use cases
- **Future-proof**: Centralized styling prevents contrast issues

Use this component instead of Chakra UI's default Button to ensure accessibility compliance throughout the application.