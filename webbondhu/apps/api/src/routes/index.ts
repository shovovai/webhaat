import { Router } from "express";
import { authRouter } from "../modules/auth/auth.controller";
import { businessRouter } from "../modules/business/business.controller";
import { aiRouter } from "../modules/ai/ai.controller";
export const apiRouter = Router();
apiRouter.get("/health", (_req, res) => res.json({ status: "ok", service: "webbondhu-api" }));
apiRouter.use("/auth", authRouter);
apiRouter.use("/businesses", businessRouter);
apiRouter.use("/ai", aiRouter);
