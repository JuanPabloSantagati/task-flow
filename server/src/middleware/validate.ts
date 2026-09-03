import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { HttpError } from "./errorHandler.js";

export function validate(schema: ZodSchema): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new HttpError(400, "VALIDATION_ERROR", result.error.issues[0].message));
      return;
    }
    req.body = result.data;
    next();
  };
}
