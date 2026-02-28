# AllSquared Deployment Guide - New Features

This guide covers deploying the newly implemented features: Profile Management, User Type Selection, and File Upload System.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- [x] Node.js 22+ installed
- [x] Database access (MySQL/TiDB)
- [x] Firebase account with Storage enabled
- [x] Environment variables configured

---

## 🚀 Step 1: Install Dependencies

```bash
cd /Users/elibernstein/Code/allsquared/allsquared

# Install all dependencies
npm install

# Verify installation
npm list drizzle-orm firebase-admin zod
```

**Expected output:**
- ✅ `drizzle-orm@0.44.5`
- ✅ `firebase-admin@12.0.0`
- ✅ `zod@4.1.12`

---

## 🗄️ Step 2: Database Migration

### 2.1 Review Schema Changes

The following changes will be applied to your database:

**Users Table:**
```sql
ALTER TABLE users ADD COLUMN userType ENUM('provider', 'client', 'both');
ALTER TABLE users ADD COLUMN businessName VARCHAR(255);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN address TEXT;
ALTER TABLE users ADD COLUMN profilePhoto VARCHAR(500);
ALTER TABLE users ADD COLUMN verified ENUM('yes', 'no') DEFAULT 'no' NOT NULL;
ALTER TABLE users ADD COLUMN verificationToken VARCHAR(255);
ALTER TABLE users ADD COLUMN stripeCustomerId VARCHAR(255);
ALTER TABLE users ADD COLUMN stripeConnectedAccountId VARCHAR(255);
```

**Milestones Table:**
```sql
ALTER TABLE milestones ADD COLUMN deliverables TEXT;
ALTER TABLE milestones ADD COLUMN submissionNotes TEXT;
ALTER TABLE milestones ADD COLUMN approvalNotes TEXT;
ALTER TABLE milestones ADD COLUMN submittedAt DATETIME;
```

**Disputes Table:**
```sql
ALTER TABLE disputes ADD COLUMN evidence TEXT;
```

**New FileAttachments Table:**
```sql
CREATE TABLE fileAttachments (
  id VARCHAR(64) PRIMARY KEY,
  entityType ENUM('contract', 'milestone', 'dispute', 'profile', 'verification') NOT NULL,
  entityId VARCHAR(64) NOT NULL,
  uploadedBy VARCHAR(64) NOT NULL,
  fileName VARCHAR(255) NOT NULL,
  fileSize VARCHAR(20) NOT NULL,
  fileType VARCHAR(100),
  fileUrl VARCHAR(500) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Run Migrations

```bash
# Generate migration files
npx drizzle-kit generate

# Review generated SQL files in drizzle/migrations/

# Apply migrations
npm run db:push
```

### 2.3 Verify Database Changes

Connect to your database and verify:

```sql
-- Check users table
DESCRIBE users;

-- Check milestones table
DESCRIBE milestones;

-- Check disputes table
DESCRIBE disputes;

-- Check new fileAttachments table
DESCRIBE fileAttachments;
```

---

## 🔥 Step 3: Firebase Setup

### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Project name: `allsquared-production`
4. Disable Google Analytics (or enable if desired)
5. Click "Create project"

### 3.2 Enable Firebase Storage

1. In Firebase Console → Build → Storage
2. Click "Get started"
3. Start in production mode
4. Choose location: `europe-west2 (London)`
5. Click "Done"

### 3.3 Generate Service Account Key

1. Go to Project Settings (⚙️) → Service accounts
2. Click "Generate new private key"
3. **Save the JSON file securely** - you can't download it again!
4. Extract these values from the JSON:
   - `project_id`
   - `client_email`
   - `private_key`

### 3.4 Configure Security Rules

In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }

    match /milestones/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    match /profiles/{userId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    match /contracts/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    match /disputes/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**For detailed Firebase setup instructions, see [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md)**

---

## 🔐 Step 4: Configure Environment Variables

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

**Important:** Wrap `FIREBASE_PRIVATE_KEY` in quotes and include the full key with `\n` for newlines.

### 4.2 Production Environment (Vercel)

Set environment variables in Vercel dashboard:

```bash
# Vercel CLI method
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
1. Go to your project → Settings → Environment Variables
2. Add each variable for Production, Preview, and Development
3. For `FIREBASE_PRIVATE_KEY`, paste the entire key as-is
4. Redeploy after adding variables

### 4.3 Verify Environment Configuration

```bash
# Start development server
npm run dev

# In browser console or separate terminal:
curl http://localhost:5000/api/trpc/files.isConfigured
```

Expected response:
```json
{
  "result": {
    "data": {
      "configured": true
    }
  }
}
```

---

## ✅ Step 5: Test New Features

