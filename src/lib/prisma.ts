import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  // Local dev: use the file-based SQLite DB
  if (process.env.NODE_ENV !== "production" && !process.env.TURSO_DATABASE_URL) {
    return new PrismaClient({ log: ["query"] });
  }

  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
