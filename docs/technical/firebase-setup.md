# Firebase Setup Guide for AllSquared

This guide covers setting up Firebase Storage and Firestore for the AllSquared file upload system.

---

## 🔥 Firebase vs AWS S3

The AllSquared platform now uses **Firebase Storage** instead of AWS S3 for file uploads. Benefits include:

- ✅ **Simpler Setup** - No IAM user management
- ✅ **Better Integration** - Works seamlessly with Firestore
- ✅ **Free Tier** - 5GB storage, 1GB/day downloads free
- ✅ **Global CDN** - Automatic worldwide content delivery
- ✅ **Security Rules** - Fine-grained access control
- ✅ **Signed URLs** - Time-limited secure download links

---

## 📋 Prerequisites

- Google Account
- Firebase CLI (optional but recommended)
- Node.js 22+

---

## 🚀 Step 1: Create Firebase Project

### 1.1 Via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Project name: `allsquared-production` (or your choice)
4. Disable Google Analytics (or enable if you want analytics)
5. Click "Create project"
6. Wait for setup to complete (30-60 seconds)

### 1.2 Enable Required Services

**Enable Firebase Storage:**
1. In Firebase Console → Build → Storage
2. Click "Get started"
3. **Start in production mode** (we'll use custom security rules)
4. Choose location: `europe-west2 (London)` or closest to your users
5. Click "Done"

**Enable Firestore (optional but recommended):**
1. In Firebase Console → Build → Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose location: Same as Storage
5. Click "Enable"

---

## 🔐 Step 2: Set Up Service Account

### 2.1 Generate Service Account Key

1. Go to Project Settings (⚙️ icon) → Service accounts
2. Click "Generate new private key"
3. **IMPORTANT:** Save this JSON file securely - you can't download it again!
4. The file contains:
   - `project_id`
   - `client_email`
   - `private_key`

### 2.2 Extract Credentials

From the downloaded JSON file, you need three values:

```json
{
  "project_id": "allsquared-production",
  "client_email": "firebase-adminsdk-xxxxx@allsquared-production.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqh...\n-----END PRIVATE KEY-----\n"
}
```

**Storage Bucket Name:**
The bucket name is: `{project_id}.appspot.com`

For example: `allsquared-production.appspot.com`

---

## 🔒 Step 3: Configure Security Rules

### 3.1 Firebase Storage Security Rules

In Firebase Console → Storage → Rules, set:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check authentication
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user is owner
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Profiles folder - authenticated users can upload their own
    match /profiles/{userId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isOwner(userId);
      allow delete: if isAuthenticated() && isOwner(userId);
    }

    // Milestones folder - authenticated users can upload
    match /milestones/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    // Contracts folder
    match /contracts/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    // Disputes folder
    match /disputes/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    // Verification folder
    match /verification/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    // Default - deny all
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**Note:** These rules are permissive for simplicity. The backend enforces stricter access control through the files router.

---

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Development Environment

Create/update `.env` file:

```bash
# Existing variables
VITE_APP_ID=your_app_id
JWT_SECRET=your_jwt_secret
DATABASE_URL=mysql://user:password@host:port/database
OAUTH_SERVER_URL=https://your-oauth-server.com
OWNER_OPEN_ID=your_owner_id
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=allsquared-production
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@allsquared-production.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=allsquared-production.appspot.com
```

**Important Notes:**
- `FIREBASE_PRIVATE_KEY` must include the full key with newlines (`\n`)
- Wrap the private key in quotes
- Don't commit `.env` to git (it's in `.gitignore`)

### 4.2 Production Environment (Vercel)

**Via Vercel CLI:**

```bash
vercel env add FIREBASE_PROJECT_ID production
# Enter: allsquared-production

vercel env add FIREBASE_CLIENT_EMAIL production
# Enter: firebase-adminsdk-xxxxx@allsquared-production.iam.gserviceaccount.com

vercel env add FIREBASE_PRIVATE_KEY production
# Paste the entire private key including -----BEGIN/END----- and \n

vercel env add FIREBASE_STORAGE_BUCKET production
# Enter: allsquared-production.appspot.com
```

