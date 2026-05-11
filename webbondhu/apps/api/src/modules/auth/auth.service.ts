import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "@webbondhu/database";
import { env } from "../../config/env";
import { AppError } from "../../lib/errors";
import type { z } from "zod";
import type { loginSchema, registerSchema } from "./auth.dto";
const signAccessToken = (userId: string, roles: string[]): string => jwt.sign({ sub: userId, roles }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL });
const signRefreshToken = (userId: string): string => jwt.sign({ sub: userId, typ: "refresh" }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL });
export class AuthService {
  async register(input: z.infer<typeof registerSchema>) {
    const existing = await UserModel.findOne({ email: input.email }).lean();
    if (existing) throw new AppError(409, "এই ইমেইল দিয়ে অ্যাকাউন্ট আছে", "EMAIL_EXISTS");
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await UserModel.create({ name: input.name, email: input.email, phone: input.phone, passwordHash, roles: ["owner"], memberships: [] });
    const id = user._id.toString();
    return { user: { id, name: user.name, email: user.email, locale: user.locale }, accessToken: signAccessToken(id, user.roles), refreshToken: signRefreshToken(id) };
  }
  async rotateRefreshToken(refreshToken: string) {
    try {
      const claims = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string; typ: string };
      if (claims.typ !== "refresh") throw new Error("invalid token type");
      const user = await UserModel.findById(claims.sub).lean();
      if (!user || user.disabledAt) throw new AppError(401, "Session expired", "TOKEN_INVALID");
      return { accessToken: signAccessToken(claims.sub, user.roles), refreshToken: signRefreshToken(claims.sub) };
    } catch {
      throw new AppError(401, "Session expired", "TOKEN_INVALID");
    }
  }
  async login(input: z.infer<typeof loginSchema>) {
    const user = await UserModel.findOne({ email: input.email }).select("+passwordHash roles name email locale disabledAt");
    if (!user || user.disabledAt) throw new AppError(401, "ইমেইল বা পাসওয়ার্ড সঠিক নয়", "INVALID_CREDENTIALS");
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new AppError(401, "ইমেইল বা পাসওয়ার্ড সঠিক নয়", "INVALID_CREDENTIALS");
    user.lastLoginAt = new Date(); await user.save();
    const id = user._id.toString();
    return { user: { id, name: user.name, email: user.email, locale: user.locale }, accessToken: signAccessToken(id, user.roles), refreshToken: signRefreshToken(id) };
  }
}
