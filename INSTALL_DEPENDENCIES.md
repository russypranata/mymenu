# 📦 Install New Dependencies

This guide lists all new dependencies that need to be installed for the improvements.

## 🔧 Required Dependencies

Run this command to install all required dependencies:

```bash
npm install --save-dev \
  prettier \
  prettier-plugin-tailwindcss \
  @next/bundle-analyzer \
  vitest \
  @vitejs/plugin-react \
  @vitest/ui \
  @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom
```

## 📋 Dependency Breakdown

### Code Formatting
- `prettier` - Code formatter
- `prettier-plugin-tailwindcss` - Tailwind CSS class sorting

### Bundle Analysis
- `@next/bundle-analyzer` - Analyze bundle size

### Testing
- `vitest` - Test framework (Vite-powered)
- `@vitejs/plugin-react` - React plugin for Vitest
- `@vitest/ui` - UI for test results
- `@vitest/coverage-v8` - Code coverage
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM implementation for Node.js

## ✅ Verify Installation

After installation, verify with:

```bash
# Check Prettier
npx prettier --version

# Check Vitest
npx vitest --version

# Run tests
npm run test

# Run format check
npm run format:check
```

## 🚀 Optional: Sentry (Error Monitoring)

To add error monitoring with Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Follow the wizard to:
1. Create/link Sentry project
2. Configure DSN
3. Setup source maps upload

## 📝 New Scripts Available

After installation, you can use:

```bash
npm run format          # Format all files
npm run format:check    # Check formatting
npm run test            # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:ui         # Test UI
npm run type-check      # TypeScript check
npm run analyze         # Bundle analysis
```

## 🔍 GitHub Actions

GitHub Actions will automatically:
- Run lint on every push/PR
- Run type check
- Build the project
- (Future) Run tests when available

No additional setup needed - just push to GitHub!

## 💡 Tips

1. **Pre-commit Hook** (Optional)
   ```bash
   npm install --save-dev husky lint-staged
   npx husky init
   ```

2. **VS Code Extensions** (Recommended)
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

3. **VS Code Settings** (`.vscode/settings.json`)
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

## 🆘 Troubleshooting

### Prettier conflicts with ESLint
Already handled in `.prettierrc` config.

### Tests not running
Make sure `vitest.config.ts` and `vitest.setup.ts` are in root directory.

### Bundle analyzer not working
Run with: `ANALYZE=true npm run build`

### Type errors in tests
Make sure `@testing-library/jest-dom` is imported in `vitest.setup.ts`.

---

Need help? Check the main [README.md](./README.md) or open an issue.
