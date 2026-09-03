import { beforeEach } from "vitest";
import prisma from "../src/lib/prisma.js";

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();
});
