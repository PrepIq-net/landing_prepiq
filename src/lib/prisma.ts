import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;

  if (tursoUrl) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  // Local dev fallback: file-based SQLite
  return new PrismaClient({ log: ["query"] });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
