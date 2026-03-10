import type { VercelRequest, VercelResponse } from "@vercel/node";

let app: any = null;
let initError: Error | null = null;

async function getApp() {
  if (app) return app;
  if (initError) throw initError;
  try {
    const mod = await import("../server/_core/index.js");
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
    res.status(500).json({
      error: "Server initialization failed",
      detail: err?.message || String(err),
    });
  }
}
