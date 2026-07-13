-- CreateEnum
CREATE TYPE "SupportRequestType" AS ENUM ('BUG', 'FEATURE_REQUEST', 'INQUIRY', 'FEEDBACK');

-- CreateEnum
CREATE TYPE "SupportRequestStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterEnum
ALTER TYPE "EntityType" ADD VALUE 'SUPPORT_REQUEST';

-- CreateTable
CREATE TABLE "SupportRequest" (
    "id" TEXT NOT NULL,
    "refNo" SERIAL NOT NULL,
    "type" "SupportRequestType" NOT NULL,
    "status" "SupportRequestStatus" NOT NULL DEFAULT 'NEW',
    "priority" "SupportPriority" NOT NULL DEFAULT 'MEDIUM',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "contactEmail" TEXT,
    "reporterEmail" TEXT NOT NULL,
    "reporterName" TEXT,
    "reporterUserId" TEXT,
    "reporterRole" TEXT,
    "organizationId" TEXT,
    "organizationName" TEXT,
    "branchId" TEXT,
    "branchName" TEXT,
    "sourceApp" TEXT NOT NULL DEFAULT 'web_dashboard',
    "appVersion" TEXT,
    "currentUrl" TEXT,
    "userAgent" TEXT,
    "locale" TEXT,
    "adminNotes" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SupportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportAttachment" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL DEFAULT 'image',
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "format" TEXT,
    "bytes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportVote" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "voterEmail" TEXT NOT NULL,
    "voterName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportRequest_refNo_key" ON "SupportRequest"("refNo");

-- CreateIndex
CREATE INDEX "SupportRequest_type_status_idx" ON "SupportRequest"("type", "status");

-- CreateIndex
CREATE INDEX "SupportRequest_createdAt_idx" ON "SupportRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SupportAttachment_publicId_key" ON "SupportAttachment"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportVote_requestId_voterEmail_key" ON "SupportVote"("requestId", "voterEmail");

-- AddForeignKey
ALTER TABLE "SupportAttachment" ADD CONSTRAINT "SupportAttachment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "SupportRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportVote" ADD CONSTRAINT "SupportVote_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "SupportRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Human-friendly references start at PIQ-1000.
ALTER SEQUENCE "SupportRequest_refNo_seq" RESTART WITH 1000;
