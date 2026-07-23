-- CreateEnum
CREATE TYPE "ConciergeMessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateTable
CREATE TABLE "ConciergeConversation" (
    "id" TEXT NOT NULL,
    "refNo" SERIAL NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "visitorId" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "startedPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "meta" JSONB,

    CONSTRAINT "ConciergeConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConciergeMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "ConciergeMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "ConciergeMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConciergeLead" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "restaurantName" TEXT,
    "location" TEXT,
    "role" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "ConciergeLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConciergeConversation_refNo_key" ON "ConciergeConversation"("refNo");

-- CreateIndex
CREATE INDEX "ConciergeConversation_updatedAt_idx" ON "ConciergeConversation"("updatedAt");

-- CreateIndex
CREATE INDEX "ConciergeConversation_visitorId_idx" ON "ConciergeConversation"("visitorId");

-- CreateIndex
CREATE INDEX "ConciergeMessage_conversationId_createdAt_idx" ON "ConciergeMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ConciergeLead_conversationId_key" ON "ConciergeLead"("conversationId");

-- AddForeignKey
ALTER TABLE "ConciergeMessage" ADD CONSTRAINT "ConciergeMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ConciergeConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConciergeLead" ADD CONSTRAINT "ConciergeLead_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ConciergeConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
