import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.string().default("local"),
  WEB_URL: z.string().url(), ADMIN_URL: z.string().url(), API_URL: z.string().url(),
  MONGODB_URI: z.string().min(1), REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32), JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default("15m"), JWT_REFRESH_TTL: z.string().default("30d"),
  COOKIE_DOMAIN: z.string().default("localhost"), CORS_ORIGINS: z.string().default(""),
  OPENAI_BASE_URL: z.string().url().default("https://api.openai.com/v1"), OPENAI_API_KEY: z.string().optional(), AI_DEFAULT_MODEL: z.string().default("gpt-4.1-mini")
});
export type AppEnv = z.infer<typeof envSchema>;
export const loadEnv = (source: NodeJS.ProcessEnv): AppEnv => envSchema.parse(source);

export const designTokens = {
  colors: { background: "#080808", surface: "#111111", border: "#1a1a1a", primary: "#00E5A0", secondary: "#7C3AED" },
  fonts: { bangla: "Hind Siliguri", sans: "Geist" }
} as const;
