import "server-only";

import { prisma } from "@/lib/prisma";

export async function getUserBrandMembership(userId: string) {
  return prisma.brandMember.findFirst({
    where: { userId },
    include: { brand: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getUserBrandDashboardData(userId: string) {
  return prisma.brandMember.findFirst({
    where: { userId },
    include: {
      brand: {
        include: {
          events: {
            orderBy: { startsAt: "asc" },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}
