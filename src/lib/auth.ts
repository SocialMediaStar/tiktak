import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

import { env, hasAuthEnv, hasEmailAuthEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { sendAuthEmail } from "@/lib/send-auth-email";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  providers: [
    ...(hasEmailAuthEnv
      ? [
          EmailProvider({
            server: {
              host: "localhost",
              port: 25,
              auth: {
                user: "",
                pass: "",
              },
            },
            from: env.EMAIL_FROM,
            sendVerificationRequest: sendAuthEmail,
          }),
        ]
      : []),
    ...(hasAuthEnv
      ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
      : []),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  pages: {
    verifyRequest: "/verify-request",
    error: "/auth/error",
  },
};
