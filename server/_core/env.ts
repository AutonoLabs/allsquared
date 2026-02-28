import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define environment schema - Clerk-based auth
const EnvSchema = z.object({
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
  
  // Legacy Manus vars (optional, for backwards compat during migration)
  VITE_APP_ID: z.string().optional(),
  OAUTH_SERVER_URL: z.string().optional(),
  OWNER_OPEN_ID: z.string().optional(),
  VITE_OAUTH_PORTAL_URL: z.string().optional(),
});

// Parse and validate environment variables (soft fail for missing vars)
let envVars: z.infer<typeof EnvSchema>;
try {
  envVars = EnvSchema.parse(process.env);
} catch (error) {
  console.warn("[Env] Some environment variables are missing or invalid. Running with defaults.");
  envVars = {
    NODE_ENV: "development",
    VITE_APP_TITLE: "AllSquared",
    VITE_APP_LOGO: "/logo.png",
  } as z.infer<typeof EnvSchema>;
}

// Export in original format for compatibility
export const ENV = {
  clerkSecretKey: envVars.CLERK_SECRET_KEY ?? "",
  databaseUrl: envVars.DATABASE_URL ?? "",
  cookieSecret: envVars.JWT_SECRET ?? "dev-secret-change-in-production",
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
  
  // Legacy (for backwards compat)
  appId: envVars.VITE_APP_ID ?? "",
  oAuthServerUrl: envVars.OAUTH_SERVER_URL ?? "",
  ownerId: envVars.OWNER_OPEN_ID ?? "",
  forgeApiUrl: "",  // Legacy - not used with Clerk auth
  forgeApiKey: "",  // Legacy - not used with Clerk auth
};
