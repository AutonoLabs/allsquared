import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const sendMock = vi.fn().mockResolvedValue({ data: { id: "test-id" }, error: null });

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

describe("POST /api/lead", () => {
  let tmpDir: string;
  let prevCwd: string;

  beforeEach(async () => {
    sendMock.mockClear();
    process.env.RESEND_API_KEY = "test-key";
    prevCwd = process.cwd();
    tmpDir = await mkdtemp(path.join(os.tmpdir(), "lead-route-"));
    process.chdir(tmpDir);
    vi.resetModules();
  });

  afterEach(async () => {
    process.chdir(prevCwd);
    await rm(tmpDir, { recursive: true, force: true });
  });

  it("returns ok:true and emails the lead when RESEND_API_KEY is set", async () => {
    const { POST } = await import("../route");
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      body: JSON.stringify({
        email: "subbie@example.com",
        notifiedSum: 500000,
        likelyValid: "smash_and_grab_likely",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);

    const jsonl = await readFile(path.join(tmpDir, "data", "leads.jsonl"), "utf8");
    const row = JSON.parse(jsonl.trim());
    expect(row.email).toBe("subbie@example.com");
    expect(row.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("returns 200 and writes jsonl when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const { POST } = await import("../route");
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      body: JSON.stringify({
        email: "subbie@example.com",
        notifiedSum: 500000,
        likelyValid: "smash_and_grab_likely",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();

    const jsonl = await readFile(path.join(tmpDir, "data", "leads.jsonl"), "utf8");
    const row = JSON.parse(jsonl.trim());
    expect(row).toMatchObject({
      email: "subbie@example.com",
      notifiedSum: 500000,
      likelyValid: "smash_and_grab_likely",
    });
    expect(row.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("returns 400 for an invalid payload", async () => {
    const { POST } = await import("../route");
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for a non-JSON body instead of throwing", async () => {
    const { POST } = await import("../route");
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      body: "not json at all",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("still returns ok:true and persists the lead when Resend throws", async () => {
    sendMock.mockRejectedValueOnce(new Error("unverified domain"));
    const { POST } = await import("../route");
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      body: JSON.stringify({
        email: "subbie@example.com",
        notifiedSum: 500000,
        likelyValid: "smash_and_grab_likely",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("rejects an implausibly large notified sum", async () => {
    const { POST } = await import("../route");
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      body: JSON.stringify({
        email: "subbie@example.com",
        notifiedSum: 1_000_000_000_00, // £1,000,000,000
        likelyValid: "smash_and_grab_likely",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
