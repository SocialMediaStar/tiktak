import Stripe from "stripe";

import { env, hasStripeEnv } from "@/lib/env";

export const stripe = hasStripeEnv
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    })
  : null;
