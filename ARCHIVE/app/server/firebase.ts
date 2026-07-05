import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

// Environment variables for Firebase
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "";
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || "";
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || "";

let firebaseApp: App | null = null;

/**
 * Initialize Firebase Admin SDK
 */
function getFirebaseApp(): App {
  if (!firebaseApp) {
    // Check if already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      firebaseApp = existingApps[0];
      return firebaseApp;
    }

    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
      throw new Error(
        "Firebase credentials not configured. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables."
      );
    }

    firebaseApp = initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
      storageBucket: FIREBASE_STORAGE_BUCKET,
    });
  }

  return firebaseApp;
}

/**
 * Get Firebase Storage bucket
 */
function getStorageBucket() {
  const app = getFirebaseApp();
  return getStorage(app).bucket();
}

/**
 * Get Firestore instance
 */
export function getFirestoreDb() {
  const app = getFirebaseApp();
  return getFirestore(app);
}

/**
 * Upload a file to Firebase Storage
 * @param fileBuffer - The file buffer to upload
 * @param fileName - Original file name
 * @param mimeType - MIME type of the file
 * @param folder - Optional folder path in storage (e.g., "profiles", "milestones")
 * @returns The file path in Firebase Storage
 */
export async function uploadToFirebase(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folder: string = "uploads"
): Promise<string> {
  const bucket = getStorageBucket();

  // Generate unique file key with original extension
  const fileExtension = fileName.split(".").pop();
  const uniqueFileName = `${nanoid()}.${fileExtension}`;
  const filePath = `${folder}/${uniqueFileName}`;

  const file = bucket.file(filePath);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
      metadata: {
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    },
    resumable: false, // For files < 10MB, resumable upload is not needed
  });

  return filePath;
}

/**
 * Generate a signed URL for downloading a file from Firebase Storage
 * @param filePath - Path of the file in Firebase Storage
 * @param expiresIn - URL expiration time in minutes (default: 60 minutes)
 * @returns Signed URL
 */
export async function getDownloadUrl(filePath: string, expiresIn: number = 60): Promise<string> {
  const bucket = getStorageBucket();
  const file = bucket.file(filePath);

  // Check if file exists
  const [exists] = await file.exists();
  if (!exists) {
    throw new Error("File not found");
  }

  // Generate signed URL (valid for specified minutes)
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + expiresIn * 60 * 1000, // Convert minutes to milliseconds
  });

  return url;
}

/**
 * Delete a file from Firebase Storage
 * @param filePath - Path of the file in Firebase Storage
 */
export async function deleteFromFirebase(filePath: string): Promise<void> {
  const bucket = getStorageBucket();
  const file = bucket.file(filePath);

  await file.delete();
}

/**
 * Get file metadata
 * @param filePath - Path of the file in Firebase Storage
 */
export async function getFileMetadata(filePath: string) {
  const bucket = getStorageBucket();
  const file = bucket.file(filePath);

  const [metadata] = await file.getMetadata();
  return metadata;
}

/**
 * Check if Firebase is properly configured
 */
export function isFirebaseConfigured(): boolean {
  return !!(FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY && FIREBASE_STORAGE_BUCKET);
}

/**
 * Validate file type
 * @param mimeType - MIME type to validate
 * @param allowedTypes - Array of allowed MIME types
 */
export function validateFileType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType);
}

/**
 * Common allowed file types
 */
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
export const ALLOWED_ARCHIVE_TYPES = ["application/zip", "application/x-zip-compressed"];

export const ALLOWED_ALL_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
  ...ALLOWED_ARCHIVE_TYPES,
];

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
