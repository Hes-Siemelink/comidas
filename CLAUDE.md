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