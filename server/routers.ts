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
import { updateUser } from "./db";
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

  // New integrations
  ai: aiRouter,
  payments: paymentsRouter,
  escrow: escrowRouter,
  signatures: signaturesRouter,
});

export type AppRouter = typeof appRouter;
