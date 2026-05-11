import crypto from "node:crypto";
import type { RequestHandler } from "express";
import { AppError } from "../lib/errors";
const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
export const csrfProtection: RequestHandler = (req, res, next) => {
  const token = req.cookies?.wb_csrf as string | undefined;
  if (!unsafeMethods.has(req.method)) {
    if (!token) res.cookie("wb_csrf", crypto.randomBytes(32).toString("hex"), { httpOnly: false, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
    return next();
  }
  const header = req.header("x-csrf-token");
  if (!token || !header || token !== header) throw new AppError(403, "CSRF validation failed", "CSRF_INVALID");
  return next();
};
