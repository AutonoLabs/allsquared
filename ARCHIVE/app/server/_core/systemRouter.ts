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

  // Service health check — reports which env vars / integrations are configured
  serviceHealth: publicProcedure.query(() => ({
    openai: !!process.env.OPENAI_API_KEY,
    lexai: !!process.env.LEXAI_API_URL,
    companiesHouse: !!process.env.COMPANIES_HOUSE_API_KEY,
  })),
});
