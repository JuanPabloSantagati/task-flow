import type { RequestHandler } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { HttpError } from "./errorHandler.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new HttpError(401, "NOT_AUTHENTICATED", "Missing bearer token"));
    return;
  }
  try {
    const { userId } = verifyAccessToken(header.slice("Bearer ".length));
    req.userId = userId;
    next();
  } catch {
    next(new HttpError(401, "NOT_AUTHENTICATED", "Invalid or expired token"));
  }
};
