import type { RequestHandler } from "express";
const dangerousKeys = new Set(["__proto__", "constructor", "prototype"]);
const sanitizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    const clean: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) if (!dangerousKeys.has(key) && !key.startsWith("$")) clean[key] = sanitizeValue(nested);
    return clean;
  }
  if (typeof value === "string") return value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").trim();
  return value;
};
export const sanitizeInput: RequestHandler = (req, _res, next) => { req.body = sanitizeValue(req.body); req.query = sanitizeValue(req.query) as typeof req.query; req.params = sanitizeValue(req.params) as typeof req.params; next(); };
