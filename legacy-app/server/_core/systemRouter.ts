import { z } from "zod";
import { publicProcedure, router } from "./trpc";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  // Service health check — minimal in production to avoid leaking integration config
  serviceHealth: publicProcedure.query(() => {
    if (process.env.NODE_ENV === 'production') {
      return { ok: true as const };
    }
    return {
      ok: true as const,
      openai: !!process.env.OPENAI_API_KEY,
      lexai: !!process.env.LEXAI_API_URL,
      companiesHouse: !!process.env.COMPANIES_HOUSE_API_KEY,
    };
  }),
});
