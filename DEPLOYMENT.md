# AllSquared Deployment Guide

This guide covers deploying AllSquared to production on Vercel.

## Prerequisites

- Vercel account
- GitHub repository access
- Production database (TiDB Cloud or PlanetScale recommended)
- Domain names configured (allsquared.uk)

## Step 1: Database Setup

### Option A: TiDB Cloud (Recommended)

1. Go to [TiDB Cloud](https://tidbcloud.com)
2. Create a new cluster (Serverless tier for MVP)
3. Note the connection string
4. Format: `mysql://username:password@host:port/database?ssl={"rejectUnauthorized":true}`

### Option B: PlanetScale

1. Go to [PlanetScale](https://planetscale.com)
2. Create a new database
3. Create a production branch
4. Get connection string from "Connect" tab
5. Format: `mysql://username:password@host/database?ssl={"rejectUnauthorized":true}`

## Step 2: Vercel Deployment

### 2.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import `Nakamoto-Labs/allsquared` from GitHub
4. Select the repository

### 2.2 Configure Build Settings

```
Framework Preset: Vite
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
Root Directory: ./
Node.js Version: 22.x
```

### 2.3 Environment Variables

Add the following environment variables in Vercel dashboard:

#### Required Variables

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}

# Authentication
JWT_SECRET=<generate-random-32-char-string>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://vida.manus.im
OWNER_OPEN_ID=<your-manus-open-id>
OWNER_NAME=<your-name>

# Application
VITE_APP_ID=<your-manus-app-id>
VITE_APP_TITLE=AllSquared
VITE_APP_LOGO=/logo.png

# Built-in APIs
BUILT_IN_FORGE_API_KEY=<provided-by-manus>
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

#### Optional Variables (for analytics)

```env
VITE_ANALYTICS_ENDPOINT=<your-analytics-endpoint>
VITE_ANALYTICS_WEBSITE_ID=<your-website-id>
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Vercel will provide a deployment URL

## Step 3: Database Migration

After first deployment, push the database schema:

```bash
# Clone the repository locally
git clone https://github.com/Nakamoto-Labs/allsquared.git
cd allsquared

# Install dependencies
pnpm install

# Set DATABASE_URL in .env
echo "DATABASE_URL=<your-production-database-url>" > .env

# Push schema to production database
pnpm db:push
```

## Step 4: Custom Domain Setup

### 4.1 Add Domains in Vercel

1. Go to Project Settings → Domains
2. Add domains:
   - `www.allsquared.uk` (marketing website)
   - `app.allsquared.uk` (application dashboard)
   - `allsquared.uk` (redirect to www)

### 4.2 Configure DNS

Add the following DNS records in your domain registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### 4.3 SSL Certificates

Vercel automatically provisions SSL certificates. Wait 24-48 hours for DNS propagation.

## Step 5: Post-Deployment Checks

### 5.1 Verify Deployment

- [ ] Marketing website loads at `https://www.allsquared.uk`
- [ ] Dashboard loads at `https://app.allsquared.uk`
- [ ] Authentication works (sign in/sign up)
- [ ] Database connection works
- [ ] All pages load without errors

### 5.2 Test Core Features

- [ ] Create a contract
- [ ] Sign a contract
- [ ] Create milestones
- [ ] Submit milestone
- [ ] Approve/reject milestone
- [ ] Create template
- [ ] Notifications appear
- [ ] Profile updates save

### 5.3 Performance Checks

- [ ] Lighthouse score > 90
- [ ] Time to Interactive < 3s
- [ ] No console errors
- [ ] Mobile responsive

## Step 6: Monitoring & Analytics

### 6.1 Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor:
   - Page views
   - User sessions
   - Performance metrics
   - Error rates

### 6.2 Error Tracking (Optional)

Consider adding Sentry for error tracking:

```bash
pnpm add @sentry/react @sentry/trpc
```

Configure in `client/src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

## Step 7: Continuous Deployment

Vercel automatically deploys on git push to main branch:

1. Make changes locally
2. Commit and push to GitHub
3. Vercel builds and deploys automatically
4. Check deployment status in Vercel dashboard

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure Node.js version is 22.x
- Check for TypeScript errors locally: `pnpm tsc`

### Database Connection Errors

- Verify DATABASE_URL format
- Check database is accessible from Vercel IPs
- Ensure SSL is enabled: `?ssl={"rejectUnauthorized":true}`
- Test connection locally first

### Authentication Issues

- Verify VITE_APP_ID matches Manus app
- Check OAUTH_SERVER_URL is correct
- Ensure JWT_SECRET is set and secure
- Verify OWNER_OPEN_ID is correct

### Performance Issues

- Enable Vercel Edge Network
- Optimize images (use WebP format)
- Enable caching headers
- Consider Vercel Edge Functions for API routes

## Rollback

If deployment has issues:

1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous working deployment
4. Click "..." → "Promote to Production"

## Security Checklist

- [ ] All environment variables are secure
- [ ] JWT_SECRET is random and strong (32+ characters)
- [ ] Database uses SSL connection
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation on all forms
- [ ] SQL injection protection (Drizzle ORM handles this)
- [ ] XSS protection (React handles this)

## Production Optimization

### Caching

Add caching headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Compression

Vercel automatically enables gzip/brotli compression.

### CDN

Vercel Edge Network provides global CDN automatically.

## Support

For deployment issues:
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/Nakamoto-Labs/allsquared/issues
- Email: dev@allsquared.uk

---

**Last Updated**: 2025-01-28