**Or via Vercel Dashboard:**
1. Go to Project → Settings → Environment Variables
2. Add each variable for Production, Preview, Development
3. For `FIREBASE_PRIVATE_KEY`, paste the entire key as-is
4. Save and redeploy

---

## 🧪 Step 5: Test Firebase Connection

### 5.1 Install Dependencies

```bash
npm install firebase-admin
```

### 5.2 Start Development Server

```bash
npm run dev
```

### 5.3 Test Configuration

```bash
# Test if Firebase is configured
curl http://localhost:5000/api/trpc/files.isConfigured

# Expected response:
{
  "result": {
    "data": {
      "configured": true
    }
  }
}
```

### 5.4 Test File Upload

1. Navigate to `http://localhost:5000/dashboard`
2. Go to a contract with milestones
3. Click "Submit for Review"
4. Upload a test file
5. Check Firebase Console → Storage to see uploaded file

**Expected folder structure:**
```
/milestones/
  ├── abc123.pdf
  ├── xyz789.jpg
/profiles/
  ├── user123.png
/verification/
  ├── doc456.pdf
```

---

## 📊 Step 6: Monitor Usage

### 6.1 Firebase Console Dashboard

Monitor in Firebase Console → Storage:
- **Storage used** (free: 5GB)
- **Downloads** (free: 1GB/day)
- **Upload operations** (free: 50k/day)
- **Download operations** (free: 50k/day)

### 6.2 Set Up Usage Alerts

1. Go to Project Settings → Usage and billing
2. Set up budget alerts
3. Recommended limits for MVP:
   - Alert at 80% of free tier
   - Hard limit at 100% (to avoid unexpected charges)

### 6.3 Upgrade to Blaze Plan (Pay as you go)

For production, upgrade to Blaze plan:
- Still includes free tier
- Only pay for usage beyond free tier
- Pricing:
  - Storage: $0.026/GB/month
  - Download: $0.12/GB
  - Upload: $0.05/GB

---

## 🔍 Step 7: Verify Everything Works

### 7.1 File Upload Test

✅ **Test in development:**
```bash
# 1. Start server
npm run dev

# 2. Open browser console
# 3. Upload a file to milestone
# 4. Check Firebase Console → Storage
# 5. File should appear in /milestones/ folder
```

### 7.2 File Download Test

✅ **Test signed URL generation:**
1. Upload a file
2. Click download button
3. File should download via signed URL
4. URL should work only for ~60 minutes

### 7.3 Access Control Test

✅ **Test unauthorized access:**
1. Log in as User A, upload file
2. Get file ID from database
3. Try to download as User B (or unauthenticated)
4. Should see permission error

---

## 🐛 Step 8: Troubleshooting

### Issue: "Firebase credentials not configured"

**Solution:**
```bash
# Check environment variables
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_CLIENT_EMAIL
echo $FIREBASE_PRIVATE_KEY
echo $FIREBASE_STORAGE_BUCKET

# Verify they're loaded
npm run dev
# Check server logs for Firebase initialization
```

### Issue: "Error: Could not load the default credentials"

**Cause:** Private key format is incorrect

**Solution:**
- Ensure private key includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Ensure newlines are `\n` not actual newlines
- Wrap in quotes in `.env` file
- Example:
  ```bash
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
  ```

### Issue: "Storage bucket not found"

**Cause:** Bucket name is incorrect

**Solution:**
- Bucket name should be `{project-id}.appspot.com`
- Check in Firebase Console → Storage → Files
- Top of page shows bucket name

### Issue: "Permission denied" on upload

**Cause:** Security rules are too restrictive

**Solution:**
- Check Storage → Rules in Firebase Console
- Verify rules allow authenticated uploads
- Or temporarily set to test mode:
  ```javascript
  allow read, write: if request.auth != null;
  ```

### Issue: "Signed URL expired"

**Cause:** URLs expire after 60 minutes (by default)

