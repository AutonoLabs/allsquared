import { TRPCError } from '@trpc/server';
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { uploadToR2, getR2DownloadUrl, deleteFromR2, isR2Configured, validateFileType } from "../r2";
import { getDb } from "../db";
import { fileAttachments, contracts } from "../../drizzle/schema";
import { eq, and, or } from "drizzle-orm";
import { nanoid } from "nanoid";

// Helper: check if a user is a party to a contract
async function isUserPartyToContract(db: any, userId: string, contractId: string): Promise<boolean> {
  const result = await db
    .select({ id: contracts.id })
    .from(contracts)
    .where(
      and(
        eq(contracts.id, contractId),
        or(eq(contracts.clientId, userId), eq(contracts.providerId, userId))
      )
    )
    .limit(1);
  return result.length > 0;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const filesRouter = router({
  /**
   * Upload a file (base64 encoded) → R2
   */
  upload: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileSize: z.number(),
        fileData: z.string(), // base64
        entityType: z.enum(["contract", "milestone", "dispute", "profile", "verification"]),
        entityId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: "User not authenticated" });

      if (!isR2Configured()) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: "File storage is not configured. R2 credentials are missing." });
      }

      if (!validateFileType(input.fileType)) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: `File type ${input.fileType} is not allowed` });
      }

      if (input.fileSize > MAX_FILE_SIZE) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: "File size exceeds maximum allowed size of 50MB" });
      }

      const fileBuffer = Buffer.from(input.fileData, "base64");

      const folder =
        input.entityType === "profile" ? "profiles" :
        input.entityType === "verification" ? "verification" :
        input.entityType === "milestone" ? "milestones" :
        input.entityType === "dispute" ? "disputes" :
        "contracts";

      const fileKey = await uploadToR2(fileBuffer, input.fileName, input.fileType, folder);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Database not available" });

      const fileId = nanoid();
      await db.insert(fileAttachments).values({
        id: fileId,
        entityType: input.entityType,
        entityId: input.entityId,
        uploadedBy: ctx.user.id,
        fileName: input.fileName,
        fileSize: input.fileSize.toString(),
        fileType: input.fileType,
        fileUrl: fileKey, // R2 object key
      });

      return {
        id: fileId,
        fileName: input.fileName,
        fileSize: input.fileSize,
        fileType: input.fileType,
        fileUrl: fileKey,
      };
    }),

  /**
   * Get pre-signed download URL
   */
  getDownloadUrl: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: "User not authenticated" });

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Database not available" });

      const files = await db
        .select()
        .from(fileAttachments)
        .where(eq(fileAttachments.id, input.fileId))
        .limit(1);

      if (files.length === 0) throw new TRPCError({ code: 'NOT_FOUND', message: "File not found" });

      const file = files[0];

      // Check access: uploader, admin, or party to the associated contract
      let hasAccess = file.uploadedBy === ctx.user.id || ctx.user.role === "admin";
      if (!hasAccess && file.entityType === "contract" && file.entityId) {
        hasAccess = await isUserPartyToContract(db, ctx.user.id, file.entityId);
      }
      if (!hasAccess) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to access this file' });
      }

      if (!isR2Configured()) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'File storage is not configured' });
      }

      const downloadUrl = await getR2DownloadUrl(file.fileUrl, 60);

      return {
        url: downloadUrl,
        fileName: file.fileName,
        fileType: file.fileType,
      };
    }),

  /**
   * Delete a file from R2 + database
   */
  delete: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: "User not authenticated" });

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Database not available" });

      const files = await db
        .select()
        .from(fileAttachments)
        .where(eq(fileAttachments.id, input.fileId))
        .limit(1);

      if (files.length === 0) throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });
      const file = files[0];

      // Check access: uploader, admin, or party to the associated contract
      let hasDeleteAccess = file.uploadedBy === ctx.user.id || ctx.user.role === "admin";
      if (!hasDeleteAccess && file.entityType === "contract" && file.entityId) {
        hasDeleteAccess = await isUserPartyToContract(db, ctx.user.id, file.entityId);
      }
      if (!hasDeleteAccess) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to delete this file' });
      }

      if (isR2Configured()) {
        await deleteFromR2(file.fileUrl);
      }

      await db.delete(fileAttachments).where(eq(fileAttachments.id, input.fileId));
      return { success: true };
    }),

  /**
   * Get files for an entity
   */
  getEntityFiles: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["contract", "milestone", "dispute", "profile", "verification"]),
        entityId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: "User not authenticated" });

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Database not available" });

      return db
        .select()
        .from(fileAttachments)
        .where(
          and(
            eq(fileAttachments.entityType, input.entityType),
            eq(fileAttachments.entityId, input.entityId)
          )
        );
    }),

  /**
   * Check if storage is configured
   */
  isConfigured: protectedProcedure.query(() => {
    return { configured: isR2Configured() };
  }),
});
