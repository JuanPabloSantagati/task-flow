import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("POST /auth/register", () => {
  it("creates a user and returns 201", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "a@example.com", password: "password123", name: "Ana" });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("a@example.com");
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it("rejects a duplicate email with 400", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "a@example.com", password: "password123", name: "Ana" });
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "a@example.com", password: "password123", name: "Ana" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("EMAIL_TAKEN");
  });
});

describe("POST /auth/login", () => {
  it("logs in with correct credentials and sets a refresh cookie", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "b@example.com", password: "password123", name: "Bea" });
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "b@example.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTypeOf("string");
    expect(res.headers["set-cookie"][0]).toContain("refreshToken=");
  });

  it("rejects wrong password with 401", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "c@example.com", password: "password123", name: "Caz" });
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "c@example.com", password: "wrong-password" });
    expect(res.status).toBe(401);
  });
});
