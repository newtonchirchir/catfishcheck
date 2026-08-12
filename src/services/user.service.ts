import { prisma } from "../lib/prisma.js";

export async function ensureUser(userId: string) {
  return prisma.user.upsert({
    where: {
      id: userId,
    },
    update: {},
    create: {
      id: userId,
      email: `user-${userId}@catfishcheck.local`,
      name: null,
      passwordHash: "AUTH_SERVICE_MANAGED",
    },
  });
}