### 5.1 Test Profile Update

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:5000/dashboard/profile`
3. Edit your name, business name, phone, or address
4. Click "Save Changes"
5. Verify success toast appears
6. Refresh page - changes should persist

**Expected behavior:**
- ✅ Form fields populate with existing data
- ✅ Changes save successfully
- ✅ Success toast notification appears
- ✅ Data persists after refresh

### 5.2 Test User Type Selection

1. On profile page, find user type badge
2. Click "Change" button
3. Modal opens with 3 options
4. Select "Service Provider", "Client", or "Both"
5. Click "Continue"
6. Badge updates immediately

**Expected behavior:**
- ✅ Modal displays three card options
- ✅ Selected card shows visual highlight
- ✅ Badge updates after selection
- ✅ Modal closes automatically

### 5.3 Test File Upload

**Test in Milestone Submission:**

1. Navigate to a contract with milestones
2. Click "Submit for Review" on a pending milestone
3. In the submission dialog:
   - Drag and drop a file onto the upload zone
   - Or click "Select Files" to browse
4. Upload should show progress bar
5. File should appear in "Uploaded Files" section
6. Add submission notes
7. Click "Submit Milestone"

**Expected behavior:**
- ✅ Drag & drop works
- ✅ Click to browse works
- ✅ Progress indicator shows during upload
- ✅ File appears in list after upload
- ✅ File metadata is correct (name, size, type)
- ✅ Can delete file before submission

### 5.4 Test File Download

1. As a client, view a submitted milestone
2. See "Deliverables" section
3. Click download button on any file
4. File should download in new tab

**Expected behavior:**
- ✅ Pre-signed URL is generated
- ✅ File downloads successfully
- ✅ Original filename is preserved
- ✅ File content is intact

### 5.5 Test Access Control

**Test unauthorized access:**
1. Upload a file as User A
2. Try to download/delete as User B (different user)
3. Should see permission error

**Expected behavior:**
- ✅ Only uploader can delete files
- ✅ Only uploader or admin can download
- ✅ Error messages are clear

---

## 🐛 Step 6: Troubleshooting

### Issue: "Firebase credentials not configured"

**Solution:**
```bash
# Verify environment variables are loaded
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_CLIENT_EMAIL
echo $FIREBASE_PRIVATE_KEY
echo $FIREBASE_STORAGE_BUCKET

# Restart dev server after adding variables
npm run dev
```

### Issue: "Database migration failed"

**Solution:**
```bash
# Check database connection
mysql -h host -u user -p database

# Verify DATABASE_URL is correct
echo $DATABASE_URL

# Try manual migration
npx drizzle-kit push:mysql

