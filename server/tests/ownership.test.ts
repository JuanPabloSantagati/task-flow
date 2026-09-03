import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

async function registerAndLogin(email: string) {
  await request(app).post("/auth/register").send({ email, password: "password123", name: "N" });
  const res = await request(app).post("/auth/login").send({ email, password: "password123" });
  return res.body.accessToken as string;
}

describe("cross-user ownership", () => {
  it("prevents user B from reading, updating, or deleting user A's board", async () => {
    const tokenA = await registerAndLogin("a@owner.com");
    const tokenB = await registerAndLogin("b@owner.com");

    const board = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "A's board" });
    const boardId = board.body.board.id;

    const readAsB = await request(app)
      .get(`/boards/${boardId}`)
      .set("Authorization", `Bearer ${tokenB}`);
    expect(readAsB.status).toBe(403);

    const updateAsB = await request(app)
      .patch(`/boards/${boardId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ title: "Hijacked" });
    expect(updateAsB.status).toBe(403);

    const deleteAsB = await request(app)
      .delete(`/boards/${boardId}`)
      .set("Authorization", `Bearer ${tokenB}`);
    expect(deleteAsB.status).toBe(403);
  });

  it("prevents user B from updating or deleting user A's task", async () => {
    const tokenA = await registerAndLogin("a2@owner.com");
    const tokenB = await registerAndLogin("b2@owner.com");

    const board = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "A's board" });
    const task = await request(app)
      .post(`/boards/${board.body.board.id}/tasks`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "A's task" });
    const taskId = task.body.task.id;

    const updateAsB = await request(app)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ status: "DONE" });
    expect(updateAsB.status).toBe(403);

    const deleteAsB = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`);
    expect(deleteAsB.status).toBe(403);
  });

  it("does not leak user A's boards into user B's board list", async () => {
    const tokenA = await registerAndLogin("a3@owner.com");
    const tokenB = await registerAndLogin("b3@owner.com");

    await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "A's board" });

    const listAsB = await request(app).get("/boards").set("Authorization", `Bearer ${tokenB}`);
    expect(listAsB.body.boards).toHaveLength(0);
  });
});
