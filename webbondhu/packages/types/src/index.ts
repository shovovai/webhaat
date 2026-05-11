import { z } from "zod";

export const businessCategories = ["ecommerce", "restaurant", "clinic", "coaching_center", "portfolio", "agency", "job_portal", "real_estate", "saas", "local_business", "freelancer", "event_business"] as const;
export type BusinessCategory = (typeof businessCategories)[number];

export const moduleKeys = ["auth", "subscription", "website_builder", "templates", "ecommerce", "booking", "ai_assistant", "analytics", "crm", "orders", "payments", "domains", "media", "notifications", "settings", "marketing"] as const;
export type ModuleKey = (typeof moduleKeys)[number];

export const paymentGatewayKeys = ["bkash", "nagad", "rocket", "sslcommerz"] as const;
export type PaymentGatewayKey = (typeof paymentGatewayKeys)[number];

export const roles = ["owner", "admin", "manager", "staff", "viewer", "super_admin"] as const;
export type Role = (typeof roles)[number];

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
export const paginationSchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20), sort: z.string().default("-createdAt") });
export type PaginationQuery = z.infer<typeof paginationSchema>;

export interface ApiEnvelope<T> { data: T; requestId: string; meta?: Record<string, unknown>; }
export interface Paginated<T> { items: T[]; page: number; limit: number; total: number; pages: number; }
export interface TenantContext { userId: string; businessId: string; role: Role; permissions: string[]; }
