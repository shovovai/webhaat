import { z } from "zod";
import type { BusinessCategory } from "@webbondhu/types";

export const onboardingAnswerSchema = z.object({ businessName: z.string().min(2), category: z.string(), audience: z.string().min(2), services: z.array(z.string()).min(1), tone: z.enum(["friendly", "premium", "professional", "playful"]).default("friendly"), language: z.enum(["bn", "en", "mixed"]).default("bn") });
export type OnboardingAnswers = z.infer<typeof onboardingAnswerSchema>;
export interface GeneratedPage { title: string; slug: string; sections: Array<{ type: string; content: Record<string, string | string[]> }>; }
export interface GeneratedWebsiteBlueprint { category: BusinessCategory; templateHint: string; pages: GeneratedPage[]; seo: { title: string; description: string }; suggestedModules: string[]; }
export interface AIClient { completeJson<T>(input: { system: string; prompt: string; schema: z.ZodType<T>; model?: string }): Promise<T>; }

export class WebBondhuAIOrchestrator {
  constructor(private readonly client: AIClient) {}
  async generateWebsiteBlueprint(answers: OnboardingAnswers): Promise<GeneratedWebsiteBlueprint> {
    const parsed = onboardingAnswerSchema.parse(answers);
    return this.client.completeJson({
      system: "You are WebBondhu, a Bangla-first business OS architect for Bangladesh SMEs. Return safe production JSON only.",
      prompt: JSON.stringify({ task: "generate_website_blueprint", answers: parsed }),
      schema: z.object({ category: z.custom<BusinessCategory>(), templateHint: z.string(), pages: z.array(z.object({ title: z.string(), slug: z.string(), sections: z.array(z.object({ type: z.string(), content: z.record(z.union([z.string(), z.array(z.string())])) })) }), seo: z.object({ title: z.string(), description: z.string() }), suggestedModules: z.array(z.string()) })
    });
  }
}
