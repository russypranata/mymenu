# Contributing to MyMenu

Thank you for your interest in contributing to MyMenu! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/mymenu.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit your changes
7. Push to your fork
8. Create a Pull Request

## 📋 Development Setup

See [README.md](./README.md) for detailed setup instructions.

## 🎯 Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

Examples:
- `feature/add-menu-sorting`
- `fix/login-redirect-issue`
- `docs/update-readme`

## 💻 Code Style

### TypeScript
- Use TypeScript strict mode
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Use type aliases for unions/primitives

### React
- Use functional components
- Use Server Components by default
- Use Client Components only when needed (`'use client'`)
- Keep components small and focused
- Extract reusable logic to custom hooks

### Naming Conventions

#### Code Naming (Always English)
- **Files:** kebab-case (`user-profile.tsx`)
- **Components:** PascalCase (`UserProfile`)
- **Functions:** camelCase (`getUserProfile`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces:** PascalCase (`UserProfile`, `ProfileData`)
- **Variables:** camelCase (`userName`, `storeId`)
- **Database:** snake_case (`user_id`, `created_at`)

#### Route Naming Convention
We use a **hybrid approach** for routes:

**Public Marketing Pages (Indonesian URLs for SEO):**
- `/bantuan` - Help/Support page
- `/harga` - Pricing page
- `/privasi` - Privacy policy
- `/syarat` - Terms & conditions

**Application Routes (English URLs):**
- `/login`, `/register`, `/dashboard`
- `/store`, `/menu`, `/profile`, `/admin`
- `/onboarding`, `/suspended`

**Rationale:** Indonesian URLs for public pages improve SEO for our target market (Indonesian UMKM), while English URLs for application routes follow international best practices.

#### Content Language
- **UI Strings:** Indonesian (target market is Indonesian users)
- **Code Comments:** English preferred, Indonesian acceptable
- **Documentation:** English for technical docs, Indonesian for user guides
- **Error Messages:** Indonesian (user-facing)
- **Log Messages:** English (developer-facing)

#### Examples
```typescript
// ✅ Good: English code, Indonesian UI
const handleSubmit = async (values: FormValues) => {
  if (!values.name) {
    setError('name', { message: 'Nama toko tidak boleh kosong.' })
  }
}

// ❌ Bad: Indonesian variable names
const tanganiKirim = async (nilai: NilaiForm) => {
  // Don't do this
}

// ✅ Good: English comments
// Validate store slug availability before submission
const checkSlug = async (slug: string) => { ... }

// ✅ Acceptable: Indonesian comments for complex business logic
// Cek apakah toko sudah expired berdasarkan subscription_end
const isStoreExpired = (store: Store) => { ... }
```

### Code Organization
```
src/
├── app/              # Next.js pages
├── components/       # React components
├── lib/
│   ├── actions/     # Server Actions
│   ├── queries/     # Database queries
│   └── utils/       # Utility functions
└── types/           # TypeScript types
```

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Writing Tests
- Write tests for new features
- Write tests for bug fixes
- Aim for >80% code coverage
- Use descriptive test names

Example:
```typescript
describe('getPasswordStrength', () => {
  it('should return weak for short password', () => {
    const result = getPasswordStrength('abc')
    expect(result.label).toBe('Lemah')
  })
})
```

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```
feat(menu): add sorting by price
fix(auth): resolve login redirect issue
docs(readme): update setup instructions
refactor(store): extract form validation logic
test(profile): add unit tests for profile helpers
```

## 🔍 Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments for new functions
   - Update CHANGELOG if applicable

2. **Run Checks**
   ```bash
   npm run lint        # ESLint
   npm run test        # Tests
   npm run build       # Build check
   ```

3. **PR Description**
   - Describe what changes you made
   - Explain why you made them
   - Link related issues
   - Add screenshots for UI changes

4. **Review Process**
   - Wait for CI checks to pass
   - Address review comments
   - Keep PR focused and small
   - Squash commits if requested

## 🐛 Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (OS, browser, Node version)

## 💡 Feature Requests

When requesting features:
- Describe the feature clearly
- Explain the use case
- Provide examples if possible
- Consider implementation complexity

## 🔒 Security

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Email security@mymenu.id
- Include detailed description
- Wait for response before disclosure

## 📜 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📞 Questions?

- Open a discussion on GitHub
- Email: dev@mymenu.id
- Join our Discord (coming soon)

---

Thank you for contributing to MyMenu! 🎉
