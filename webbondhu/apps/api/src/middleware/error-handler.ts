import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { isAppError } from "../lib/errors";
import { logger } from "../lib/logger";
export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof ZodError) return res.status(422).json({ requestId: req.id, error: { code: "VALIDATION_ERROR", message: "Invalid request payload", issues: error.issues } });
  if (isAppError(error)) return res.status(error.statusCode).json({ requestId: req.id, error: { code: error.code, message: error.message, details: error.details } });
  logger.error("Unhandled API error", { error, requestId: req.id });
  return res.status(500).json({ requestId: req.id, error: { code: "INTERNAL_ERROR", message: "সার্ভারে সমস্যা হয়েছে" } });
};
