import "server-only";

import PusherServer from "pusher";

import { env, hasPusherEnv } from "@/lib/env";

export const pusherServer = hasPusherEnv
  ? new PusherServer({
      appId: env.PUSHER_APP_ID,
      key: env.PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.PUSHER_CLUSTER,
      useTLS: true,
    })
  : null;
