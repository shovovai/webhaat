import { z } from "zod";
import { businessCategories } from "@webbondhu/types";
export const createBusinessSchema = z.object({ name: z.string().min(2).max(140), categoryKey: z.enum(businessCategories), slug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/), locale: z.enum(["bn", "en"]).default("bn") });
