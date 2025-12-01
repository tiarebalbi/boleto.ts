# GitHub Copilot Instructions

This is a TypeScript library built with Vite. Follow these guidelines when contributing to this project.

## Project Overview

- **Language**: TypeScript
- **Build Tool**: rolldown-vite (Vite-compatible build tool)
- **Module System**: ESM (ES Modules)
- **Target**: ES2022

## Code Style Guidelines

### TypeScript

- Use strict TypeScript configuration (`"strict": true`)
- Prefer explicit type annotations for function parameters and return types
- Use `interface` for object shapes, `type` for unions and intersections
- Avoid `any` type; use `unknown` when type is truly unknown
- Use `const` by default, `let` when reassignment is needed
- Never use `var`

### Naming Conventions

- Use `camelCase` for variables, functions, and methods
- Use `PascalCase` for classes, interfaces, types, and enums
- Use `UPPER_SNAKE_CASE` for constants
- Prefix interfaces with descriptive names (not `I` prefix)
- Use descriptive, meaningful names

### Functions

- Prefer arrow functions for callbacks and short functions
- Use regular function declarations for top-level functions
- Keep functions small and focused on a single responsibility
- Document complex functions with JSDoc comments

### Imports

- Use ES module imports (`import`/`export`)
- Group imports: external dependencies first, then internal modules
- Use named exports over default exports when possible
- Include `.ts` file extensions in relative imports (enabled via `allowImportingTsExtensions`)

## File Structure

```
src/
├── main.ts          # Application entry point
├── *.ts             # TypeScript modules
├── *.css            # Stylesheets
└── *.svg            # Static assets
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compiler + Vite build)
- `npm run preview` - Preview production build

## Best Practices

1. **Type Safety**: Always leverage TypeScript's type system
2. **Immutability**: Prefer immutable data structures when possible
3. **Error Handling**: Use proper error handling with typed errors
4. **Documentation**: Add JSDoc comments for public APIs
5. **Testing**: Write unit tests for business logic
6. **Performance**: Be mindful of bundle size and runtime performance

## DOM Manipulation

- Use typed query selectors: `document.querySelector<HTMLElement>()`
- Handle null cases when querying DOM elements
- Prefer event delegation for multiple similar elements

## Vite-Specific

- Static assets in `public/` are served at root path
- Use `import` for assets that need processing (images, SVGs in `src/`)
- Environment variables must be prefixed with `VITE_`
