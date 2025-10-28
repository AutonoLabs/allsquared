import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define environment schema
const EnvSchema = z.object({
  // Required variables
  VITE_APP_ID: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  DATABASE_URL: z.string().url(),
  OAUTH_SERVER_URL: z.string().url(),
  OWNER_OPEN_ID: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Optional variables
  BUILT_IN_FORGE_API_URL: z.string().url().optional(),
  BUILT_IN_FORGE_API_KEY: z.string().optional(),
  VITE_APP_TITLE: z.string().default("AllSquared"),
  VITE_APP_LOGO: z.string().default("/logo.png"),
  VITE_OAUTH_PORTAL_URL: z.string().url().optional(),
  PORT: z.string().optional(),
});

// Parse and validate environment variables
const envVars = EnvSchema.parse(process.env);

// Export in original format for compatibility
export const ENV = {
  appId: envVars.VITE_APP_ID,
  cookieSecret: envVars.JWT_SECRET,
  databaseUrl: envVars.DATABASE_URL,
  oAuthServerUrl: envVars.OAUTH_SERVER_URL,
  ownerId: envVars.OWNER_OPEN_ID,
  isProduction: envVars.NODE_ENV === "production",
  forgeApiUrl: envVars.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: envVars.BUILT_IN_FORGE_API_KEY ?? "",
};
