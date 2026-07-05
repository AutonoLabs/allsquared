# Auth Decision — AllSquared

**Decision:** Replace Manus auth with Clerk ✅ **IMPLEMENTED**

## Context
- Manus was the AI that built this codebase
- Manus auth is not a real production auth provider
- Need secure, production-ready auth

## Implementation Complete

### What Changed

**Client-side:**
- Added `@clerk/clerk-react` package
- Created `client/src/lib/clerk.tsx` - ClerkProvider wrapper
- Created `client/src/hooks/useAuth.ts` - Custom hook wrapping Clerk
- Updated `main.tsx` - Wrapped app in ClerkAuthProvider
- Updated `DashboardLayout.tsx` - Uses Clerk's SignIn component
- Updated imports in Home.tsx, AdminLayout.tsx to use new hook
- Removed old Manus OAuth URL generation from `const.ts`

**Server-side:**
- Added `@clerk/express` package  
- Created `server/_core/clerk.ts` - Clerk token verification and user sync
- Updated `server/_core/context.ts` - Uses Clerk auth instead of Manus SDK
- Updated `server/_core/env.ts` - Added Clerk env vars, made Manus vars optional
- Updated `server/routers.ts` - Added `syncClerkUser` mutation
- Added `clerkId` field to users table schema
- Added `getUserByClerkId` function to db.ts

**Schema:**
- `drizzle/schema.ts` - Added `clerkId` varchar column to users table

### Files Modified
```
client/src/lib/clerk.tsx         (new)
client/src/hooks/useAuth.ts      (new)
client/src/types/clerk.d.ts      (new)
client/src/main.tsx              (modified)
client/src/const.ts              (modified)
client/src/components/DashboardLayout.tsx (modified)
client/src/components/AdminLayout.tsx     (modified)
client/src/pages/Home.tsx        (modified)
server/_core/clerk.ts            (new)
server/_core/context.ts          (modified)
server/_core/env.ts              (modified)
server/routers.ts                (modified)
server/db.ts                     (modified)
drizzle/schema.ts                (modified)
.env.example                     (new)
```

### Env vars needed
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx  # Frontend
CLERK_SECRET_KEY=sk_test_xxx            # Backend
```

### Migration Notes
1. Run `npm run db:push` to add `clerkId` column to users table
2. Existing Manus users will need to sign up again with Clerk
3. Old Manus env vars are now optional and can be removed

### Testing
To test locally:
1. Create a Clerk application at https://dashboard.clerk.com
2. Copy publishable key and secret key to `.env`
3. Run `npm run dev`
4. Navigate to /dashboard - should show Clerk sign-in

---

*Approved by Eli: Feb 1, 2026*
*Implemented by Claudia: Feb 1, 2026*
