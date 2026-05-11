import type { RequestHandler } from "express";
import { AppError } from "../lib/errors";
export const requireTenant: RequestHandler = (req, _res, next) => {
  const businessId = req.header("x-business-id");
  if (!businessId) throw new AppError(400, "Business context is required", "TENANT_REQUIRED");
  req.tenant = { businessId };
  next();
};
