import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { contractsRouter } from "./routers/contracts";
import { milestonesRouter } from "./routers/milestones";
import { notificationsRouter } from "./routers/notifications";
import { templatesRouter } from "./routers/templates";
import { filesRouter } from "./routers/files";
import { aiRouter } from "./routers/ai";
import { paymentsRouter } from "./routers/payments";
import { escrowRouter } from "./routers/escrow";
import { signaturesRouter } from "./routers/signatures";
import { adminRouter } from "./routers/admin";
import { contactsRouter } from "./routers/contacts";
import { updateUser, getUserByClerkId, upsertUser, getUser } from "./db";
import { sendWelcomeEmail } from "./email";
import { z } from "zod";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    // Sync Clerk user to our database
    syncClerkUser: publicProcedure
      .input(
        z.object({
          clerkId: z.string().min(1),
          email: z.string().nullable(),
          name: z.string().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        const { clerkId, email, name } = input;
        
        // Check if user already exists
        let user = await getUserByClerkId(clerkId);
        
        if (user) {
          // Update existing user
          await upsertUser({
            id: user.id,
            email,
            name,
            lastSignedIn: new Date(),
          });
          return await getUser(user.id);
        }

        // Create new user - superadmin for owner email, else regular user
        const userId = `clerk_${nanoid(16)}`;
        const SUPERADMIN_EMAIL = 'eli@autonolabs.io';
        const isAdmin = email?.toLowerCase() === SUPERADMIN_EMAIL;

        await upsertUser({
          id: userId,
          clerkId,
          email,
          name,
          loginMethod: 'clerk',
          role: isAdmin ? 'admin' : 'user',
          lastSignedIn: new Date(),
        });

        // Send welcome email to new users
        if (email) {
          sendWelcomeEmail(email, { name: name || 'there' })
            .catch(err => console.error('[Email] sendWelcome failed:', err));
        }

        return await getUser(userId);
      }),
    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          businessName: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          userType: z.enum(["provider", "client", "both"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
          throw new Error("User not authenticated");
        }
        const updatedUser = await updateUser(ctx.user.id, input);
        return updatedUser;
      }),
  }),

  // Feature routers
  contracts: contractsRouter,
  milestones: milestonesRouter,
  notifications: notificationsRouter,
  templates: templatesRouter,
  files: filesRouter,
  contacts: contactsRouter,

  // New integrations
  ai: aiRouter,
  payments: paymentsRouter,
  escrow: escrowRouter,
  signatures: signaturesRouter,

  // Admin portal
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
