# Contributing to AstralCore Hyperdrive 🚀

Thank you for your interest in contributing to AstralCore Hyperdrive! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- 🐛 **Bug Reports** - Report bugs and issues
- ✨ **Feature Requests** - Suggest new features
- 📝 **Documentation** - Improve documentation
- 🛠️ **Code Contributions** - Submit bug fixes and new features
- 🎨 **Design** - Improve UI/UX design
- 🧪 **Testing** - Write and improve tests
- 🔍 **Code Reviews** - Review pull requests

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/hyperdrive.git
   cd hyperdrive
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/astralcore/hyperdrive.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Write tests for new features
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Wait for review and address feedback

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use strict mode configuration

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
}

// ❌ Bad
const user: any = { ... };
```

### React Components

- Use functional components with hooks
- Follow the single responsibility principle
- Use proper prop types
- Include JSDoc comments for complex components

```tsx
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Reusable button component with multiple variants
 */
export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled 
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }))}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### File Naming

- Use kebab-case for files and directories
- Use PascalCase for React components
- Use camelCase for functions and variables

```
✅ Good:
- src/components/ui/button.tsx
- src/lib/auth-utils.ts
- src/hooks/use-trading-data.ts

❌ Bad:
- src/components/UI/Button.tsx
- src/lib/authUtils.ts
- src/hooks/useTradingData.ts
```

### Import Organization

```typescript
// 1. React and Next.js imports
import React from 'react';
import { NextRequest } from 'next/server';

// 2. Third-party libraries
import { clsx } from 'clsx';
import { z } from 'zod';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 4. Relative imports
import './styles.css';
```

### CSS and Styling

- Use Tailwind CSS utility classes
- Create custom components in `src/components/ui/`
- Follow the existing design system
- Use CSS variables for theming

```tsx
// ✅ Good
<div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
  <h2 className="text-lg font-semibold text-foreground">Title</h2>
  <Button variant="outline">Action</Button>
</div>
```

## 🧪 Testing Guidelines

### Testing Strategy

- Write unit tests for utility functions
- Write integration tests for API routes
- Write component tests for complex UI components
- Write E2E tests for critical user flows

### Test Structure

```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from '@jest/globals';
import { formatCurrency } from '../utils';

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should handle zero values', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📋 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Examples

```bash
feat: add user authentication system
fix: resolve memory leak in trading bot
docs: update deployment guide
style: format code with prettier
refactor: extract utility functions
perf: optimize chart rendering
test: add unit tests for auth service
build: update dependencies
ci: add automated testing workflow
chore: update gitignore
```

## 🔍 Pull Request Guidelines

### Before Submitting

- [ ] Tests are passing
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] PR description is clear and complete

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots or videos

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs
2. **Code Review** - Team members review code
3. **Testing** - QA testing if needed
4. **Approval** - Maintainer approval required
5. **Merge** - Squash and merge to main

## 🐛 Bug Reports

### Before Reporting

- Check existing issues
- Search closed issues
- Try to reproduce the bug
- Gather relevant information

### Bug Report Template

```markdown
## Bug Description
A clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. iOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]
- Node.js version: [e.g. 18.17.0]

## Additional Context
Add any other context about the problem
```

## ✨ Feature Requests

### Feature Request Template

```markdown
## Feature Description
A clear description of the feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Any alternative solutions considered

## Additional Context
Add any other context or screenshots
```

## 🎨 Design Guidelines

### Design System

- Follow existing color palette
- Use consistent spacing (4px, 8px, 16px, 24px, 32px)
- Maintain consistent typography
- Follow accessibility guidelines (WCAG 2.1 AA)

### UI Components

- Create reusable components
- Support dark/light themes
- Include loading and error states
- Add proper ARIA labels

## 📚 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Keep documentation up to date
- Add JSDoc comments for functions

### Documentation Structure

```typescript
/**
 * Calculates the trading fee for a given amount
 * 
 * @param amount - The trading amount in USD
 * @param feeRate - The fee rate as a decimal (0.001 = 0.1%)
 * @returns The calculated fee amount
 * 
 * @example
 * ```typescript
 * const fee = calculateTradingFee(1000, 0.001);
 * console.log(fee); // 1
 * ```
 */
export function calculateTradingFee(amount: number, feeRate: number): number {
  return amount * feeRate;
}
```

## 🏷️ Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **Major** (X.0.0) - Breaking changes
- **Minor** (x.Y.0) - New features (backward compatible)
- **Patch** (x.y.Z) - Bug fixes (backward compatible)

### Release Workflow

1. **Feature Freeze** - Stop adding new features
2. **Testing** - Comprehensive testing phase
3. **Documentation** - Update all documentation
4. **Release Candidate** - Create RC for testing
5. **Final Release** - Tag and deploy to production

## 🤝 Community

### Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

### Getting Help

- 💬 [Discord Community](https://discord.gg/astralcore)
- 📧 [Email Support](mailto:dev@astralcore.io)
- 🐛 [GitHub Issues](https://github.com/astralcore/hyperdrive/issues)
- 📖 [Documentation](https://docs.astralcore.io)

### Recognition

Contributors will be recognized in:
- Contributors section in README
- Release notes
- Community highlights
- Annual contributor awards

## 📄 License

By contributing to AstralCore Hyperdrive, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AstralCore Hyperdrive! 🚀
