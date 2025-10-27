import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { contractsRouter } from "./routers/contracts";
import { milestonesRouter } from "./routers/milestones";
import { notificationsRouter } from "./routers/notifications";
import { templatesRouter } from "./routers/templates";

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
  }),

  // Feature routers
  contracts: contractsRouter,
  milestones: milestonesRouter,
  notifications: notificationsRouter,
  templates: templatesRouter,
});

export type AppRouter = typeof appRouter;
