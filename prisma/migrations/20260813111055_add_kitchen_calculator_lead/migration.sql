-- AlterEnum
ALTER TYPE "EntityType" ADD VALUE 'KITCHEN_CALCULATOR_LEAD';

-- CreateTable
CREATE TABLE "KitchenCalculatorLead" (
    "id" TEXT NOT NULL,
    "refNo" SERIAL NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "visitorId" TEXT,
    "weeklyRevenuePerLocation" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "locations" INTEGER NOT NULL,
    "operatingDays" INTEGER NOT NULL,
    "planningMethod" TEXT NOT NULL,
    "wasteEstimate" TEXT,
    "stockoutFrequency" TEXT,
    "email" TEXT NOT NULL,
    "restaurantName" TEXT,
    "weeklyNetworkRevenue" DOUBLE PRECISION NOT NULL,
    "annualRevenue" DOUBLE PRECISION NOT NULL,
    "wasteExposureLow" DOUBLE PRECISION NOT NULL,
    "wasteExposureHigh" DOUBLE PRECISION NOT NULL,
    "stockoutExposureLow" DOUBLE PRECISION NOT NULL,
    "stockoutExposureHigh" DOUBLE PRECISION NOT NULL,
    "annualImpactLow" DOUBLE PRECISION NOT NULL,
    "annualImpactHigh" DOUBLE PRECISION NOT NULL,
    "forecastUncertaintyLow" DOUBLE PRECISION NOT NULL,
    "forecastUncertaintyHigh" DOUBLE PRECISION NOT NULL,
    "intelligenceScore" INTEGER NOT NULL,
    "planningMaturityScore" INTEGER NOT NULL,
    "forecastingMaturityScore" INTEGER NOT NULL,
    "wasteVisibilityScore" INTEGER NOT NULL,
    "operationalVisibilityScore" INTEGER NOT NULL,
    "primaryOpportunity" TEXT NOT NULL,
    "explanation" TEXT,
    "explanationMeta" JSONB,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "handledBy" TEXT,
    "handledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "meta" JSONB,

    CONSTRAINT "KitchenCalculatorLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KitchenCalculatorLead_refNo_key" ON "KitchenCalculatorLead"("refNo");

-- CreateIndex
CREATE INDEX "KitchenCalculatorLead_createdAt_idx" ON "KitchenCalculatorLead"("createdAt");

-- CreateIndex
CREATE INDEX "KitchenCalculatorLead_email_idx" ON "KitchenCalculatorLead"("email");
