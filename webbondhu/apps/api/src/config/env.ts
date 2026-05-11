import { loadEnv } from "@webbondhu/config";
export const env = loadEnv(process.env);
export const corsOrigins = env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);
