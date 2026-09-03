import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createBoardSchema, updateBoardSchema } from "../schemas/board.schemas.js";
import {
  listBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boards.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", listBoards);
router.post("/", validate(createBoardSchema), createBoard);
router.get("/:boardId", getBoard);
router.patch("/:boardId", validate(updateBoardSchema), updateBoard);
router.delete("/:boardId", deleteBoard);

export default router;
