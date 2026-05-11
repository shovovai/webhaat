import { Queue } from "bullmq";
import { redis } from "../lib/redis";
export const aiGenerationQueue = new Queue("ai-generation", { connection: redis });
export const paymentRetryQueue = new Queue("payment-retry", { connection: redis });
export const notificationQueue = new Queue("notification", { connection: redis });
