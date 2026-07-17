import { publicProcedure, router } from "../_core/trpc";
import { addWaitlistEmail } from "../db";
import { z } from "zod";

export const waitlistRouter = router({
  join: publicProcedure
    .input(
      z.object({
        email: z.string().trim().email().max(320),
      }),
    )
    .mutation(async ({ input }) => {
      const email = input.email.toLowerCase();
      const status = await addWaitlistEmail(email);
      return { status } as const;
    }),
});