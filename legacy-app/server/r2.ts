/**
 * Cloudflare R2 storage module (S3-compatible).
 * Falls back gracefully when credentials are missing.
 */
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT;
const R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY;
const R2_SECRET = process.env.CLOUDFLARE_R2_SECRET;
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET || "allsquared-files";

let _client: S3Client | null = null;

function getClient(): S3Client | null {
  if (!R2_ENDPOINT || !R2_ACCESS_KEY || !R2_SECRET) return null;
  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_SECRET,
      },
    });
  }
  return _client;
}

export function isR2Configured(): boolean {
  return !!(R2_ENDPOINT && R2_ACCESS_KEY && R2_SECRET);
}

/**
 * Upload a file buffer to R2.
 * Returns the object key (path) in the bucket.
 */
export async function uploadToR2(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string
): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("R2 storage is not configured");

  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${timestamp}-${safeName}`;

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return key;
}

/**
 * Generate a pre-signed download URL (valid for `expiresInMinutes`).
 */
export async function getR2DownloadUrl(key: string, expiresInMinutes = 60): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("R2 storage is not configured");

  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    { expiresIn: expiresInMinutes * 60 }
  );
}

/**
 * Delete a file from R2.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getClient();
  if (!client) throw new Error("R2 storage is not configured");

  await client.send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key })
  );
}

// Allowed MIME types
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "text/plain",
  "text/csv",
];

export function validateFileType(mimeType: string): boolean {
  return ALLOWED_FILE_TYPES.includes(mimeType);
}
