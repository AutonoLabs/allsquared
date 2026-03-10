import type { VercelRequest, VercelResponse } from "@vercel/node";

let app: any = null;
let initError: Error | null = null;

async function getApp() {
  if (app) return app;
  if (initError) throw initError;
  try {
    // Use the pre-built esbuild bundle — NOT raw source
    // The build step (pnpm build) compiles server/_core/index.ts → dist/index.js
    const mod = await import("../dist/index.js");
    app = mod.default;
    return app;
  } catch (e) {
    initError = e as Error;
    throw e;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (err: any) {
    console.error("[Vercel] App init failed:", err?.message || err);
    (res as any).status(500).json({
      error: "Server initialization failed",
      detail: err?.message || String(err),
    });
  }
}
