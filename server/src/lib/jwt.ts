import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

function getSecret(name: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET"): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ userId } satisfies TokenPayload, getSecret("JWT_ACCESS_SECRET"), {
    expiresIn: "15m",
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId } satisfies TokenPayload, getSecret("JWT_REFRESH_SECRET"), {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, getSecret("JWT_ACCESS_SECRET")) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, getSecret("JWT_REFRESH_SECRET")) as TokenPayload;
}
