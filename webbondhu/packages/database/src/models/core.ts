import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { businessCategories, moduleKeys, paymentGatewayKeys, roles } from "@webbondhu/types";
import { softDeletePlugin } from "../plugins/soft-delete";

const objectId = Schema.Types.ObjectId;
const auditFields = { createdBy: { type: objectId, ref: "User" }, updatedBy: { type: objectId, ref: "User" } };
const tenantField = { businessId: { type: objectId, ref: "Business", required: true, index: true } };

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
  phone: { type: String, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  locale: { type: String, enum: ["bn", "en"], default: "bn" },
  roles: [{ type: String, enum: roles, default: "owner" }],
  memberships: [{ businessId: { type: objectId, ref: "Business", required: true }, role: { type: String, enum: roles, required: true }, permissions: [{ type: String }] }],
  lastLoginAt: Date, disabledAt: Date, ...auditFields
}, { timestamps: true });
UserSchema.plugin(softDeletePlugin);

const CategorySchema = new Schema({
  key: { type: String, enum: businessCategories, required: true, unique: true },
  nameBn: { type: String, required: true }, nameEn: { type: String, required: true },
  enabledModules: [{ type: String, enum: moduleKeys }],
  featureSchema: { type: Schema.Types.Mixed, default: {} },
  subscriptionPlanIds: [{ type: objectId, ref: "SubscriptionPlan" }],
  displayOrder: { type: Number, default: 100 }, isActive: { type: Boolean, default: true }, ...auditFields
}, { timestamps: true });
CategorySchema.plugin(softDeletePlugin);

const BusinessSchema = new Schema({
  ownerId: { type: objectId, ref: "User", required: true, index: true },
  categoryKey: { type: String, enum: businessCategories, required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 140 }, slug: { type: String, required: true, unique: true, lowercase: true },
  status: { type: String, enum: ["draft", "active", "suspended", "archived"], default: "draft", index: true },
  locale: { type: String, enum: ["bn", "en"], default: "bn" },
  timezone: { type: String, default: "Asia/Dhaka" }, currency: { type: String, default: "BDT" },
  settings: { type: Schema.Types.Mixed, default: {} }, activeSubscriptionId: { type: objectId, ref: "Subscription" }, ...auditFields
}, { timestamps: true });
BusinessSchema.index({ ownerId: 1, status: 1 });
BusinessSchema.plugin(softDeletePlugin);

const SubscriptionPlanSchema = new Schema({
  categoryKey: { type: String, enum: businessCategories, required: true, index: true }, name: { type: String, required: true }, code: { type: String, required: true, unique: true },
  billingIntervals: [{ type: String, enum: ["monthly", "yearly"] }], prices: { monthly: Number, yearly: Number }, trialDays: { type: Number, default: 0 },
  limits: { businesses: Number, products: Number, bookings: Number, storageMb: Number, aiCredits: Number, staffSeats: Number },
  features: [{ key: String, enabled: Boolean, quota: Number }], isActive: { type: Boolean, default: true }, ...auditFields
}, { timestamps: true });
SubscriptionPlanSchema.plugin(softDeletePlugin);

const SubscriptionSchema = new Schema({ ...tenantField, planId: { type: objectId, ref: "SubscriptionPlan", required: true }, interval: { type: String, enum: ["monthly", "yearly"], required: true }, status: { type: String, enum: ["trialing", "active", "past_due", "cancelled", "expired"], index: true }, currentPeriodStart: Date, currentPeriodEnd: Date, trialEndsAt: Date, cancelledAt: Date, usage: { type: Schema.Types.Mixed, default: {} }, ...auditFields }, { timestamps: true });
SubscriptionSchema.index({ businessId: 1, status: 1 }); SubscriptionSchema.plugin(softDeletePlugin);

