import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.routes.js";
import boardsRouter from "./routes/boards.routes.js";
import { boardTasksRouter, taskRouter } from "./routes/tasks.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/boards", boardsRouter);
app.use("/boards/:boardId/tasks", boardTasksRouter);
app.use("/tasks", taskRouter);

// Route handlers registered above this line
app.use(errorHandler);

export default app;
