import { describe, expect, it } from "vitest";
import {
  WAITLIST_PATH,
  getPrelaunchRedirect,
  isAllowedPrelaunchTrpcPath,
} from "../../shared/prelaunch";

describe("prelaunch route policy", () => {
  it.each([
    "/",
    "/how-it-works",
    "/features",
    "/pricing",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/waitlist",
  ])("keeps public marketing route %s available", (path) => {
    expect(getPrelaunchRedirect(path)).toBeNull();
  });

  it.each([
    "/sign-in",
    "/sign-up",
    "/dashboard",
    "/dashboard/contracts/123",
    "/admin",
    "/admin/users",
  ])("redirects product or auth route %s to the waitlist", (path) => {
    expect(getPrelaunchRedirect(path)).toBe(WAITLIST_PATH);
  });

  it("allows only the waitlist mutation through the prelaunch API gate", () => {
    expect(isAllowedPrelaunchTrpcPath("/waitlist.join")).toBe(true);
    expect(isAllowedPrelaunchTrpcPath("waitlist.join")) .toBe(true);
    expect(isAllowedPrelaunchTrpcPath("/auth.me")).toBe(false);
    expect(isAllowedPrelaunchTrpcPath("/contracts.list")) .toBe(false);
    expect(isAllowedPrelaunchTrpcPath("/waitlist.join,auth.me")) .toBe(false);
  });
});
