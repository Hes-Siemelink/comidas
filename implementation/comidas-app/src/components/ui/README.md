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

- **primary**: Blue background (`blue.600`), white text - for main actions (Save, Submit, Add)
- **secondary**: Gray background (`gray.100`), dark text with border - for secondary actions (Cancel, Edit)
- **outline**: Transparent background, blue border and text - for outline style actions (Search, View)
- **ghost**: Transparent background, dark text - for subtle actions (Clear, Remove)
- **navigation**: Blue when active, transparent when inactive - for navigation
- **danger**: Red background (`red.600`), white text - for destructive actions (Delete)

### Accessibility Features

- **WCAG AA compliant contrast ratios** (4.5:1 minimum) for all variants
- **Enhanced disabled states** with proper visual feedback and cursor changes
- **High contrast focus indicators** with 2px blue outline
- **Proper semantic button attributes** for screen readers
- **Keyboard navigation support** with focus management
- **Screen reader compatible** with ARIA labels and descriptions

### Design Principles

- **Consistency**: All buttons use the same base styling system across the application
- **Accessibility**: High contrast ensures readability for all users, including color-blind users
- **Flexibility**: Six distinct variants cover all common use cases
- **Future-proof**: Centralized styling prevents contrast issues from recurring
- **Maintainability**: Single source of truth for button styles reduces design debt

### Breaking Change from Chakra UI

This component **completely replaces** Chakra UI's default Button component to ensure:
- No more `colorScheme` prop usage that caused contrast issues
- Standardized variants that guarantee accessibility compliance  
- Consistent disabled states across all button types
- Centralized maintenance of button accessibility standards

**Always use AccessibleButton instead of Chakra UI's Button** to ensure accessibility compliance throughout the application.