import { Router } from "express";
import { AuthService } from "./auth.service";
import { loginSchema, refreshSchema, registerSchema } from "./auth.dto";
const service = new AuthService();
export const authRouter = Router();
authRouter.post("/register", async (req, res, next) => { try { const result = await service.register(registerSchema.parse(req.body)); res.status(201).json({ data: result, requestId: req.id }); } catch (error) { next(error); } });
authRouter.post("/login", async (req, res, next) => { try { const result = await service.login(loginSchema.parse(req.body)); res.json({ data: result, requestId: req.id }); } catch (error) { next(error); } });
authRouter.post("/refresh", async (req, res, next) => { try { const { refreshToken } = refreshSchema.parse(req.body); const result = await service.rotateRefreshToken(refreshToken); res.json({ data: result, requestId: req.id }); } catch (error) { next(error); } });
