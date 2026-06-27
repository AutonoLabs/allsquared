import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { uploadToR2, getR2DownloadUrl, deleteFromR2, isR2Configured, validateFileType } from "../r2";
import { getDb } from "../db";
import { contracts, disputes, fileAttachments, milestones, type User } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

type FileEntityType = "contract" | "milestone" | "dispute" | "profile" | "verification";

async function isUserPartyToContract(db: Awaited<ReturnType<typeof getDb>>, userId: string, contractId: string): Promise<boolean> {
  if (!db) return false;

  const contract = await db
    .select({
      clientId: contracts.clientId,
      providerId: contracts.providerId,
    })
    .from(contracts)
    .where(eq(contracts.id, contractId))
    .limit(1);

  return !!contract[0] && (contract[0].clientId === userId || contract[0].providerId === userId);
}

async function canAccessEntity(
  db: Awaited<ReturnType<typeof getDb>>,
  user: User,
  entityType: FileEntityType,
  entityId: string,
  uploadedBy?: string,
): Promise<boolean> {
  if (!db) return false;
  if (user.role === "admin") return true;

  switch (entityType) {
    case "contract":
      return isUserPartyToContract(db, user.id, entityId);
    case "milestone": {
      const milestone = await db
        .select({ contractId: milestones.contractId })
        .from(milestones)
        .where(eq(milestones.id, entityId))
        .limit(1);
      return milestone[0] ? isUserPartyToContract(db, user.id, milestone[0].contractId) : false;
    }
    case "dispute": {
      const dispute = await db
        .select({ contractId: disputes.contractId })
        .from(disputes)
        .where(eq(disputes.id, entityId))
        .limit(1);
      return dispute[0] ? isUserPartyToContract(db, user.id, dispute[0].contractId) : false;
    }
    case "profile":
    case "verification":
      return entityId === user.id || uploadedBy === user.id;
    default:
      return false;
  }
}

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
      if (!ctx.user) throw new Error("User not authenticated");

      if (!isR2Configured()) {
        throw new Error("File storage is not configured. R2 credentials are missing.");
      }

      if (!validateFileType(input.fileType)) {
        throw new Error(`File type ${input.fileType} is not allowed`);
      }

      if (input.fileSize > MAX_FILE_SIZE) {
        throw new Error("File size exceeds maximum allowed size of 50MB");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const canUpload = await canAccessEntity(db, ctx.user, input.entityType, input.entityId, ctx.user.id);
      if (!canUpload) {
        throw new Error("You do not have permission to upload files for this entity");
      }

      const fileBuffer = Buffer.from(input.fileData, "base64");

      if (fileBuffer.length === 0) {
        throw new Error("Empty file upload");
      }
      if (fileBuffer.length > MAX_FILE_SIZE) {
        throw new Error("File size exceeds maximum allowed size of 50MB");
      }
      if (Math.abs(fileBuffer.length - input.fileSize) > 1024) {
        throw new Error("Declared file size does not match uploaded content");
      }

      const folder =
        input.entityType === "profile" ? "profiles" :
        input.entityType === "verification" ? "verification" :
        input.entityType === "milestone" ? "milestones" :
        input.entityType === "dispute" ? "disputes" :
        "contracts";

      const fileKey = await uploadToR2(fileBuffer, input.fileName, input.fileType, folder);

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
      if (!ctx.user) throw new Error("User not authenticated");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const files = await db
        .select()
        .from(fileAttachments)
        .where(eq(fileAttachments.id, input.fileId))
        .limit(1);

      if (files.length === 0) throw new Error("File not found");

      const file = files[0];

      const hasEntityAccess = await canAccessEntity(db, ctx.user, file.entityType as FileEntityType, file.entityId, file.uploadedBy);
      if (!hasEntityAccess) {
        throw new Error("You do not have permission to access this file");
      }

      if (!isR2Configured()) {
        throw new Error("File storage is not configured");
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
      if (!ctx.user) throw new Error("User not authenticated");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const files = await db
        .select()
        .from(fileAttachments)
        .where(eq(fileAttachments.id, input.fileId))
        .limit(1);

      if (files.length === 0) throw new Error("File not found");
      const file = files[0];

      const hasEntityAccess = await canAccessEntity(db, ctx.user, file.entityType as FileEntityType, file.entityId, file.uploadedBy);
      if (!hasEntityAccess || (file.uploadedBy !== ctx.user.id && ctx.user.role !== "admin")) {
        throw new Error("You do not have permission to delete this file");
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
      if (!ctx.user) throw new Error("User not authenticated");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const hasEntityAccess = await canAccessEntity(db, ctx.user, input.entityType, input.entityId);
      if (!hasEntityAccess) {
        throw new Error("You do not have permission to view files for this entity");
      }

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
