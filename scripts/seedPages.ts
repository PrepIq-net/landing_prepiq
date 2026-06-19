import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const enPath = path.resolve(process.cwd(), "src/i18n/locales/en.json");
  const frPath = path.resolve(process.cwd(), "src/i18n/locales/fr.json");

  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"));

  // Helper to upsert a page and return it
  async function upsertPage(slug: string, titleEn: string, titleFr: string, sortOrder: number) {
    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      if (existing.titleEn !== titleEn || existing.titleFr !== titleFr || existing.sortOrder !== sortOrder) {
        return await prisma.page.update({
          where: { slug },
          data: { titleEn, titleFr, sortOrder },
        });
      }
      return existing;
    } else {
      return await prisma.page.create({
        data: { slug, titleEn, titleFr, sortOrder, isActive: true },
      });
    }
  }

  // 1. Create/Update Pages
  const homePage = await upsertPage("home", "Home", "Accueil", 0);
  await upsertPage("privacy-policy", "Privacy Policy", "Politique de Confidentialité", 1);
  await upsertPage("terms-of-service", "Terms of Service", "Conditions d'Utilisation", 2);
  await upsertPage("security", "Security", "Sécurité", 3);

  // 3. Define Sections for Home Page
  const sections = [
    { componentType: "HeroSection", titleEn: "Hero", titleFr: "Héros", contentJson: { en: en.hero, fr: fr.hero } },
    { componentType: "IntegrationsSection", titleEn: "Integrations", titleFr: "Intégrations", contentJson: { en: en.integrations, fr: fr.integrations } },
    { componentType: "KitchenTestSection", titleEn: "Kitchen Test", titleFr: "Test de cuisine", contentJson: { en: en.kitchenTest, fr: fr.kitchenTest } },
    { componentType: "AIThinkingSection", titleEn: "AI Thinking", titleFr: "Réflexion IA", contentJson: { en: en.aiThinking, fr: fr.aiThinking } },
    { componentType: "WhyPrepIQSection", titleEn: "Why PrepIQ", titleFr: "Pourquoi PrepIQ", contentJson: { en: en.whyPrepIQ, fr: fr.whyPrepIQ } },
    { componentType: "ProblemSection", titleEn: "Problem", titleFr: "Problème", contentJson: { en: en.problem, fr: fr.problem } },
    { componentType: "WhyNowSection", titleEn: "Why Now", titleFr: "Pourquoi maintenant", contentJson: { en: en.whyNow, fr: fr.whyNow } },
    { componentType: "HowItWorksSection", titleEn: "How It Works", titleFr: "Comment ça marche", contentJson: { en: en.howItWorks, fr: fr.howItWorks } },
    { componentType: "IntelligenceSection", titleEn: "Intelligence", titleFr: "Intelligence", contentJson: { en: en.intelligence, fr: fr.intelligence } },
    { componentType: "MarginGuardSection", titleEn: "Margin Guard", titleFr: "Margin Guard", contentJson: { en: en.marginGuard, fr: fr.marginGuard } },
    { componentType: "ValueSection", titleEn: "Value", titleFr: "Valeur", contentJson: { en: en.value, fr: fr.value } },
    { componentType: "WhoItsForSection", titleEn: "Who It's For", titleFr: "Pour qui", contentJson: { en: en.whoItsFor, fr: fr.whoItsFor } },
    { componentType: "InteractiveDemoSection", titleEn: "Interactive Demo", titleFr: "Démo interactive", contentJson: { en: en.interactiveDemo, fr: fr.interactiveDemo } },
    { componentType: "MultiBranchSection", titleEn: "Multi Branch", titleFr: "Multi-sites", contentJson: { en: en.multiBranch, fr: fr.multiBranch } },
    { componentType: "KitchenNetworkSection", titleEn: "Kitchen Network", titleFr: "Réseau de cuisines", contentJson: { en: en.kitchenNetwork, fr: fr.kitchenNetwork } },
    { componentType: "GlobalReadySection", titleEn: "Global Ready", titleFr: "Prêt pour l'international", contentJson: { en: en.globalReady, fr: fr.globalReady } },
    { componentType: "TestimonialsSection", titleEn: "Testimonials", titleFr: "Témoignages", contentJson: { en: en.testimonials, fr: fr.testimonials } },
    { componentType: "PricingSection", titleEn: "Pricing", titleFr: "Tarifs", contentJson: { en: en.pricing, fr: fr.pricing } },
    { componentType: "FAQSection", titleEn: "FAQ", titleFr: "FAQ", contentJson: { en: en.faq, fr: fr.faq } },
    { componentType: "ContactSection", titleEn: "Contact", titleFr: "Contact", contentJson: { en: en.contact, fr: fr.contact } },
    { componentType: "FinalCTASection", titleEn: "Final CTA", titleFr: "Appel à l'action final", contentJson: { en: en.finalCTA, fr: fr.finalCTA } },
  ];

  // Get current sections to avoid unnecessary updates
  const currentSections = await prisma.section.findMany({
    where: { pageId: homePage.id },
    orderBy: { sortOrder: "asc" },
  });

  // Idempotent section updates
  for (let i = 0; i < sections.length; i++) {
    const sectionData = {
      ...sections[i],
      pageId: homePage.id,
      sortOrder: i,
      isActive: true,
    };

    const existing = currentSections.find(s => s.componentType === sectionData.componentType);

    if (existing) {
      // For JSON comparison, we can use stringify or deep equal. Since it's a seed, stringify is usually enough for data from files.
      const existingContentStr = JSON.stringify(existing.contentJson);
      const newContentStr = JSON.stringify(sectionData.contentJson);

      if (
        existing.titleEn !== sectionData.titleEn ||
        existing.titleFr !== sectionData.titleFr ||
        existingContentStr !== newContentStr ||
        existing.sortOrder !== sectionData.sortOrder
      ) {
        await prisma.section.update({
          where: { id: existing.id },
          data: sectionData as any,
        });
      }
    } else {
      await prisma.section.create({
        data: sectionData as any,
      });
    }
  }

  // Remove sections that are no longer in the seed
  const seedComponentTypes = sections.map(s => s.componentType);
  const sectionsToRemove = currentSections.filter(s => !seedComponentTypes.includes(s.componentType));
  if (sectionsToRemove.length > 0) {
    await prisma.section.deleteMany({
      where: { id: { in: sectionsToRemove.map(s => s.id) } },
    });
  }

  // 4. Navigation Links
  const navLinks = [
    { labelEn: en.navbar.howItWorks, labelFr: fr.navbar.howItWorks, url: "#how-it-works", sortOrder: 0 },
    { labelEn: en.navbar.intelligence, labelFr: fr.navbar.intelligence, url: "#intelligence", sortOrder: 1 },
    { labelEn: en.navbar.pricing, labelFr: fr.navbar.pricing, url: "#pricing", sortOrder: 2 },
    { labelEn: en.navbar.integrations, labelFr: fr.navbar.integrations, url: "#integrations", sortOrder: 3 },
  ];

  const currentNavLinks = await prisma.link.findMany({ where: { type: "nav" } });
  for (const link of navLinks) {
    const existing = currentNavLinks.find(l => l.url === link.url);
    const data = { ...link, type: "nav", isActive: true };
    if (existing) {
      if (existing.labelEn !== link.labelEn || existing.labelFr !== link.labelFr || existing.sortOrder !== link.sortOrder) {
        await prisma.link.update({ where: { id: existing.id }, data });
      }
    } else {
      await prisma.link.create({ data });
    }
  }
  // Cleanup old nav links
  const seedNavUrls = navLinks.map(l => l.url);
  await prisma.link.deleteMany({
    where: { type: "nav", url: { notIn: seedNavUrls } }
  });

  // 5. Footer Links
  const footerLinks = [
    { labelEn: en.footer.links.about, labelFr: fr.footer.links.about, url: "#", category: "product", sortOrder: 0 },
    { labelEn: en.footer.links.blog, labelFr: fr.footer.links.blog, url: "#", category: "product", sortOrder: 1 },
    { labelEn: en.footer.links.careers, labelFr: fr.footer.links.careers, url: "#", category: "company", sortOrder: 0 },
    { labelEn: en.footer.links.contact, labelFr: fr.footer.links.contact, url: "#contact", category: "company", sortOrder: 1 },
    { labelEn: en.footer.links.privacy, labelFr: fr.footer.links.privacy, url: "/privacy-policy", category: "legal", sortOrder: 0 },
    { labelEn: en.footer.links.terms, labelFr: fr.footer.links.terms, url: "/terms-of-service", category: "legal", sortOrder: 1 },
    { labelEn: en.footer.links.security, labelFr: fr.footer.links.security, url: "/security", category: "legal", sortOrder: 2 },
  ];

  const currentFooterLinks = await prisma.link.findMany({ where: { type: "footer" } });
  for (const link of footerLinks) {
    const existing = currentFooterLinks.find(l => l.url === link.url && l.category === link.category);
    const data = { ...link, type: "footer", isActive: true };
    if (existing) {
      if (existing.labelEn !== link.labelEn || existing.labelFr !== link.labelFr || existing.sortOrder !== link.sortOrder) {
        await prisma.link.update({ where: { id: existing.id }, data });
      }
    } else {
      await prisma.link.create({ data });
    }
  }
  // Cleanup old footer links
  const seedFooterUrls = footerLinks.map(l => l.url);
  await prisma.link.deleteMany({
    where: { type: "footer", url: { notIn: seedFooterUrls } }
  });

  console.log("Database seeded with pages, sections and links (idempotent).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
