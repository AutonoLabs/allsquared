import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  uploadToFirebase,
  getDownloadUrl,
  deleteFromFirebase,
  isFirebaseConfigured,
  validateFileType,
  ALLOWED_ALL_TYPES
} from "../firebase";
import { getDb } from "../db";
import { fileAttachments } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export const filesRouter = router({
  /**
   * Upload a file (requires base64 encoded file data)
   * Note: For production, consider using direct upload to S3 with pre-signed URLs
   */
  upload: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileSize: z.number(),
        fileData: z.string(), // base64 encoded file data
        entityType: z.enum(["contract", "milestone", "dispute", "profile", "verification"]),
        entityId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      if (!isFirebaseConfigured()) {
        throw new Error("File upload is not configured. Firebase credentials are missing.");
      }

      // Validate file type
      if (!validateFileType(input.fileType, ALLOWED_ALL_TYPES)) {
        throw new Error(`File type ${input.fileType} is not allowed`);
      }

      // Validate file size (max 50MB)
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
      if (input.fileSize > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum allowed size of 50MB`);
      }

      // Convert base64 to buffer
      const fileBuffer = Buffer.from(input.fileData, "base64");

      // Determine folder based on entity type
      const folder = input.entityType === "profile"
        ? "profiles"
        : input.entityType === "verification"
        ? "verification"
        : input.entityType === "milestone"
        ? "milestones"
        : input.entityType === "dispute"
        ? "disputes"
        : "contracts";

      // Upload to Firebase Storage
      const filePath = await uploadToFirebase(fileBuffer, input.fileName, input.fileType, folder);

      // Save file metadata to database
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const fileId = nanoid();
      await db.insert(fileAttachments).values({
        id: fileId,
        entityType: input.entityType,
        entityId: input.entityId,
        uploadedBy: ctx.user.id,
        fileName: input.fileName,
        fileSize: input.fileSize.toString(),
        fileType: input.fileType,
        fileUrl: filePath,
      });

      return {
        id: fileId,
        fileName: input.fileName,
        fileSize: input.fileSize,
        fileType: input.fileType,
        fileUrl: filePath,
      };
    }),

  /**
   * Get download URL for a file
   */
  getDownloadUrl: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Get file metadata
      const files = await db
        .select()
        .from(fileAttachments)
        .where(eq(fileAttachments.id, input.fileId))
        .limit(1);

      if (files.length === 0) {
        throw new Error("File not found");
      }

      const file = files[0];

      // Check if user has access to this file
      // For now, only the uploader can download
      // TODO: Add more sophisticated access control based on entity ownership
      if (file.uploadedBy !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("You do not have permission to access this file");
      }

      if (!isFirebaseConfigured()) {
        throw new Error("File download is not configured. Firebase credentials are missing.");
      }

      // Generate signed URL (valid for 60 minutes)
      const downloadUrl = await getDownloadUrl(file.fileUrl, 60);

      return {
        url: downloadUrl,
        fileName: file.fileName,
        fileType: file.fileType,
      };
    }),

  /**
   * Delete a file
   */
  delete: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Get file metadata
      const files = await db
        .select()
        .from(fileAttachments)
        .where(eq(fileAttachments.id, input.fileId))
        .limit(1);

      if (files.length === 0) {
        throw new Error("File not found");
      }

      const file = files[0];

      // Check if user has permission to delete
      if (file.uploadedBy !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("You do not have permission to delete this file");
      }

      if (!isFirebaseConfigured()) {
        throw new Error("File deletion is not configured. Firebase credentials are missing.");
      }

      // Delete from Firebase Storage
      await deleteFromFirebase(file.fileUrl);

      // Delete from database
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
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const files = await db
        .select()
        .from(fileAttachments)
        .where(
          and(
            eq(fileAttachments.entityType, input.entityType),
            eq(fileAttachments.entityId, input.entityId)
          )
        );

      return files;
    }),

  /**
   * Check if Firebase is configured
   */
  isConfigured: protectedProcedure.query(() => {
    return { configured: isFirebaseConfigured() };
  }),
});
