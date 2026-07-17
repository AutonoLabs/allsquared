import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
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
import { disputesRouter } from "./routers/disputes";
import { templateBuilderRouter } from "./routers/templateBuilder";
import { companiesHouseRouter } from "./routers/companiesHouse";
import { partyProfilesRouter } from "./routers/partyProfiles";
import { kycRouter } from "./routers/kyc";
import { waitlistRouter } from "./routers/waitlist";
import { updateUser, upsertUser, getUser } from "./db";
import { z } from "zod";

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
    syncClerkUser: protectedProcedure
      .input(
        z.object({
          clerkId: z.string().min(1),
          email: z.string().nullable(),
          name: z.string().nullable(),
          emailVerified: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.clerkId && ctx.user.clerkId !== input.clerkId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Authenticated Clerk user does not match the requested user",
          });
        }

        const updates: Record<string, unknown> = {
          id: ctx.user.id,
          clerkId: ctx.user.clerkId ?? input.clerkId,
          email: input.email,
          name: input.name,
          lastSignedIn: new Date(),
        };

        if (input.emailVerified) {
          updates.verified = 'yes';
        }

        await upsertUser(updates as any);

        const user = await getUser(ctx.user.id);
        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to load synced user",
          });
        }

        return user;
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

  waitlist: waitlistRouter,

  // Feature routers
  contracts: contractsRouter,
  milestones: milestonesRouter,
  notifications: notificationsRouter,
  templates: templatesRouter,
  files: filesRouter,

  // New integrations
  ai: aiRouter,
  payments: paymentsRouter,
  escrow: escrowRouter,
  signatures: signaturesRouter,

  // Dispute resolution
  disputes: disputesRouter,
  companiesHouse: companiesHouseRouter,
  partyProfiles: partyProfilesRouter,

  // Admin portal
  admin: adminRouter,

  // Contract template builder
  templateBuilder: templateBuilderRouter,

  kyc: kycRouter,
});

export type AppRouter = typeof appRouter;
