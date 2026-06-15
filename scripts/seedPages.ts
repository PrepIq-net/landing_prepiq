import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const enPath = path.resolve(process.cwd(), "src/i18n/locales/en.json");
  const frPath = path.resolve(process.cwd(), "src/i18n/locales/fr.json");

  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"));

  // 1. Create Home Page
  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      titleEn: "Home",
      titleFr: "Accueil",
      isActive: true,
      sortOrder: 0,
    },
  });

  // 2. Create Legal Pages
  await prisma.page.upsert({
    where: { slug: "privacy-policy" },
    update: {},
    create: { slug: "privacy-policy", titleEn: "Privacy Policy", titleFr: "Politique de Confidentialité", isActive: true, sortOrder: 1 },
  });
  await prisma.page.upsert({
    where: { slug: "terms-of-service" },
    update: {},
    create: { slug: "terms-of-service", titleEn: "Terms of Service", titleFr: "Conditions d'Utilisation", isActive: true, sortOrder: 2 },
  });
  await prisma.page.upsert({
    where: { slug: "security" },
    update: {},
    create: { slug: "security", titleEn: "Security", titleFr: "Sécurité", isActive: true, sortOrder: 3 },
  });

  // 3. Define Sections for Home Page
  const sections = [
    { componentType: "HeroSection", titleEn: "Hero", titleFr: "Héros", contentJson: JSON.stringify({ en: en.hero, fr: fr.hero }) },
    { componentType: "IntegrationsSection", titleEn: "Integrations", titleFr: "Intégrations", contentJson: JSON.stringify({ en: en.integrations, fr: fr.integrations }) },
    { componentType: "KitchenTestSection", titleEn: "Kitchen Test", titleFr: "Test de cuisine", contentJson: JSON.stringify({ en: en.kitchenTest, fr: fr.kitchenTest }) },
    { componentType: "AIThinkingSection", titleEn: "AI Thinking", titleFr: "Réflexion IA", contentJson: JSON.stringify({ en: en.aiThinking, fr: fr.aiThinking }) },
    { componentType: "WhyPrepIQSection", titleEn: "Why PrepIQ", titleFr: "Pourquoi PrepIQ", contentJson: JSON.stringify({ en: en.whyPrepIQ, fr: fr.whyPrepIQ }) },
    { componentType: "ProblemSection", titleEn: "Problem", titleFr: "Problème", contentJson: JSON.stringify({ en: en.problem, fr: fr.problem }) },
    { componentType: "WhyNowSection", titleEn: "Why Now", titleFr: "Pourquoi maintenant", contentJson: JSON.stringify({ en: en.whyNow, fr: fr.whyNow }) },
    { componentType: "HowItWorksSection", titleEn: "How It Works", titleFr: "Comment ça marche", contentJson: JSON.stringify({ en: en.howItWorks, fr: fr.howItWorks }) },
    { componentType: "IntelligenceSection", titleEn: "Intelligence", titleFr: "Intelligence", contentJson: JSON.stringify({ en: en.intelligence, fr: fr.intelligence }) },
    { componentType: "MarginGuardSection", titleEn: "Margin Guard", titleFr: "Margin Guard", contentJson: JSON.stringify({ en: en.marginGuard, fr: fr.marginGuard }) },
    { componentType: "ValueSection", titleEn: "Value", titleFr: "Valeur", contentJson: JSON.stringify({ en: en.value, fr: fr.value }) },
    { componentType: "WhoItsForSection", titleEn: "Who It's For", titleFr: "Pour qui", contentJson: JSON.stringify({ en: en.whoItsFor, fr: fr.whoItsFor }) },
    { componentType: "InteractiveDemoSection", titleEn: "Interactive Demo", titleFr: "Démo interactive", contentJson: JSON.stringify({ en: en.interactiveDemo, fr: fr.interactiveDemo }) },
    { componentType: "MultiBranchSection", titleEn: "Multi Branch", titleFr: "Multi-sites", contentJson: JSON.stringify({ en: en.multiBranch, fr: fr.multiBranch }) },
    { componentType: "KitchenNetworkSection", titleEn: "Kitchen Network", titleFr: "Réseau de cuisines", contentJson: JSON.stringify({ en: en.kitchenNetwork, fr: fr.kitchenNetwork }) },
    { componentType: "GlobalReadySection", titleEn: "Global Ready", titleFr: "Prêt pour l'international", contentJson: JSON.stringify({ en: en.globalReady, fr: fr.globalReady }) },
    { componentType: "TestimonialsSection", titleEn: "Testimonials", titleFr: "Témoignages", contentJson: JSON.stringify({ en: en.testimonials, fr: fr.testimonials }) },
    { componentType: "PricingSection", titleEn: "Pricing", titleFr: "Tarifs", contentJson: JSON.stringify({ en: en.pricing, fr: fr.pricing }) },
    { componentType: "FAQSection", titleEn: "FAQ", titleFr: "FAQ", contentJson: JSON.stringify({ en: en.faq, fr: fr.faq }) },
    { componentType: "ContactSection", titleEn: "Contact", titleFr: "Contact", contentJson: JSON.stringify({ en: en.contact, fr: fr.contact }) },
    { componentType: "FinalCTASection", titleEn: "Final CTA", titleFr: "Appel à l'action final", contentJson: JSON.stringify({ en: en.finalCTA, fr: fr.finalCTA }) },
  ];

  await prisma.section.deleteMany({ where: { pageId: homePage.id } });

  for (let i = 0; i < sections.length; i++) {
    await prisma.section.create({
      data: {
        ...sections[i],
        pageId: homePage.id,
        sortOrder: i,
        isActive: true,
      },
    });
  }

  // 4. Navigation Links
  const navLinks = [
    { labelEn: en.navbar.howItWorks, labelFr: fr.navbar.howItWorks, url: "#how-it-works", sortOrder: 0 },
    { labelEn: en.navbar.intelligence, labelFr: fr.navbar.intelligence, url: "#intelligence", sortOrder: 1 },
    { labelEn: en.navbar.pricing, labelFr: fr.navbar.pricing, url: "#pricing", sortOrder: 2 },
    { labelEn: en.navbar.integrations, labelFr: fr.navbar.integrations, url: "#integrations", sortOrder: 3 },
  ];

  await prisma.link.deleteMany({ where: { type: "nav" } });
  for (const link of navLinks) {
    await prisma.link.create({
      data: {
        ...link,
        type: "nav",
        isActive: true,
      },
    });
  }

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

  await prisma.link.deleteMany({ where: { type: "footer" } });
  for (const link of footerLinks) {
    await prisma.link.create({
      data: {
        ...link,
        type: "footer",
        isActive: true,
      },
    });
  }

  console.log("Database seeded with pages, sections and links.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
