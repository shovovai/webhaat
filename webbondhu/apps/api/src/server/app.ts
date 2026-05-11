import express from "express";
import { apiRouter } from "../routes";
import { errorHandler } from "../middleware/error-handler";
import { applySecurity } from "../middleware/security";
import { csrfProtection } from "../middleware/csrf";
import { sanitizeInput } from "../middleware/sanitize";
export const createApp = () => { const app = express(); applySecurity(app); app.use(express.json({ limit: "1mb" })); app.use(sanitizeInput); app.use(csrfProtection); app.use("/api", apiRouter); app.use(errorHandler); return app; };
