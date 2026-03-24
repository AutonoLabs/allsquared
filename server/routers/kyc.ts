import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { kycVerifications } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export const kycRouter = router({
  /** Get the current user's latest KYC verification status */
  status: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const [latest] = await db
      .select({
        id: kycVerifications.id,
        status: kycVerifications.status,
        verificationType: kycVerifications.verificationType,
        documentType: kycVerifications.documentType,
        failureReason: kycVerifications.failureReason,
        verifiedAt: kycVerifications.verifiedAt,
        createdAt: kycVerifications.createdAt,
      })
      .from(kycVerifications)
      .where(eq(kycVerifications.userId, ctx.user!.id))
      .orderBy(desc(kycVerifications.createdAt))
      .limit(1);

    return latest ?? null;
  }),

  /** Initiate a new KYC verification (stub — creates a pending record) */
  initiate: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const userId = ctx.user!.id;

      // Check if there's already a pending or verified record
      const [existing] = await db
        .select({ id: kycVerifications.id, status: kycVerifications.status })
        .from(kycVerifications)
        .where(eq(kycVerifications.userId, userId))
        .orderBy(desc(kycVerifications.createdAt))
        .limit(1);

      if (existing?.status === "verified") {
        throw new Error("Identity already verified");
      }
      if (existing?.status === "pending" || existing?.status === "processing") {
        throw new Error("Verification already in progress");
      }

      const id = `kyc_${nanoid(16)}`;
      await db.insert(kycVerifications).values({
        id,
        userId,
        status: "pending",
        provider: "manual",
        verificationType: "identity",
      });

      return { id, status: "pending" as const };
    }),
});
