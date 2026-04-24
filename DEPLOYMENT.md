# 🚀 Deployment Guide

Complete guide for deploying MyMenu to production.

## 📋 Pre-Deployment Checklist

### 1. Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Code formatted (`npm run format:check`)
- [ ] Build successful (`npm run build`)

### 2. Environment Variables
- [ ] All required env vars documented in `.env.example`
- [ ] Production env vars ready
- [ ] Secrets stored securely (not in code)

### 3. Database
- [ ] All migrations applied
- [ ] RLS policies tested
- [ ] Indexes created
- [ ] Backup strategy in place

### 4. Security
- [ ] Auth flows tested
- [ ] Admin access restricted
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] HTTPS enforced

## 🌐 Vercel Deployment (Recommended)

### Step 1: Prepare Repository

```bash
# Ensure code is committed
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository

### Step 3: Configure Project

**Framework Preset:** Next.js

**Root Directory:** `./` (leave default)

**Build Command:** `npm run build`

**Output Directory:** `.next` (auto-detected)

**Install Command:** `npm install`

### Step 4: Environment Variables

Add all variables from `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_ADMIN_WHATSAPP=62895338170582

# Optional
FONNTE_TOKEN=your-token
```

### Step 5: Deploy

Click "Deploy" and wait for build to complete.

### Step 6: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

### Step 7: Verify Deployment

- [ ] Homepage loads
- [ ] Login works
- [ ] Dashboard accessible
- [ ] Public menu pages work
- [ ] Images load correctly
- [ ] Analytics tracking works

## 🔧 Post-Deployment Configuration

### 1. Supabase Settings

#### Update Auth Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://yourdomain.com
```

**Redirect URLs:**
```
https://yourdomain.com/auth/callback
https://yourdomain.com/**
```

#### Update CORS

In Supabase Dashboard → Settings → API:

Add your domain to allowed origins:
```
https://yourdomain.com
```

### 2. Update Environment Variables

If you change domain or Supabase project:

1. Go to Vercel Project Settings → Environment Variables
2. Update `NEXT_PUBLIC_APP_URL`
3. Redeploy

### 3. Enable Vercel Analytics (Optional)

1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. Enable Speed Insights

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production:** Pushes to `main` branch
- **Preview:** Pull requests and other branches

### Branch Strategy

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (preview)
```

### Deployment Workflow

1. Create feature branch
2. Make changes
3. Push to GitHub
4. Vercel creates preview deployment
5. Test preview URL
6. Merge to `develop` for staging
7. Test staging
8. Merge to `main` for production

## 🐛 Troubleshooting

### Build Fails

**Check build logs in Vercel:**
1. Go to Deployments
2. Click failed deployment
3. View build logs

**Common issues:**
- Missing environment variables
- TypeScript errors
- Dependency issues

**Solutions:**
```bash
# Test build locally
npm run build

# Check for errors
npm run lint
npm run type-check
```

### Runtime Errors

**Check function logs:**
1. Go to Deployments → Functions
2. View real-time logs

**Common issues:**
- Database connection errors
- Missing env vars at runtime
- RLS policy blocks

### Images Not Loading

**Check:**
- Image URLs in database
- Supabase storage bucket is public
- CORS configured correctly
- Image domains in `next.config.mjs`

### Slow Performance

**Optimize:**
1. Enable Vercel Analytics
2. Check bundle size: `npm run analyze`
3. Optimize images
4. Add caching headers
5. Use CDN for static assets

## 📊 Monitoring

### Vercel Dashboard

Monitor:
- Deployment status
- Build times
- Function execution
- Bandwidth usage
- Error rates

### Supabase Dashboard

Monitor:
- Database size
- API requests
- Storage usage
- Active connections

### Setup Alerts

1. **Vercel:**
   - Project Settings → Notifications
   - Enable deployment notifications

2. **Supabase:**
   - Project Settings → Integrations
   - Setup webhooks for alerts

## 🔐 Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env.local`
- ✅ Use Vercel environment variables
- ✅ Rotate secrets regularly
- ✅ Use different keys for staging/production

### 2. Database

- ✅ Enable RLS on all tables
- ✅ Regular backups
- ✅ Monitor for suspicious activity
- ✅ Use service role key only server-side

### 3. Authentication

- ✅ Enforce strong passwords
- ✅ Enable email verification
- ✅ Monitor failed login attempts
- ✅ Implement rate limiting

## 📈 Scaling

### Database

**When to scale:**
- Query response time > 100ms
- Connection pool exhausted
- Storage > 80% capacity

**How to scale:**
1. Upgrade Supabase plan
2. Add database indexes
3. Optimize queries
4. Enable connection pooling

### Vercel

**When to scale:**
- Function execution time > 10s
- Bandwidth > plan limit
- Build time > 15 minutes

**How to scale:**
1. Upgrade Vercel plan
2. Optimize bundle size
3. Use ISR for static pages
4. Enable edge functions

## 🔄 Rollback Strategy

### Quick Rollback

1. Go to Vercel Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

## 📝 Maintenance

### Regular Tasks

**Weekly:**
- [ ] Check error logs
- [ ] Review analytics
- [ ] Monitor performance

**Monthly:**
- [ ] Update dependencies
- [ ] Review security alerts
- [ ] Backup database
- [ ] Test disaster recovery

**Quarterly:**
- [ ] Security audit
- [ ] Performance optimization
- [ ] Cost review
- [ ] Capacity planning

## 🆘 Support

**Issues:**
- Check [GitHub Issues](https://github.com/your-repo/issues)
- Review [Vercel Docs](https://vercel.com/docs)
- Check [Supabase Docs](https://supabase.com/docs)

**Emergency:**
- Rollback to last working deployment
- Check status pages:
  - [Vercel Status](https://www.vercel-status.com/)
  - [Supabase Status](https://status.supabase.com/)

---

**Last Updated:** 2026-04-24
