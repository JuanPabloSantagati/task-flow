import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";

async function registerAndLogin(email: string) {
  await request(app).post("/auth/register").send({ email, password: "password123", name: "N" });
  const res = await request(app).post("/auth/login").send({ email, password: "password123" });
  return res.body.accessToken as string;
}

describe("boards CRUD", () => {
  let token: string;

  beforeEach(async () => {
    token = await registerAndLogin("owner@example.com");
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/boards");
    expect(res.status).toBe(401);
  });

  it("creates and lists a board for the authenticated user", async () => {
    const create = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Sprint 1" });
    expect(create.status).toBe(201);

    const list = await request(app).get("/boards").set("Authorization", `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.boards).toHaveLength(1);
    expect(list.body.boards[0].title).toBe("Sprint 1");
  });

  it("updates and deletes a board", async () => {
    const create = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Sprint 1" });
    const boardId = create.body.board.id;

    const patch = await request(app)
      .patch(`/boards/${boardId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Sprint 1 renamed" });
    expect(patch.status).toBe(200);
    expect(patch.body.board.title).toBe("Sprint 1 renamed");

    const del = await request(app)
      .delete(`/boards/${boardId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(del.status).toBe(204);
  });

  it("404s for a board that does not exist", async () => {
    const res = await request(app)
      .get("/boards/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
