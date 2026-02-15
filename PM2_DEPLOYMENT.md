# PM2 Deployment Guide for AllSquared

This guide covers deploying AllSquared on a local server (Mac Mini) using PM2.

## Why PM2?

The Vercel serverless deployment requires proper environment variables to be configured in the Vercel dashboard. For development/staging or if Vercel has issues, the PM2 deployment provides a reliable alternative.

## Prerequisites

- Node.js 20+ installed
- npm (comes with Node.js)
- PM2 installed globally: `npm install -g pm2`
- Database access (PostgreSQL/MySQL)

## Setup Steps

### 1. Clone and Install Dependencies

```bash
cd /Users/claudia/clawd/allsquared-repo
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables

Create a `.env` file with your production settings:

```bash
# Copy from .env.production template
cp .env.production .env

# Edit to remove any VERCEL= lines and update credentials
nano .env
```

**Important**: Remove all lines starting with `VERCEL` from your `.env` file, otherwise the server won't start listening.

Required variables:
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
PORT=3300
```

### 3. Build the Application

```bash
npm run build
```

This creates:
- `dist/public/` - Static frontend assets
- `dist/index.js` - Backend server

### 4. Start with PM2

```bash
pm2 start ecosystem.config.cjs
```

### 5. View Logs

```bash
pm2 logs allsquared
```

### 6. Save PM2 Configuration

```bash
pm2 save
pm2 startup  # Follow instructions to enable auto-start on reboot
```

## Management Commands

| Command | Description |
|---------|-------------|
| `pm2 start allsquared` | Start the app |
| `pm2 stop allsquared` | Stop the app |
| `pm2 restart allsquared` | Restart the app |
| `pm2 logs allsquared` | View logs |
| `pm2 monit` | Monitor all processes |
| `pm2 list` | List all processes |

## Updating the Application

```bash
cd /Users/claudia/clawd/allsquared-repo
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart allsquared
```

## Port Configuration

By default, the server runs on port **3300**.

To change the port:
1. Edit `ecosystem.config.cjs` and change the `PORT` in `env`
2. Or set `PORT=XXXX` in your `.env` file

## Reverse Proxy (Optional)

If you need to expose the app on port 80/443, use a reverse proxy like Caddy or Nginx:

**Caddy example:**
```
allsquared.local {
    reverse_proxy localhost:3300
}
```

## Troubleshooting

### Server not listening
- Check that `.env` does NOT have `VERCEL=1`
- Verify logs: `pm2 logs allsquared --err`

### Database connection errors
- Verify `DATABASE_URL` is correct
- Ensure database is accessible

### Build failures
- Run `npm install --legacy-peer-deps` to fix dependency issues
- Check Node.js version: should be 20+

## Current Status

- **Server URL**: http://localhost:3300
- **PM2 Process**: `allsquared`
- **Config**: `/Users/claudia/clawd/allsquared-repo/ecosystem.config.cjs`
- **Logs**: `/Users/claudia/clawd/allsquared-repo/logs/`

---

Last updated: February 2026
