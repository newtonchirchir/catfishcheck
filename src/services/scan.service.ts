import { prisma } from "../lib/prisma.js";

export async function createScan(userId: string, imageUrl: string) {
  return prisma.scan.create({
    data: {
      userId,
      imageUrl,
    },
  });
}

export async function getScanById(id: string, userId: string) {
  return prisma.scan.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function getUserScans(userId: string) {
  return prisma.scan.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
