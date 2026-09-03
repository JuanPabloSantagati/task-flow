import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";

async function setup() {
  await request(app)
    .post("/auth/register")
    .send({ email: "t@example.com", password: "password123", name: "T" });
  const login = await request(app)
    .post("/auth/login")
    .send({ email: "t@example.com", password: "password123" });
  const token = login.body.accessToken as string;
  const board = await request(app)
    .post("/boards")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Board" });
  return { token, boardId: board.body.board.id as string };
}

describe("tasks CRUD", () => {
  let token: string;
  let boardId: string;

  beforeEach(async () => {
    ({ token, boardId } = await setup());
  });

  it("creates and lists tasks for a board", async () => {
    const create = await request(app)
      .post(`/boards/${boardId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Write tests" });
    expect(create.status).toBe(201);
    expect(create.body.task.status).toBe("TODO");

    const list = await request(app)
      .get(`/boards/${boardId}/tasks`)
      .set("Authorization", `Bearer ${token}`);
    expect(list.body.tasks).toHaveLength(1);
  });

  it("updates a task's status", async () => {
    const create = await request(app)
      .post(`/boards/${boardId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Write tests" });
    const taskId = create.body.task.id;

    const patch = await request(app)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "DONE" });
    expect(patch.status).toBe(200);
    expect(patch.body.task.status).toBe("DONE");
  });

  it("deletes a task", async () => {
    const create = await request(app)
      .post(`/boards/${boardId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Write tests" });
    const taskId = create.body.task.id;

    const del = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(del.status).toBe(204);
  });
});
