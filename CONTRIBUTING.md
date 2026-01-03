# Contributing to boleto.ts

Thank you for your interest in contributing to boleto.ts! This document provides guidelines and instructions for contributing to this TypeScript library for parsing and rendering Brazilian bank payment slips (boletos bancários).

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Code Contributions](#code-contributions)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Making Changes](#making-changes)
  - [Commit Messages](#commit-messages)
- [Code Style Guidelines](#code-style-guidelines)
  - [TypeScript](#typescript)
  - [Naming Conventions](#naming-conventions)
  - [Code Formatting](#code-formatting)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20 or higher)
- **npm** (comes with Node.js)
- **Git**

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/boleto.ts.git
   cd boleto.ts
   ```

3. **Install dependencies**:

   ```bash
   npm ci
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Verify your setup** by running tests:
   ```bash
   npm test
   ```

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with the following information:

- **Clear title** describing the issue
- **Detailed description** of the problem
- **Steps to reproduce** the bug
- **Expected behavior** vs. **actual behavior**
- **Environment details** (Node.js version, browser, OS)
- **Code sample** or boleto number that demonstrates the issue (if applicable)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:

- **Clear title** describing the feature
- **Detailed description** of the proposed functionality
- **Use case** explaining why this feature would be valuable
- **Implementation ideas** (optional)

### Code Contributions

We accept contributions in the following areas:

- Bug fixes
- New features
- Documentation improvements
- Test coverage improvements
- Performance optimizations
- Code refactoring

## Development Workflow

### Branching Strategy

1. **Create a new branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Use descriptive branch names**:
   - `feature/` for new features
   - `fix/` for bug fixes
   - `docs/` for documentation changes
   - `refactor/` for code refactoring
   - `test/` for test additions or modifications

### Making Changes

1. **Write your code** following the [code style guidelines](#code-style-guidelines)

2. **Add tests** for your changes:

   ```bash
   npm test
   ```

3. **Run linting** to ensure code quality:

   ```bash
   npm run lint
   npm run lint:fix  # Auto-fix issues
   ```

4. **Run type checking**:

   ```bash
   npm run typecheck
   ```

5. **Format your code**:

   ```bash
   npm run format
   ```

6. **Build the project** to ensure everything compiles:
   ```bash
   npm run build
   ```

### Commit Messages

Write clear, concise commit messages following these guidelines:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

**Examples:**

```
Add support for Banco do Brasil boletos

- Implement BB bank identification
- Add BB-specific barcode validation
- Update tests for BB format

Fixes #123
```

## Code Style Guidelines

### TypeScript

This project uses **strict TypeScript** configuration. Follow these guidelines:

- **Use explicit type annotations** for function parameters and return types
- **Prefer `interface`** for object shapes, `type` for unions and intersections
- **Avoid `any`** type; use `unknown` when the type is truly unknown
- **Use `const`** by default, `let` when reassignment is needed
- **Never use `var`**
- **Leverage type inference** where it improves readability

### Naming Conventions

- **Variables, functions, methods**: `camelCase`
- **Classes, interfaces, types, enums**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private properties**: prefix with `#` (ES private fields)
- Use **descriptive, meaningful names**

### Code Formatting

This project uses **Prettier** for code formatting:

- **Semi-colons**: Required
- **Quotes**: Single quotes for strings
- **Tab width**: 2 spaces
- **Line length**: Automatically managed by Prettier

Run `npm run format` to automatically format your code, or `npm run format:check` to verify formatting without making changes.

### Linting

This project uses **ESLint** with TypeScript support:

- Run `npm run lint` to check for issues
- Run `npm run lint:fix` to automatically fix issues where possible

## Testing

### Running Tests

- **Run all tests**: `npm test`
- **Run tests in watch mode**: `npm run test:watch`

### Writing Tests

- Tests are written using **Vitest**
- Test files are co-located with source files: `*.test.ts`
- Follow the existing test patterns in the codebase
- Aim for **high test coverage** of new code
- Test both **happy paths** and **edge cases**

**Example test structure:**

```typescript
import { describe, it, expect } from 'vitest';
import { Boleto } from './boleto.ts';

describe('Boleto', () => {
  it('should parse a valid boleto number', () => {
    const number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
    const boleto = new Boleto(number);
    expect(boleto.number()).toBe(
      '34195000080123320318964221470004584410000002000',
    );
  });
});
```

## Pull Request Process

1. **Ensure all checks pass**:
   - ✅ Tests pass (`npm test`)
   - ✅ Linting passes (`npm run lint`)
   - ✅ Type checking passes (`npm run typecheck`)
   - ✅ Build succeeds (`npm run build`)

2. **Update documentation** if needed:
   - Update README.md for API changes
   - Update USAGE.md for usage examples
   - Add JSDoc comments for new public APIs

3. **Create a pull request**:
   - Use a clear, descriptive title
   - Reference related issues (e.g., "Fixes #123")
   - Provide a detailed description of changes
   - Include screenshots for UI changes (if applicable)
   - List any breaking changes

4. **Respond to feedback**:
   - Address review comments promptly
   - Make requested changes in new commits
   - Don't force-push unless explicitly requested

5. **Wait for approval**:
   - At least one maintainer approval is required
   - All CI checks must pass
   - Maintainers will merge your PR when ready

## Release Process

Releases are handled by project maintainers:

1. Version bumping follows [Semantic Versioning](https://semver.org/)
2. To create a release:
   - Tag the commit with the version number (e.g., `v1.0.0` or `1.0.0`)
   - Create a GitHub release using that tag
   - The tag name should match the version number (with or without `v` prefix)
3. When a release is created on GitHub:
   - The CI workflow automatically runs tests and builds the package
   - The package version is set to match the release tag
   - The package is automatically published to GitHub Packages
4. Release notes are generated from commit messages

### Creating a Release (Maintainers)

```bash
# 1. Ensure you're on the main branch
git checkout main
git pull origin main

# 2. Create and push a tag
git tag v1.0.0
git push origin v1.0.0

# 3. Create a release on GitHub
# Go to: https://github.com/tiarebalbi/boleto.ts/releases/new
# - Select the tag you just pushed
# - Write release notes describing the changes
# - Click "Publish release"

# The package will be automatically published to GitHub Packages
```

---

## Questions?

If you have questions that aren't covered in this guide:

- Check existing [issues](https://github.com/tiarebalbi/boleto.ts/issues)
- Create a new issue with the "question" label
- Reach out to the maintainers

Thank you for contributing to boleto.ts! 🎉