const TemplateSchema = new Schema({ categoryKey: { type: String, enum: businessCategories, required: true, index: true }, name: { type: String, required: true }, slug: { type: String, required: true, unique: true }, version: { type: Number, default: 1 }, status: { type: String, enum: ["draft", "published", "archived"], default: "draft" }, config: { type: Schema.Types.Mixed, required: true }, globalStyles: { type: Schema.Types.Mixed, default: {} }, previewImage: String, ...auditFields }, { timestamps: true });
TemplateSchema.plugin(softDeletePlugin);

const WebsiteSchema = new Schema({ ...tenantField, templateId: { type: objectId, ref: "Template" }, status: { type: String, enum: ["draft", "published", "unpublished"], default: "draft", index: true }, theme: { type: Schema.Types.Mixed, default: {} }, seo: { title: String, description: String, image: String }, publishedAt: Date, deployment: { provider: String, url: String, version: Number }, ...auditFields }, { timestamps: true });
WebsiteSchema.plugin(softDeletePlugin);

const PageSchema = new Schema({ ...tenantField, websiteId: { type: objectId, ref: "Website", required: true, index: true }, title: { type: String, required: true }, slug: { type: String, required: true }, locale: { type: String, enum: ["bn", "en"], default: "bn" }, blocks: [{ id: String, type: String, props: Schema.Types.Mixed, styles: Schema.Types.Mixed }], seo: { title: String, description: String }, revision: { type: Number, default: 1 }, isHome: { type: Boolean, default: false }, ...auditFields }, { timestamps: true });
PageSchema.index({ websiteId: 1, slug: 1, locale: 1 }, { unique: true }); PageSchema.plugin(softDeletePlugin);

const ProductSchema = new Schema({ ...tenantField, name: { type: String, required: true }, slug: { type: String, required: true }, description: String, price: { type: Number, required: true, min: 0 }, compareAtPrice: Number, sku: { type: String, index: true }, inventory: { type: Number, default: 0 }, images: [String], status: { type: String, enum: ["draft", "active", "archived"], default: "draft" }, ...auditFields }, { timestamps: true });
ProductSchema.index({ businessId: 1, slug: 1 }, { unique: true }); ProductSchema.plugin(softDeletePlugin);

const CustomerSchema = new Schema({ ...tenantField, name: { type: String, required: true }, email: { type: String, lowercase: true, trim: true }, phone: { type: String, index: true }, addresses: [{ line1: String, city: String, district: String, postalCode: String, country: { type: String, default: "BD" } }], tags: [String], ...auditFields }, { timestamps: true });
CustomerSchema.index({ businessId: 1, email: 1 }); CustomerSchema.plugin(softDeletePlugin);

