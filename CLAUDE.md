# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is an agent-driven development project for a Family Recipe App with the following structure:

- `implementation/family-recipe-app/` - Main React application code
- `spec/` - Product specifications and requirements  
- `agents/` - Agent role definitions for development workflow
- `backlog/` - Kanban-style project management (todo/doing/done)

## Development Commands

All development work happens in `implementation/family-recipe-app/`:

```bash
cd implementation/family-recipe-app

# Development
npm run dev          # Start development server
npm run build        # Build for production (runs TypeScript check first)
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once and exit
```

## Technology Stack

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **UI Library**: Chakra UI v3 with Emotion
- **Routing**: React Router DOM v7
- **Testing**: Vitest with React Testing Library and jsdom
- **Internationalization**: i18next with react-i18next
- **Animation**: Framer Motion

## Architecture Notes

- The app is designed for rapid prototyping with future expansion planned
- Current phase uses local storage/IndexedDB for single-user experience
- Future backend integration (Node.js/Express or Firebase) is planned for multi-user features
- Vitest is chosen over Jest for better Vite/ESM integration
- All development commands must be run from the `implementation/family-recipe-app/` directory

## Test Configuration

Tests run in jsdom environment with global test functions enabled. Setup file is at `src/setupTests.ts`.

## Common Pitfalls and Solutions

### React Router + Chakra UI Integration

**Problem**: TypeScript errors when combining Chakra UI's `as` prop with React Router's Link component:
```typescript
// ❌ This causes TypeScript errors
<Button as={Link} to="/path">Navigate</Button>
```

**Solutions**:
1. **Use useNavigate hook** (Recommended):
```typescript
const navigate = useNavigate()
<Button onClick={() => navigate('/path')}>Navigate</Button>
```

2. **Wrap with Link component**:
```typescript
<Link as={RouterLink} to="/path">
  <Button>Navigate</Button>
</Link>
```

### Router Testing Issues

**Problem**: "You cannot render a <Router> inside another <Router>" error in tests.

**Solution**: Separate routing logic from App component:
- Create `AppRoutes.tsx` for route definitions
- Keep `App.tsx` as router wrapper only
- Test `AppRoutes` component with `MemoryRouter` wrapper

**Example Test Setup**:
```typescript
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </ChakraProvider>
)

// Test AppRoutes, not App
render(<AppRoutes />, { wrapper: TestWrapper })
```

### TypeScript Package Dependencies

**Required packages for routing**:
```bash
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

### Component Architecture Best Practices

1. **Separate concerns**: Keep router wrapper, route definitions, and UI components separate
2. **Extract reusable components**: Language switcher, navigation, etc.
3. **Use consistent naming**: `*Page.tsx` for route components
4. **Update tests**: Always update tests when changing component structure
5. **Run build frequently**: Use `npm run build` to catch TypeScript errors early

### i18n Integration with Routing

- Add translation keys for all new routes and navigation
- Maintain consistent key structure: `nav.*`, `routes.*`, `app.*`
- Test language switching on all routes
- Use fallback text in translation calls: `t('key', 'Fallback text')`