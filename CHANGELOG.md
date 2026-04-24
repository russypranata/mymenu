# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation (README, CONTRIBUTING, DEPLOYMENT, SECURITY)
- Testing framework (Vitest) with sample tests
- Code formatting (Prettier) with Tailwind CSS plugin
- Pre-commit hooks (Husky + lint-staged)
- CI/CD pipeline (GitHub Actions)
- Bundle analyzer configuration
- VS Code workspace settings
- Environment variable validation
- Error boundary component
- Rate limiting utility
- Deployment guide
- Security policy

### Changed
- Updated package.json with new scripts
- Enhanced error handling in API routes
- Improved code organization

### Security
- Added rate limiting to analytics API
- Implemented error boundary for client-side errors
- Added environment variable validation

## [0.1.0] - 2026-04-24

### Added
- Initial release
- User authentication (Supabase Auth)
- Multi-store management
- Menu CRUD operations
- Category management
- Theme customization
- Multi-location support
- Analytics tracking
- QR code generation
- Admin panel
- Subscription system
- Row Level Security (RLS)
- Middleware for session refresh
- Security headers
- Image optimization
- Responsive design

### Features

#### Owner Features
- Create and manage multiple stores
- Add, edit, delete menu items
- Upload multiple images per menu item
- Organize menus by categories
- Customize store appearance (colors, fonts, logo, banner)
- Manage multiple store locations
- View analytics (page views, WhatsApp clicks)
- Generate QR codes for stores
- Share public menu via link

#### Admin Features
- User management
- Subscription management
- Store oversight
- Platform analytics

#### Security
- Multi-layer authentication
- Role-based access control
- Row Level Security on all tables
- Secure file uploads
- Rate limiting
- Security headers

### Technical Stack
- Next.js 16 (App Router)
- TypeScript (Strict Mode)
- Supabase (PostgreSQL + Auth + Storage)
- Tailwind CSS
- React Hook Form + Zod
- Lucide React Icons

---

## Version History

### Version Numbering

- **Major (X.0.0):** Breaking changes
- **Minor (0.X.0):** New features, backwards compatible
- **Patch (0.0.X):** Bug fixes, backwards compatible

### Release Schedule

- **Patch releases:** As needed for bug fixes
- **Minor releases:** Monthly for new features
- **Major releases:** Annually or for breaking changes

---

## Migration Guides

### Upgrading to 0.2.0 (Future)

TBD

---

## Support

For questions about changes or upgrades:
- Check [README.md](./README.md)
- Open an issue on GitHub
- Email: support@mymenu.id

---

**Note:** This changelog is maintained manually. For detailed commit history, see Git log.