**Solution:**
- This is expected behavior
- User can click download again to generate new URL
- Or increase expiry in `server/firebase.ts:96`:
  ```typescript
  export async function getDownloadUrl(filePath: string, expiresIn: number = 120)
  // 120 minutes instead of 60
  ```

---

## 💰 Step 9: Cost Optimization

### 9.1 Free Tier Limits

**Firebase Spark Plan (Free):**
- Storage: 5 GB
- Downloads: 1 GB/day
- Uploads: 50,000/day operations

**Estimated MVP usage:**
- 100 users × 10 files × 2MB = 2GB storage ✅
- 100 downloads/day × 2MB = 200MB/day ✅

### 9.2 Optimize Storage Costs

**Strategies:**
1. **File Size Limits**
   - Current: 50MB max per file
   - Consider: 10MB max for most files
   - Compress images before upload

2. **Lifecycle Management**
   - Delete old files after contracts complete
   - Archive to cheaper storage after 90 days
   - Set up Cloud Functions to auto-delete

3. **CDN Caching**
   - Firebase Storage includes CDN
   - Files cached automatically
   - Reduces download costs

### 9.3 Monitor and Alert

```bash
# Set up Firebase CLI for monitoring
npm install -g firebase-tools
firebase login
firebase use allsquared-production

# Check usage
firebase projects:list
```

---

## 🚀 Step 10: Production Deployment

### 10.1 Pre-Deployment Checklist

- [ ] Firebase project created
- [ ] Storage and Firestore enabled
- [ ] Service account key downloaded
- [ ] Security rules configured
- [ ] Environment variables set in Vercel
- [ ] Dependencies installed (`firebase-admin`)
- [ ] File upload tested locally
- [ ] File download tested locally
- [ ] Access control tested

### 10.2 Deploy to Vercel

```bash
# Deploy
git add .
git commit -m "feat: Migrate from AWS S3 to Firebase Storage"
git push origin main

# Vercel auto-deploys
# Or manually:
vercel --prod
```

### 10.3 Post-Deployment Verification

1. **Test in production:**
   ```bash
   curl https://allsquared.uk/api/trpc/files.isConfigured
   # Should return: {"configured": true}
   ```

2. **Upload test file:**
   - Go to https://allsquared.uk/dashboard
   - Upload file to milestone
   - Check Firebase Console → Storage

3. **Monitor logs:**
   ```bash
   vercel logs allsquared-production
   # Look for Firebase errors
   ```

---

## 📈 Step 11: Scaling Considerations

### When to Upgrade to Blaze Plan

Upgrade when you hit these thresholds:
- **Storage:** Approaching 4GB (80% of 5GB free)
- **Downloads:** Consistently > 800MB/day
- **Users:** 500+ active users
- **Files:** 1000+ files uploaded

### Cost Estimates at Scale

**1,000 users:**
- Storage: ~20GB × $0.026 = $0.52/month
- Downloads: 5GB/day × 30 × $0.12 = $18/month
- **Total:** ~$20/month

**10,000 users:**
- Storage: ~200GB × $0.026 = $5.20/month
- Downloads: 50GB/day × 30 × $0.12 = $180/month
- **Total:** ~$185/month

---

## ✅ Success Criteria

Firebase setup is complete when:
- ✅ Files upload successfully
- ✅ Files download via signed URLs
- ✅ Signed URLs expire after 60 minutes
- ✅ Access control works (users can only delete their files)
- ✅ Files visible in Firebase Console → Storage
- ✅ No errors in production logs
- ✅ Usage within free tier limits

---

## 📞 Additional Resources

### Firebase Documentation
- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
- [Security Rules Guide](https://firebase.google.com/docs/storage/security)
- [Admin SDK Reference](https://firebase.google.com/docs/reference/admin/node)

### Pricing
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Storage Pricing Calculator](https://cloud.google.com/products/calculator)

### Support
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase-storage)

---

**Setup Guide Version:** 1.0
**Last Updated:** December 7, 2025
**Platform:** Firebase Storage + Firestore
