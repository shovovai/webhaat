import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { nanoid } from "nanoid";
import { corsOrigins } from "../config/env";
export const applySecurity = (app: Express): void => {
  app.use((req, _res, next) => { req.id = req.headers["x-request-id"]?.toString() ?? nanoid(); next(); });
  app.use(pinoHttp({ genReqId: (req) => req.id }));
  app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], objectSrc: ["'none'"], baseUri: ["'self'"], frameAncestors: ["'none'"] } } }));
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }));
  app.use(compression());
  app.use(cookieParser());
};
