import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schemas.js";
import { listTasks, createTask, updateTask, deleteTask } from "../controllers/tasks.controller.js";

export const boardTasksRouter = Router({ mergeParams: true });
boardTasksRouter.use(requireAuth);
boardTasksRouter.get("/", listTasks);
boardTasksRouter.post("/", validate(createTaskSchema), createTask);

export const taskRouter = Router();
taskRouter.use(requireAuth);
taskRouter.patch("/:taskId", validate(updateTaskSchema), updateTask);
taskRouter.delete("/:taskId", deleteTask);
