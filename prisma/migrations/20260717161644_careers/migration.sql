-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'REVIEWING', 'INTERVIEWING', 'OFFER', 'HIRED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EntityType" ADD VALUE 'JOB_ROLE';
ALTER TYPE "EntityType" ADD VALUE 'JOB_APPLICATION';

-- CreateTable
CREATE TABLE "JobRole" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "summaryEn" TEXT NOT NULL,
    "summaryFr" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyFr" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "refNo" SERIAL NOT NULL,
    "roleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "coverNote" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobRole_slug_key" ON "JobRole"("slug");

-- CreateIndex
CREATE INDEX "JobRole_isPublished_sortOrder_idx" ON "JobRole"("isPublished", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_refNo_key" ON "JobApplication"("refNo");

-- CreateIndex
CREATE INDEX "JobApplication_roleId_status_idx" ON "JobApplication"("roleId", "status");

-- CreateIndex
CREATE INDEX "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "JobRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
