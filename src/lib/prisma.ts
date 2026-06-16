import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL ?? "";

  if (dbUrl.startsWith("libsql:") || dbUrl.startsWith("libsql+")) {
    // Turso / remote libSQL
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const adapter = new PrismaLibSql({
      url: dbUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  // Local: file-based SQLite (file:./dev.db)
  return new PrismaClient({ log: ["query"] });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
