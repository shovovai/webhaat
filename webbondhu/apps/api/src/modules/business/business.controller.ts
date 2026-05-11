import { Router } from "express";
import { BusinessService } from "./business.service";
import { createBusinessSchema } from "./business.dto";
const service = new BusinessService();
export const businessRouter = Router();
businessRouter.get("/", async (req, res, next) => { try { res.json({ data: await service.listForUser(req.user?.id ?? "000000000000000000000000"), requestId: req.id }); } catch (error) { next(error); } });
businessRouter.post("/", async (req, res, next) => { try { const ownerId = req.user?.id ?? req.body.ownerId; const business = await service.create(ownerId, createBusinessSchema.parse(req.body)); res.status(201).json({ data: business, requestId: req.id }); } catch (error) { next(error); } });
