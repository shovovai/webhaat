import type { PaymentGatewayKey } from "@webbondhu/types";
export interface PaymentIntentInput { amount: number; currency: "BDT"; referenceId: string; callbackUrl: string; }
export interface PaymentIntent { gateway: PaymentGatewayKey; redirectUrl: string; transactionId: string; expiresAt: Date; }
export interface PaymentGatewayAdapter { key: PaymentGatewayKey; createIntent(input: PaymentIntentInput): Promise<PaymentIntent>; verifyWebhook(payload: unknown, signature?: string): Promise<boolean>; }
export class PaymentGatewayRegistry {
  private readonly adapters = new Map<PaymentGatewayKey, PaymentGatewayAdapter>();
  register(adapter: PaymentGatewayAdapter): void { this.adapters.set(adapter.key, adapter); }
  get(key: PaymentGatewayKey): PaymentGatewayAdapter { const adapter = this.adapters.get(key); if (!adapter) throw new Error(`Payment gateway is not enabled: ${key}`); return adapter; }
  enabled(): PaymentGatewayKey[] { return [...this.adapters.keys()]; }
}
