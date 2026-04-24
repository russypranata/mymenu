# 🔒 Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. **DO NOT** Open a Public Issue

Security vulnerabilities should not be disclosed publicly until a fix is available.

### 2. Report Privately

**Email:** security@mymenu.id

**Include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### 3. Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity
  - Critical: 1-3 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### 4. Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide regular updates on our progress
- We will notify you when the vulnerability is fixed
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Measures

### Authentication & Authorization

- ✅ Supabase Auth with email verification
- ✅ Row Level Security (RLS) on all tables
- ✅ Multi-layer auth checks (Middleware + Layout + Server Actions)
- ✅ Role-based access control (User vs Admin)
- ✅ Session management with automatic refresh
- ✅ Secure password requirements (min 8 characters)

### Data Protection

- ✅ HTTPS enforced in production
- ✅ Encrypted data at rest (Supabase)
- ✅ Encrypted data in transit (TLS 1.3)
- ✅ Secure cookie handling (HttpOnly, Secure, SameSite)
- ✅ No sensitive data in client-side code
- ✅ Service role key only used server-side

### API Security

- ✅ Rate limiting on API routes
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Supabase parameterized queries)
- ✅ XSS prevention (React auto-escaping)
- ✅ CSRF protection (SameSite cookies)

### Infrastructure

- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Dependency scanning (GitHub Dependabot)
- ✅ Regular security updates
- ✅ Isolated storage buckets
- ✅ Folder-based access control

### Monitoring

- ✅ Error logging (structured logs)
- ✅ Failed login attempt tracking
- ✅ Suspicious activity detection
- ✅ Regular security audits

## Known Security Considerations

### 1. Rate Limiting

Current implementation uses in-memory rate limiting, which resets on server restart. For production at scale, consider:
- Redis-based rate limiting
- Upstash Rate Limit
- Cloudflare Rate Limiting

### 2. File Uploads

- Max file size: 2MB (avatars), 2MB (menu images)
- Allowed types: JPEG, PNG, WebP
- Files stored in Supabase Storage with public read access
- Consider adding virus scanning for production

### 3. Analytics

- IP addresses stored for rate limiting
- Consider GDPR compliance for EU users
- Implement data retention policy

## Security Best Practices for Users

### For Owners

- ✅ Use strong, unique passwords
- ✅ Enable email verification
- ✅ Don't share account credentials
- ✅ Regularly review store access
- ✅ Report suspicious activity

### For Admins

- ✅ Use strong, unique passwords
- ✅ Enable 2FA (when available)
- ✅ Limit admin access to trusted users
- ✅ Regularly audit user accounts
- ✅ Monitor subscription changes

## Compliance

### Data Privacy

- User data stored in Supabase (ISO 27001 certified)
- Data residency: Configurable per Supabase region
- Data retention: Configurable
- Right to deletion: Implemented (delete account feature)

### GDPR Considerations

If serving EU users:
- [ ] Add cookie consent banner
- [ ] Update privacy policy
- [ ] Implement data export feature
- [ ] Add data processing agreement
- [ ] Appoint DPO if required

## Security Checklist for Deployment

### Pre-Production

- [ ] All dependencies updated
- [ ] Security audit completed
- [ ] Penetration testing done
- [ ] Environment variables secured
- [ ] Secrets rotated
- [ ] Backup strategy tested

### Production

- [ ] HTTPS enforced
- [ ] Security headers enabled
- [ ] Rate limiting active
- [ ] Error monitoring configured
- [ ] Logging enabled
- [ ] Alerts configured

### Post-Production

- [ ] Monitor error logs daily
- [ ] Review access logs weekly
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Penetration test annually

## Vulnerability Disclosure Timeline

1. **Day 0:** Vulnerability reported
2. **Day 1-2:** Initial assessment and acknowledgment
3. **Day 3-7:** Investigation and fix development
4. **Day 7-14:** Testing and validation
5. **Day 14-21:** Deployment to production
6. **Day 21+:** Public disclosure (if appropriate)

## Security Updates

Security updates will be released as:
- **Critical:** Immediate patch release
- **High:** Within 1 week
- **Medium:** Next minor release
- **Low:** Next major release

## Contact

**Security Team:** security@mymenu.id

**PGP Key:** Available upon request

**Response Time:** 48 hours

---

**Last Updated:** 2026-04-24

Thank you for helping keep MyMenu secure! 🔒