const OrderSchema = new Schema({ ...tenantField, customerId: { type: objectId, ref: "Customer" }, orderNumber: { type: String, required: true, unique: true }, items: [{ productId: { type: objectId, ref: "Product" }, name: String, quantity: Number, unitPrice: Number, total: Number }], totals: { subtotal: Number, discount: Number, tax: Number, shipping: Number, grandTotal: Number }, status: { type: String, enum: ["pending", "confirmed", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"], default: "pending", index: true }, ...auditFields }, { timestamps: true });
OrderSchema.plugin(softDeletePlugin);

const PaymentSchema = new Schema({ ...tenantField, gateway: { type: String, enum: paymentGatewayKeys, required: true, index: true }, mode: { type: String, enum: ["sandbox", "live"], required: true }, purpose: { type: String, enum: ["subscription", "order", "booking"], required: true }, referenceId: { type: objectId, required: true }, amount: { type: Number, required: true }, currency: { type: String, default: "BDT" }, status: { type: String, enum: ["initiated", "authorized", "captured", "failed", "refunded"], default: "initiated", index: true }, transactionId: { type: String, index: true }, attempts: { type: Number, default: 0 }, webhookEvents: [{ receivedAt: Date, payload: Schema.Types.Mixed, signatureValid: Boolean }], ...auditFields }, { timestamps: true });
PaymentSchema.plugin(softDeletePlugin);

const DomainSchema = new Schema({ ...tenantField, hostname: { type: String, required: true, unique: true, lowercase: true }, type: { type: String, enum: ["subdomain", "custom"], required: true }, status: { type: String, enum: ["pending", "verified", "failed", "disabled"], default: "pending" }, dnsRecords: [{ type: String, name: String, value: String, verifiedAt: Date }], ssl: { status: String, expiresAt: Date }, ...auditFields }, { timestamps: true }); DomainSchema.plugin(softDeletePlugin);
const MediaSchema = new Schema({ ...tenantField, filename: String, mimeType: String, size: Number, storageKey: { type: String, required: true, unique: true }, url: String, alt: String, folder: String, ...auditFields }, { timestamps: true }); MediaSchema.plugin(softDeletePlugin);
const BookingSchema = new Schema({ ...tenantField, customerId: { type: objectId, ref: "Customer" }, serviceName: String, startsAt: { type: Date, required: true, index: true }, endsAt: Date, status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled", "no_show"], default: "pending" }, notes: String, ...auditFields }, { timestamps: true }); BookingSchema.plugin(softDeletePlugin);
const AIConversationSchema = new Schema({ ...tenantField, userId: { type: objectId, ref: "User", required: true }, intent: { type: String, required: true, index: true }, model: String, messages: [{ role: { type: String, enum: ["system", "user", "assistant", "tool"] }, content: String, metadata: Schema.Types.Mixed }], outputs: { type: Schema.Types.Mixed, default: {} }, tokenUsage: { prompt: Number, completion: Number, total: Number }, ...auditFields }, { timestamps: true }); AIConversationSchema.plugin(softDeletePlugin);
const AnalyticsSchema = new Schema({ ...tenantField, event: { type: String, required: true, index: true }, entityType: String, entityId: objectId, visitorId: String, properties: { type: Schema.Types.Mixed, default: {} }, occurredAt: { type: Date, required: true, index: true } }, { timestamps: true });
const NotificationSchema = new Schema({ ...tenantField, userId: { type: objectId, ref: "User", index: true }, channel: { type: String, enum: ["in_app", "email", "sms", "push"], required: true }, title: String, body: String, readAt: Date, deliveredAt: Date, metadata: Schema.Types.Mixed }, { timestamps: true }); NotificationSchema.plugin(softDeletePlugin);

export type User = InferSchemaType<typeof UserSchema>;
export const UserModel = (models.User as Model<User>) || model("User", UserSchema);
export const CategoryModel = models.Category || model("Category", CategorySchema);
export const BusinessModel = models.Business || model("Business", BusinessSchema);
export const SubscriptionPlanModel = models.SubscriptionPlan || model("SubscriptionPlan", SubscriptionPlanSchema);
export const SubscriptionModel = models.Subscription || model("Subscription", SubscriptionSchema);
export const TemplateModel = models.Template || model("Template", TemplateSchema);
export const WebsiteModel = models.Website || model("Website", WebsiteSchema);
export const PageModel = models.Page || model("Page", PageSchema);
export const ProductModel = models.Product || model("Product", ProductSchema);
export const CustomerModel = models.Customer || model("Customer", CustomerSchema);
export const OrderModel = models.Order || model("Order", OrderSchema);
export const PaymentModel = models.Payment || model("Payment", PaymentSchema);
export const DomainModel = models.Domain || model("Domain", DomainSchema);
export const MediaModel = models.Media || model("Media", MediaSchema);
export const BookingModel = models.Booking || model("Booking", BookingSchema);
export const AIConversationModel = models.AIConversation || model("AIConversation", AIConversationSchema);
export const AnalyticsModel = models.Analytics || model("Analytics", AnalyticsSchema);
export const NotificationModel = models.Notification || model("Notification", NotificationSchema);
