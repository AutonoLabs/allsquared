import { beforeEach, describe, expect, it, vi } from "vitest";

const { addWaitlistEmail } = vi.hoisted(() => ({
  addWaitlistEmail: vi.fn(),
}));

vi.mock("../db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../db")>();
  return { ...actual, addWaitlistEmail };
});

import { appRouter } from "../routers";

const caller = appRouter.createCaller({
  req: {} as never,
  res: {} as never,
  user: null,
});

describe("waitlist.join", () => {
  beforeEach(() => {
    addWaitlistEmail.mockReset();
  });

  it("normalizes and persists a valid email in the existing database", async () => {
    addWaitlistEmail.mockResolvedValue("added");

    await expect(caller.waitlist.join({ email: "  PERSON@Example.COM " })).resolves.toEqual({
      status: "added",
    });
    expect(addWaitlistEmail).toHaveBeenCalledOnce();
    expect(addWaitlistEmail).toHaveBeenCalledWith("person@example.com");
  });

  it("rejects an invalid email without touching the database", async () => {
    await expect(caller.waitlist.join({ email: "not-an-email" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
    expect(addWaitlistEmail).not.toHaveBeenCalled();
  });

  it("handles duplicate email submissions idempotently", async () => {
    addWaitlistEmail.mockResolvedValue("already_registered");

    await expect(caller.waitlist.join({ email: "person@example.com" })).resolves.toEqual({
      status: "already_registered",
    });
  });
});
