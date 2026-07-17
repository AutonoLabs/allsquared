export const WAITLIST_PATH = "/waitlist";

const RESTRICTED_ROUTE_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/dashboard",
  "/admin",
] as const;

export function getPrelaunchRedirect(pathname: string): string | null {
  const path = pathname.split("?", 1)[0].replace(/\/+$/, "") || "/";
  const restricted = RESTRICTED_ROUTE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );

  return restricted ? WAITLIST_PATH : null;
}

export function isAllowedPrelaunchTrpcPath(requestPath: string): boolean {
  const procedures = requestPath
    .split("?", 1)[0]
    .replace(/^\/+/, "")
    .split(",")
    .filter(Boolean);

  return procedures.length > 0 && procedures.every((procedure) => procedure === "waitlist.join");
}
