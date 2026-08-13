/*
  Warnings:

  - Added the required column `primaryOpportunityKey` to the `KitchenCalculatorLead` table without a default value. This is not possible if the table is not empty.

*/
-- Add as nullable, backfill from the persisted maturity scores (same rule as
-- the landing engine: lowest score wins; ties go to the earlier key;
-- NULL scores are skipped), then tighten to NOT NULL.
ALTER TABLE "KitchenCalculatorLead" ADD COLUMN     "primaryOpportunityKey" TEXT;

UPDATE "KitchenCalculatorLead"
SET "primaryOpportunityKey" = (
  SELECT "key" FROM (
    SELECT 'planning' AS "key", "planningMaturityScore" AS "score", 0 AS "ord"
    UNION ALL SELECT 'forecasting', "forecastingMaturityScore", 1
    UNION ALL SELECT 'wasteVisibility', "wasteVisibilityScore", 2
    UNION ALL SELECT 'operationalVisibility', "operationalVisibilityScore", 3
  ) AS cand
  WHERE "score" IS NOT NULL
  ORDER BY "score", "ord"
  LIMIT 1
);

ALTER TABLE "KitchenCalculatorLead" ALTER COLUMN "primaryOpportunityKey" SET NOT NULL;
