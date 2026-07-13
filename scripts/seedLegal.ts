import { PrismaClient } from "@prisma/client";
import { LEGAL_SEED_DOCS } from "./legal-content";

const prisma = new PrismaClient();

// Idempotent: existing documents are left untouched so admin edits are
// never clobbered by a re-run. Only missing slugs are created.
async function main() {
  for (const doc of LEGAL_SEED_DOCS) {
    const existing = await prisma.legalDocument.findUnique({
      where: { slug: doc.slug },
      select: { id: true, version: true },
    });
    if (existing) {
      console.log(`= ${doc.slug} already exists (v${existing.version}), skipping`);
      continue;
    }

    const created = await prisma.legalDocument.create({
      data: {
        slug: doc.slug,
        titleEn: doc.titleEn,
        titleFr: doc.titleFr,
        bodyEn: doc.bodyEn,
        bodyFr: doc.bodyFr,
        version: 1,
        effectiveDate: doc.effectiveDate,
        isPublished: true,
        versions: {
          create: {
            version: 1,
            titleEn: doc.titleEn,
            titleFr: doc.titleFr,
            bodyEn: doc.bodyEn,
            bodyFr: doc.bodyFr,
            effectiveDate: doc.effectiveDate,
            publishedBy: "seed",
          },
        },
      },
    });
    console.log(`+ created ${created.slug} (v1)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
