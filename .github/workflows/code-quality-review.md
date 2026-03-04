---
description: "Weekly code quality review that analyzes the codebase and reports issues with improvement proposals"
on:
  schedule: weekly
  workflow_dispatch:
permissions:
  contents: read
  issues: read
tools:
  github:
    toolsets: [repos, issues]
safe-outputs:
  create-issue:
    title-prefix: "[code-quality] "
    labels: [code-quality, automated-review]
    max: 3
    expires: 30d
    close-older-issues: true
---

# Weekly Code Quality Review

You are a senior TypeScript developer performing a weekly code quality review for the `boleto.ts` library — a TypeScript library for parsing and rendering Brazilian bank payment slips (boletos bancários).

## What to Analyze

Review the source code in `src/` for the following quality concerns:

### Code Quality

- **Type safety**: Look for uses of `any`, missing type annotations, or weak typing patterns
- **Error handling**: Identify missing or inconsistent error handling
- **Code duplication**: Find duplicated logic that could be extracted into shared utilities
- **Naming conventions**: Check for inconsistent naming (should use camelCase for variables/functions, PascalCase for types/interfaces)
- **Dead code**: Identify unused exports, unreachable code paths, or commented-out code
- **Complexity**: Flag overly complex functions that should be broken down

### Best Practices

- **Immutability**: Check for unnecessary mutations where `const` or readonly patterns could be used
- **Modern TypeScript**: Identify patterns that could benefit from modern TypeScript features
- **Documentation**: Find public APIs or complex logic missing JSDoc documentation
- **Import organization**: Check for proper import grouping and usage of named exports

### Security

- **Input validation**: Verify that user-facing inputs are properly validated
- **Injection risks**: Check for potential injection vulnerabilities in string handling

## How to Report

- Only create an issue if real, actionable problems are found
- For each problem, include the file path, line context, a clear description, and a concrete fix proposal
- Group related issues logically (e.g., all type safety issues together)
- Prioritize findings by impact: critical issues first, then improvements
- If no significant issues are found, do not create an issue