# Check for errors in migrations
cat drizzle/migrations/*.sql
```

### Issue: "File upload stuck at 0%"

**Possible causes:**
- Firebase credentials incorrect
- Storage bucket not enabled
- Private key format incorrect
- Network/firewall blocking Google services

**Solution:**
```bash
# Check Firebase Console → Storage
# Verify bucket exists and location is correct

# Check browser console for errors
# Verify Firebase credentials in environment

# Test private key format - should include:
# "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Issue: "Pre-signed URL expired"

**Solution:**
Pre-signed URLs expire after 60 minutes by default. This is expected behavior. Generate a new download URL by clicking download again.

To increase expiry time, edit [server/firebase.ts:104](server/firebase.ts#L104):
```typescript
export async function getDownloadUrl(filePath: string, expiresIn: number = 60)
// Change to 120 for 2 hours, etc.
```

### Issue: "TypeScript errors"

**Solution:**
```bash
# Ensure all dependencies are installed
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript version
npx tsc --version  # Should be 5.9.3
```

### Issue: "Storage bucket not found"

**Solution:**
Bucket name should be `{project-id}.appspot.com`. Check Firebase Console → Storage → Files for the correct bucket name.

**For more troubleshooting, see [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md#-step-8-troubleshooting)**

---

## 📊 Step 7: Monitoring & Validation

### 7.1 Check Database

```sql
-- Verify new columns exist
SELECT userType, businessName, phone, verified
FROM users
LIMIT 5;

-- Check file attachments
SELECT COUNT(*) as file_count
FROM fileAttachments;

-- Check milestone deliverables
SELECT COUNT(*) as milestone_with_files
FROM milestones
WHERE deliverables IS NOT NULL;
```

### 7.2 Check Firebase Storage

In Firebase Console → Storage → Files:
- View uploaded files and folder structure
- Expected folders: `milestones/`, `profiles/`, `contracts/`, `disputes/`, `verification/`
- Check file metadata (size, type, upload date)

Or use Firebase CLI:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and select project
firebase login
firebase use allsquared-production

# List files
firebase storage:list
```

### 7.3 Monitor Application Logs

```bash
# Development
npm run dev

# Watch for errors related to:
# - Firebase uploads
# - Profile updates
# - Database queries
# - File downloads
```

### 7.4 Performance Metrics

Monitor these metrics:
- **File upload time:** Should be < 2s for small files (< 5MB)
- **Pre-signed URL generation:** Should be < 200ms
- **Profile update time:** Should be < 500ms
- **Page load time:** Should remain < 2s

---

## 🚀 Step 8: Production Deployment

### 8.1 Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] Database migrations applied
- [ ] Firebase project created and Storage enabled
- [ ] Firebase service account key generated
- [ ] Environment variables set in Vercel
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] File upload tested end-to-end
- [ ] Profile updates tested
- [ ] User type selection tested

### 8.2 Deploy to Vercel

```bash
# Ensure you're on main branch
git checkout main

# Commit all changes
git add .
git commit -m "feat: Add profile management, user types, and Firebase file upload"

# Push to GitHub
git push origin main

# Vercel will auto-deploy from GitHub
# Or manually deploy:
vercel --prod
```

### 8.3 Post-Deployment Verification

1. **Check deployment status:**
   ```bash
   vercel ls
   ```

2. **Test production endpoints:**
   ```bash
   # Test Firebase configuration
   curl https://allsquared.uk/api/trpc/files.isConfigured

   # Should return: {"configured": true}
   ```

3. **Test in production:**
   - Navigate to https://allsquared.uk/dashboard/profile
   - Update profile information
   - Select user type
   - Upload a test file to a milestone
   - Download the file
   - Verify everything works

### 8.4 Rollback Plan

If issues occur:

```bash
# Revert to previous deployment
vercel rollback

# Or revert database migrations
mysql -h host -u user -p database < backup.sql
```

---

## 📈 Step 9: Usage Monitoring

### Track These Metrics

1. **File Upload Success Rate**
   - Monitor Firebase upload errors in logs
   - Track file upload completion rate

2. **Profile Update Rate**
   - Track how many users complete their profiles
   - Monitor user type selection rate

3. **File Storage Costs**
   - Monitor Firebase Storage usage in Firebase Console
   - Set up budget alerts in Firebase

4. **Performance**
   - Track upload times
   - Monitor pre-signed URL generation time
   - Watch database query performance

### Set Up Alerts

In Firebase Console → Project Settings → Usage and billing:
1. Set up budget alerts
2. Alert at 80% of free tier (4GB storage)
3. Monitor daily download bandwidth (1GB/day free)
4. Track operations (50k/day free)

For detailed monitoring:
```bash
# Firebase CLI
firebase projects:list
firebase use allsquared-production

# Check usage
firebase storage:list
```

---

## 🎯 Success Criteria

Deployment is successful when:

- ✅ Users can update their profiles
- ✅ Users can select and change their user type
- ✅ Files upload to Firebase Storage successfully
- ✅ Files can be downloaded via signed URLs (60-minute expiry)
- ✅ Milestone submissions include file attachments
- ✅ Clients can view and download deliverables
- ✅ No errors in production logs
- ✅ Database schema changes applied
- ✅ All environment variables configured
- ✅ Firebase Storage usage within free tier (5GB, 1GB/day downloads)

---

## 📞 Support & Next Steps

### If You Need Help

- Check logs: `vercel logs`
- Review error messages in browser console
- Verify environment variables: `vercel env ls`
- Check Firebase Console → Storage for uploaded files
- Review Firebase security rules
- Verify database connection
- See [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md) for detailed troubleshooting

### Recommended Next Steps

1. **Implement Email Verification**
   - Add SendGrid/Resend integration
   - Send verification emails on signup
   - Require verification before platform access

2. **Build Onboarding Wizard**
   - 3-step guided setup for new users
   - Profile completion → Type selection → Preferences
   - Skip options for non-critical fields

3. **Add Payment Integration**
   - Stripe Connect for providers
   - Payment intents for client deposits
   - Escrow integration (Riverside/Transpact)

4. **Enhance File Upload**
   - Add profile photo upload
   - Implement document verification flow
   - Add in-browser file preview
   - Implement file compression

---

## 📚 Additional Documentation

- [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md) - Detailed Firebase configuration
- [S3_TO_FIREBASE_MIGRATION.md](S3_TO_FIREBASE_MIGRATION.md) - Migration guide from AWS S3
- [IMPLEMENTATION_TEST_REPORT.md](IMPLEMENTATION_TEST_REPORT.md) - Feature verification report

---

**Deployment Guide Version:** 2.0 (Firebase)
**Last Updated:** December 7, 2025
**Features Covered:** Profile Management, User Type Selection, Firebase File Upload System
**Migration:** AWS S3 → Firebase Storage
