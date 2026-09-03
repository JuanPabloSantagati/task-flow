import type { RequestHandler } from "express";
import prisma from "../lib/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";
import { getOwnedBoardOrThrow } from "./boards.controller.js";

async function getOwnedTaskOrThrow(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { board: true } });
  if (!task) throw new HttpError(404, "NOT_FOUND", "Task not found");
  if (task.board.userId !== userId) throw new HttpError(403, "FORBIDDEN", "Not your task");
  return task;
}

export const listTasks: RequestHandler = async (req, res, next) => {
  try {
    await getOwnedBoardOrThrow(req.userId!, req.params.boardId);
    const tasks = await prisma.task.findMany({
      where: { boardId: req.params.boardId },
      orderBy: { order: "asc" },
    });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    await getOwnedBoardOrThrow(req.userId!, req.params.boardId);
    const task = await prisma.task.create({
      data: {
        boardId: req.params.boardId,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      },
    });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

export const updateTask: RequestHandler = async (req, res, next) => {
  try {
    await getOwnedTaskOrThrow(req.userId!, req.params.taskId);
    const { title, description, status, order, dueDate } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.taskId },
      data: {
        title,
        description,
        status,
        order,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    await getOwnedTaskOrThrow(req.userId!, req.params.taskId);
    await prisma.task.delete({ where: { id: req.params.taskId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
