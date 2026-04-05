import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Define environment schema - Clerk-based auth
const EnvSchema = z.object({
  // Clerk authentication
  CLERK_SECRET_KEY: isProduction ? z.string().min(1, "CLERK_SECRET_KEY is required in production") : z.string().min(1).optional(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  
  // Database
  DATABASE_URL: isProduction ? z.string().url("DATABASE_URL is required in production") : z.string().url().optional(),
  
  // JWT for internal session signing (fallback)
  JWT_SECRET: isProduction ? z.string().min(1, "JWT_SECRET is required in production") : z.string().min(1).optional(),
  
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

  // OpenAI
  OPENAI_API_KEY: z.string().optional(),

  // Companies House
  COMPANIES_HOUSE_API_KEY: z.string().optional(),
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
  cookieSecret: (() => {
    const secret = envVars.JWT_SECRET;
    if (!secret && isProduction) {
      throw new Error("JWT_SECRET must be set in production");
    }
    return secret ?? "dev-secret-DO-NOT-USE-IN-PROD";
  })(),
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

  // Stripe Webhook
  stripeWebhookSecret: envVars.STRIPE_WEBHOOK_SECRET,

  // OpenAI
  openaiApiKey: envVars.OPENAI_API_KEY,

  // Companies House
  companiesHouseApiKey: envVars.COMPANIES_HOUSE_API_KEY,
};
