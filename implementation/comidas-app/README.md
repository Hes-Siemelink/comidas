# Comidas

A web application for recording recipes, planning family meals, and providing cooking assistance.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Tech Stack

- React 18
- TypeScript
- Vite
- Future: Chakra UI, i18next

## Project Structure

- `src/` - Source code
- `public/` - Static assets
- `dist/` - Built application

## Development

The app is configured for rapid development with hot reloading and TypeScript support.


  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
