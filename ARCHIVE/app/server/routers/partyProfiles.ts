import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { partyProfiles } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export const partyProfilesRouter = router({
  // Save a new party profile
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        companyNumber: z.string().optional(),
        address: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
        type: z.enum(["client", "contractor", "individual", "company"]).default("company"),
        companiesHouseData: z.string().optional(), // JSON string
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const id = `party_${nanoid(16)}`;
      await db.insert(partyProfiles).values({
        id,
        userId: ctx.user.id,
        name: input.name,
        companyNumber: input.companyNumber || null,
        address: input.address || null,
        email: input.email || null,
        phone: input.phone || null,
        type: input.type,
        companiesHouseData: input.companiesHouseData || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await db
        .select()
        .from(partyProfiles)
        .where(eq(partyProfiles.id, id))
        .limit(1);

      return result[0];
    }),

  // Get user's saved profiles
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return db
      .select()
      .from(partyProfiles)
      .where(eq(partyProfiles.userId, ctx.user.id));
  }),

  // Get a single profile
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(partyProfiles)
        .where(
          and(
            eq(partyProfiles.id, input.id),
            eq(partyProfiles.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!result[0]) throw new Error("Profile not found");
      return result[0];
    }),
});
