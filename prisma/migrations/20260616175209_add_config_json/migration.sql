-- AlterTable
ALTER TABLE "Page" ADD COLUMN "configJson" TEXT DEFAULT '{}';

-- AlterTable
ALTER TABLE "Section" ADD COLUMN "styleJson" TEXT DEFAULT '{}';

-- CreateIndex
CREATE INDEX "Page_isActive_idx" ON "Page"("isActive");

-- CreateIndex
CREATE INDEX "Page_slug_isActive_idx" ON "Page"("slug", "isActive");

-- CreateIndex
CREATE INDEX "Section_pageId_isActive_sortOrder_idx" ON "Section"("pageId", "isActive", "sortOrder");
