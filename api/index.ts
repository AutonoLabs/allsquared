// Import the pre-built esbuild bundle (not raw TypeScript source)
// This avoids pulling in vite/lightningcss native modules at runtime
import app from "../dist/index.js";

export default app;
