import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../lib/errors";
interface AccessClaims { sub: string; roles: string[]; }
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
  try {
    const claims = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as AccessClaims;
    req.user = { id: claims.sub, roles: claims.roles };
    next();
  } catch {
    throw new AppError(401, "Session expired", "TOKEN_INVALID");
  }
};
export const requireRole = (...roles: string[]): RequestHandler => (req, _res, next) => {
  if (!req.user || !req.user.roles.some((role) => roles.includes(role))) throw new AppError(403, "Permission denied", "FORBIDDEN");
  next();
};
