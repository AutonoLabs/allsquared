import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define environment schema - Clerk-based auth
const BaseEnvSchema = z.object({
  // Clerk authentication
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  
  // Database
  DATABASE_URL: z.string().url().optional(),
  
  // JWT for internal session signing (fallback)
  JWT_SECRET: z.string().min(1).optional(),
  
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // App metadata
  VITE_APP_TITLE: z.string().default("AllSquared"),
  VITE_APP_LOGO: z.string().default("/logo.png"),
  PORT: z.string().optional(),

  // Firebase configuration (optional for file uploads)
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),
  
  // Stripe (optional for payments)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Webhook verification
  TRANSPACT_WEBHOOK_SECRET: z.string().optional(),
  DOCUSIGN_WEBHOOK_SECRET: z.string().optional(),
});

const ProductionEnvSchema = BaseEnvSchema.extend({
  CLERK_SECRET_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
});

const baseEnvVars = BaseEnvSchema.parse(process.env);
const envVars =
  baseEnvVars.NODE_ENV === "production"
    ? ProductionEnvSchema.parse(process.env)
    : baseEnvVars;

const cookieSecret =
  envVars.JWT_SECRET ?? "dev-secret-change-in-production";

if (envVars.NODE_ENV === "production" && cookieSecret === "dev-secret-change-in-production") {
  throw new Error("[Env] JWT_SECRET must be configured in production");
}

// Export in original format for compatibility
export const ENV = {
  clerkSecretKey: envVars.CLERK_SECRET_KEY ?? "",
  databaseUrl: envVars.DATABASE_URL ?? "",
  cookieSecret,
  isProduction: envVars.NODE_ENV === "production",
  appTitle: envVars.VITE_APP_TITLE,
  appLogo: envVars.VITE_APP_LOGO,
  
  // Firebase
  firebaseProjectId: envVars.FIREBASE_PROJECT_ID,
  firebaseClientEmail: envVars.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: envVars.FIREBASE_PRIVATE_KEY,
  firebaseStorageBucket: envVars.FIREBASE_STORAGE_BUCKET,
  
  // Stripe
  stripeSecretKey: envVars.STRIPE_SECRET_KEY,
  stripeWebhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
  transpactWebhookSecret: envVars.TRANSPACT_WEBHOOK_SECRET,
  docusignWebhookSecret: envVars.DOCUSIGN_WEBHOOK_SECRET,
};
