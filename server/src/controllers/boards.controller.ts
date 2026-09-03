import type { RequestHandler } from "express";
import prisma from "../lib/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function getOwnedBoardOrThrow(userId: string, boardId: string) {
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) throw new HttpError(404, "NOT_FOUND", "Board not found");
  if (board.userId !== userId) throw new HttpError(403, "FORBIDDEN", "Not your board");
  return board;
}

export const listBoards: RequestHandler = async (req, res, next) => {
  try {
    const boards = await prisma.board.findMany({ where: { userId: req.userId } });
    res.json({ boards });
  } catch (err) {
    next(err);
  }
};

export const createBoard: RequestHandler = async (req, res, next) => {
  try {
    const board = await prisma.board.create({
      data: { title: req.body.title, userId: req.userId! },
    });
    res.status(201).json({ board });
  } catch (err) {
    next(err);
  }
};

export const getBoard: RequestHandler = async (req, res, next) => {
  try {
    const board = await getOwnedBoardOrThrow(req.userId!, req.params.boardId);
    const tasks = await prisma.task.findMany({
      where: { boardId: board.id },
      orderBy: { order: "asc" },
    });
    res.json({ board, tasks });
  } catch (err) {
    next(err);
  }
};

export const updateBoard: RequestHandler = async (req, res, next) => {
  try {
    await getOwnedBoardOrThrow(req.userId!, req.params.boardId);
    const board = await prisma.board.update({
      where: { id: req.params.boardId },
      data: { title: req.body.title },
    });
    res.json({ board });
  } catch (err) {
    next(err);
  }
};

export const deleteBoard: RequestHandler = async (req, res, next) => {
  try {
    await getOwnedBoardOrThrow(req.userId!, req.params.boardId);
    await prisma.board.delete({ where: { id: req.params.boardId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
