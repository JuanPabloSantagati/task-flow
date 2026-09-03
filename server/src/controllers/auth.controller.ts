import type { RequestHandler } from "express";
import prisma from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../lib/password.js";
import { signAccessToken, signRefreshToken } from "../lib/jwt.js";
import { HttpError } from "../middleware/errorHandler.js";

const REFRESH_COOKIE = "refreshToken";
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register: RequestHandler = async (req, res, next) => {
  const { email, password, name } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    next(new HttpError(400, "EMAIL_TAKEN", "Email is already registered"));
    return;
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  res.status(201).json({ user });
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    next(new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect"));
    return;
  }
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
  res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
};

export { REFRESH_COOKIE, REFRESH_COOKIE_OPTIONS };
