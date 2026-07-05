import { describe, expect, it, vi, beforeEach } from "vitest";

const sendMock = vi.fn().mockResolvedValue({ data: { id: "test-id" }, error: null });

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

describe("POST /api/lead", () => {
  beforeEach(() => {
    sendMock.mockClear();
    process.env.RESEND_API_KEY = "test-key";
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
  });

  it("returns ok:true without emailing when RESEND_API_KEY is missing", async () => {
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
});
