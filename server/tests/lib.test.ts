import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../src/lib/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../src/lib/jwt.js";

describe("password", () => {
  it("hashes and verifies a matching password", async () => {
    const hash = await hashPassword("correct-horse");
    expect(await comparePassword("correct-horse", hash)).toBe(true);
  });

  it("rejects a non-matching password", async () => {
    const hash = await hashPassword("correct-horse");
    expect(await comparePassword("wrong-password", hash)).toBe(false);
  });
});

describe("jwt", () => {
  it("signs and verifies an access token", () => {
    const token = signAccessToken("user-1");
    expect(verifyAccessToken(token).userId).toBe("user-1");
  });

  it("signs and verifies a refresh token", () => {
    const token = signRefreshToken("user-1");
    expect(verifyRefreshToken(token).userId).toBe("user-1");
  });

  it("throws when verifying an access token as a refresh token", () => {
    const token = signAccessToken("user-1");
    expect(() => verifyRefreshToken(token)).toThrow();
  });
});
