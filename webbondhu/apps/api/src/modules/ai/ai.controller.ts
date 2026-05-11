import { Router } from "express";
import { WebBondhuAIOrchestrator, onboardingAnswerSchema, type AIClient } from "@webbondhu/ai";
import { AppError } from "../../lib/errors";
const client: AIClient = { async completeJson() { throw new AppError(503, "AI provider is not configured for this environment", "AI_PROVIDER_UNAVAILABLE"); } };
const orchestrator = new WebBondhuAIOrchestrator(client);
export const aiRouter = Router();
aiRouter.post("/website-blueprint", async (req, res, next) => { try { const data = await orchestrator.generateWebsiteBlueprint(onboardingAnswerSchema.parse(req.body)); res.json({ data, requestId: req.id }); } catch (error) { next(error); } });
