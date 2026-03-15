import "server-only";

import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().default(""),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().default(""),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  TIKTOK_CLIENT_KEY: z.string().default(""),
  TIKTOK_CLIENT_SECRET: z.string().default(""),
  PUSHER_APP_ID: z.string().default(""),
  PUSHER_KEY: z.string().default(""),
  PUSHER_SECRET: z.string().default(""),
  PUSHER_CLUSTER: z.string().default(""),
  STRIPE_SECRET_KEY: z.string().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().default(""),
  NEXT_PUBLIC_PUSHER_KEY: z.string().default(""),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string().default(""),
  NEXT_PUBLIC_STRIPE_PRICE_ID: z.string().default(""),
  RESEND_API_KEY: z.string().default(""),
  EMAIL_FROM: z.string().default(""),
});

export const env = serverSchema.parse(process.env);

export const hasAuthEnv =
  Boolean(env.NEXTAUTH_SECRET) &&
  Boolean(env.GOOGLE_CLIENT_ID) &&
  Boolean(env.GOOGLE_CLIENT_SECRET);

export const hasEmailAuthEnv =
  Boolean(env.NEXTAUTH_SECRET) &&
  Boolean(env.RESEND_API_KEY) &&
  Boolean(env.EMAIL_FROM);

export const hasTikTokAuthEnv =
  Boolean(env.NEXTAUTH_SECRET) &&
  Boolean(env.TIKTOK_CLIENT_KEY) &&
  Boolean(env.TIKTOK_CLIENT_SECRET);

export const hasPusherEnv =
  Boolean(env.PUSHER_APP_ID) &&
  Boolean(env.PUSHER_KEY) &&
  Boolean(env.PUSHER_SECRET) &&
  Boolean(env.PUSHER_CLUSTER) &&
  Boolean(env.NEXT_PUBLIC_PUSHER_KEY) &&
  Boolean(env.NEXT_PUBLIC_PUSHER_CLUSTER);

export const hasStripeEnv = Boolean(env.STRIPE_SECRET_KEY);
