import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // In production, use PostgreSQL via DATABASE_URL
  if (process.env.DATABASE_URL) {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query"] : undefined,
    });
  }

  // In development, also use PostgreSQL (no SQLite)
  return new PrismaClient({
    log: ["query"],
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
