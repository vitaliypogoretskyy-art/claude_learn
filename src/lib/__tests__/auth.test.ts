// @vitest-environment node
import { describe, test, expect, vi, beforeEach } from "vitest";
import { jwtVerify } from "jose";

vi.mock("server-only", () => ({}));

const mockCookieSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({ set: mockCookieSet })),
}));

const JWT_SECRET = new TextEncoder().encode("development-secret-key");

const { createSession } = await import("@/lib/auth");

describe("createSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  test("sets the auth-token cookie", async () => {
    await createSession("user-1", "test@example.com");

    expect(mockCookieSet).toHaveBeenCalledOnce();
    expect(mockCookieSet.mock.calls[0][0]).toBe("auth-token");
  });

  test("JWT payload contains userId and email", async () => {
    await createSession("user-42", "hello@example.com");

    const token = mockCookieSet.mock.calls[0][1];
    const { payload } = await jwtVerify(token, JWT_SECRET);
    expect(payload.userId).toBe("user-42");
    expect(payload.email).toBe("hello@example.com");
  });

  test("cookie expires in approximately 7 days", async () => {
    const before = Date.now();
    await createSession("user-1", "test@example.com");
    const after = Date.now();

    const { expires } = mockCookieSet.mock.calls[0][2];
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    expect(expires.getTime()).toBeGreaterThanOrEqual(before + sevenDays - 100);
    expect(expires.getTime()).toBeLessThanOrEqual(after + sevenDays + 100);
  });

  test("cookie is httpOnly with lax sameSite and root path", async () => {
    await createSession("user-1", "test@example.com");

    const options = mockCookieSet.mock.calls[0][2];
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
  });

  test("secure flag is false outside production", async () => {
    await createSession("user-1", "test@example.com");

    const { secure } = mockCookieSet.mock.calls[0][2];
    expect(secure).toBe(false);
  });

  test("secure flag is true in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await createSession("user-1", "test@example.com");

    const { secure } = mockCookieSet.mock.calls[0][2];
    expect(secure).toBe(true);
  });
});
