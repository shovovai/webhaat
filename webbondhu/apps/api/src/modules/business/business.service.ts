import { BusinessModel } from "@webbondhu/database";
import { AppError } from "../../lib/errors";
import type { z } from "zod";
import type { createBusinessSchema } from "./business.dto";
export class BusinessService {
  async create(ownerId: string, input: z.infer<typeof createBusinessSchema>) {
    const exists = await BusinessModel.exists({ slug: input.slug });
    if (exists) throw new AppError(409, "এই ব্যবসার লিংকটি ইতিমধ্যে ব্যবহৃত", "BUSINESS_SLUG_EXISTS");
    return BusinessModel.create({ ...input, ownerId, status: "draft", settings: { onboardingCompleted: false } });
  }
  async listForUser(userId: string) { return BusinessModel.find({ ownerId: userId }).sort({ createdAt: -1 }).lean(); }
}
