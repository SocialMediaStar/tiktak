import "server-only";

import { prisma } from "@/lib/prisma";

export async function getUserBrandMembership(userId: string) {
  return prisma.brandMember.findFirst({
    where: { userId },
    include: { brand: true },
    orderBy: { createdAt: "asc" },
  });
}
