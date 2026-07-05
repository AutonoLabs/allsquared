# Required Vercel Environment Variables

## Critical Variables (Required for App to Work)

These MUST be set in Vercel Project Settings → Environment Variables:

### Authentication & Database
```
VITE_APP_ID=your-manus-app-id
JWT_SECRET=your-jwt-secret-key
DATABASE_URL=mysql://user:password@host:port/database
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://vida.manus.im
OWNER_OPEN_ID=your-owner-open-id
```

### Application Settings
```
VITE_APP_TITLE=AllSquared
VITE_APP_LOGO=/logo.png
NODE_ENV=production
```

### Optional Variables
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
PORT=3000
```

## How to Add Environment Variables in Vercel

1. Go to https://vercel.com/nakamoto-labs/allsquared
2. Click **Settings** tab
3. Click **Environment Variables** in left sidebar
4. For each variable:
   - Enter **Key** (e.g., `VITE_APP_ID`)
   - Enter **Value**
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**

## After Adding Variables

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Troubleshooting

### "Invalid URL" Error
- Check that `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` are set
- These are required for the login system to work

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from Vercel's IP ranges
- Check database credentials are valid

### Authentication Not Working
- Confirm `JWT_SECRET` is set (use a strong random string)
- Verify `OAUTH_SERVER_URL` is `https://api.manus.im`
- Check `OWNER_OPEN_ID` matches your Manus account

## Generate Secure Secrets

For `JWT_SECRET`, use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or:
```bash
openssl rand -hex 32
```

