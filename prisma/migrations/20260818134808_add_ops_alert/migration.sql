-- CreateEnum
CREATE TYPE "OpsAlertType" AS ENUM ('POS_SYNC_FAILED', 'CONNECTOR_OFFLINE', 'CSV_STALE');

-- CreateEnum
CREATE TYPE "OpsAlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "OpsAlertStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateTable
CREATE TABLE "OpsAlert" (
    "id" TEXT NOT NULL,
    "refNo" SERIAL NOT NULL,
    "alertType" "OpsAlertType" NOT NULL,
    "severity" "OpsAlertSeverity" NOT NULL DEFAULT 'WARNING',
    "status" "OpsAlertStatus" NOT NULL DEFAULT 'NEW',
    "organizationId" TEXT,
    "organizationName" TEXT,
    "branchId" TEXT,
    "branchName" TEXT,
    "branchWasOpen" BOOLEAN,
    "branchLocalTime" TIMESTAMP(3),
    "payload" JSONB NOT NULL,
    "adminNotes" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "OpsAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpsAlert_refNo_key" ON "OpsAlert"("refNo");

-- CreateIndex
CREATE INDEX "OpsAlert_alertType_status_idx" ON "OpsAlert"("alertType", "status");

-- CreateIndex
CREATE INDEX "OpsAlert_createdAt_idx" ON "OpsAlert"("createdAt");

-- CreateIndex
CREATE INDEX "OpsAlert_organizationId_idx" ON "OpsAlert"("organizationId");
