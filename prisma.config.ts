import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // In production, use Turso URL; in dev, use local SQLite file
    url: process.env.TURSO_DATABASE_URL || "file:./dev.db",
  },
});
