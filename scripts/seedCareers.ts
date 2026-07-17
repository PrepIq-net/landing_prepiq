import { PrismaClient, EmploymentType } from "@prisma/client";

const prisma = new PrismaClient();

/* -------------------------------------------------------------------------- */
/*  Navigation + footer links                                                  */
/* -------------------------------------------------------------------------- */

async function upsertLink(
  match: { type: string; labelEn: string; category?: string | null },
  data: {
    labelEn: string;
    labelFr: string;
    url: string;
    type: string;
    category?: string | null;
    sortOrder: number;
  }
) {
  const existing = await prisma.link.findFirst({
    where: {
      type: match.type,
      labelEn: match.labelEn,
      ...(match.category !== undefined ? { category: match.category } : {}),
    },
  });
  if (existing) {
    await prisma.link.update({ where: { id: existing.id }, data });
    console.log(`= updated ${data.type} link "${data.labelEn}" -> ${data.url}`);
  } else {
    await prisma.link.create({ data: { ...data, isActive: true } });
    console.log(`+ created ${data.type} link "${data.labelEn}" -> ${data.url}`);
  }
}

async function seedLinks() {
  // Nav: add "About". Place it before Contact by nudging Contact's order.
  await upsertLink(
    { type: "nav", labelEn: "About" },
    { labelEn: "About", labelFr: "À propos", url: "/about", type: "nav", sortOrder: 2 }
  );
  const contactNav = await prisma.link.findFirst({
    where: { type: "nav", labelEn: "Contact" },
  });
  if (contactNav && contactNav.sortOrder < 3) {
    await prisma.link.update({ where: { id: contactNav.id }, data: { sortOrder: 3 } });
  }

  // Footer: point the existing company "About" / "Careers" links at /about.
  await upsertLink(
    { type: "footer", labelEn: "About", category: "company" },
    { labelEn: "About", labelFr: "À propos", url: "/about", type: "footer", category: "company", sortOrder: 0 }
  );
  await upsertLink(
    { type: "footer", labelEn: "Careers", category: "company" },
    { labelEn: "Careers", labelFr: "Carrières", url: "/about#careers", type: "footer", category: "company", sortOrder: 1 }
  );
}

/* -------------------------------------------------------------------------- */
/*  Sample roles                                                               */
/* -------------------------------------------------------------------------- */

interface RoleSeed {
  slug: string;
  titleEn: string;
  titleFr: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  summaryEn: string;
  summaryFr: string;
  bodyEn: string;
  bodyFr: string;
  sortOrder: number;
}

const ROLES: RoleSeed[] = [
  {
    slug: "senior-backend-engineer",
    titleEn: "Senior Backend Engineer",
    titleFr: "Ingénieur·e Backend Senior",
    department: "Engineering",
    location: "Remote",
    employmentType: "FULL_TIME",
    summaryEn: "Own the services and data pipelines behind PrepIQ's forecasting and operations platform.",
    summaryFr: "Prenez en charge les services et pipelines de données derrière la plateforme de prévision et d'opérations de PrepIQ.",
    bodyEn: `## About the role

We're looking for a backend engineer who enjoys building reliable systems that turn messy kitchen data into clear daily decisions.

## What you'll do

- Design and own Django/Python services powering forecasting, planning and inventory
- Build resilient data pipelines from POS and connector integrations
- Shape our data models as the product expands into labor and purchasing
- Care about correctness, observability and performance

## What we're looking for

- 5+ years building production backend systems
- Strong Python and relational database (PostgreSQL) experience
- Comfortable with async jobs, queues and API design
- Bonus: exposure to ML systems or time-series data

## Why PrepIQ

You'll work close to the product and real kitchens, with a small team that ships quickly and owns outcomes end to end.`,
    bodyFr: `## À propos du poste

Nous recherchons un·e ingénieur·e backend qui aime construire des systèmes fiables transformant des données de cuisine désordonnées en décisions quotidiennes claires.

## Ce que vous ferez

- Concevoir et gérer des services Django/Python pour la prévision, la planification et les stocks
- Construire des pipelines de données résilients depuis les POS et connecteurs
- Faire évoluer nos modèles de données à mesure que le produit s'étend
- Vous soucier de la justesse, de l'observabilité et de la performance

## Ce que nous recherchons

- 5+ ans à construire des systèmes backend en production
- Solide expérience Python et base de données relationnelle (PostgreSQL)
- À l'aise avec les tâches asynchrones, les files et la conception d'API
- Bonus : exposition aux systèmes ML ou aux séries temporelles

## Pourquoi PrepIQ

Vous travaillerez au plus près du produit et de vraies cuisines, dans une petite équipe qui livre vite et assume ses résultats.`,
    sortOrder: 0,
  },
  {
    slug: "machine-learning-engineer",
    titleEn: "Machine Learning Engineer",
    titleFr: "Ingénieur·e en Machine Learning",
    department: "Engineering",
    location: "Remote",
    employmentType: "FULL_TIME",
    summaryEn: "Improve the demand forecasting models that tell kitchens exactly what to prepare.",
    summaryFr: "Améliorez les modèles de prévision de la demande qui indiquent aux cuisines exactement quoi préparer.",
    bodyEn: `## About the role

Forecasting is the heart of PrepIQ. You'll own the models that predict demand across menus, branches and seasons.

## What you'll do

- Develop and evaluate time-series and demand forecasting models
- Turn signals — weather, events, holidays — into better predictions
- Build the training and retraining pipelines that keep models fresh
- Partner with backend and product to ship models that hold up in real kitchens

## What we're looking for

- Strong applied ML background, ideally with forecasting or time-series
- Solid Python and data tooling
- Pragmatism: you optimise for real operational impact, not leaderboard scores

## Why PrepIQ

Your models directly change how much food gets prepared — and wasted — every day.`,
    bodyFr: `## À propos du poste

La prévision est le cœur de PrepIQ. Vous serez responsable des modèles qui prédisent la demande selon les menus, les établissements et les saisons.

## Ce que vous ferez

- Développer et évaluer des modèles de séries temporelles et de prévision de la demande
- Transformer des signaux — météo, événements, jours fériés — en meilleures prédictions
- Construire les pipelines d'entraînement qui gardent les modèles à jour
- Collaborer avec le backend et le produit pour livrer des modèles fiables

## Ce que nous recherchons

- Solide expérience en ML appliqué, idéalement en prévision ou séries temporelles
- Bon niveau Python et outils de données
- Pragmatisme : vous optimisez l'impact opérationnel réel

## Pourquoi PrepIQ

Vos modèles changent directement la quantité de nourriture préparée — et gaspillée — chaque jour.`,
    sortOrder: 1,
  },
  {
    slug: "product-designer",
    titleEn: "Product Designer",
    titleFr: "Designer Produit",
    department: "Design",
    location: "Kampala, Uganda / Remote",
    employmentType: "FULL_TIME",
    summaryEn: "Design calm, decisive interfaces that busy kitchen teams can trust during service.",
    summaryFr: "Concevez des interfaces claires et décisives auxquelles les équipes de cuisine peuvent se fier en plein service.",
    bodyEn: `## About the role

We turn complex operational data into simple daily actions. As our product designer, you'll make that feel effortless.

## What you'll do

- Own end-to-end design across web and mobile
- Design flows that work under pressure — during a busy service, not just in a demo
- Build and maintain our design system
- Talk to real chefs and operators and translate what you learn

## What we're looking for

- A strong portfolio of shipped product work
- Comfort with data-dense interfaces and clear information hierarchy
- Fluency in Figma and a good sense for motion and detail

## Why PrepIQ

Design has an outsized impact here — the right interface is the difference between a team that trusts the system and one that ignores it.`,
    bodyFr: `## À propos du poste

Nous transformons des données opérationnelles complexes en actions quotidiennes simples. En tant que designer produit, vous rendrez cela naturel.

## Ce que vous ferez

- Gérer le design de bout en bout sur le web et le mobile
- Concevoir des parcours qui fonctionnent sous pression — en plein service
- Construire et maintenir notre design system
- Échanger avec de vrais chefs et opérateurs

## Ce que nous recherchons

- Un solide portfolio de produits livrés
- De l'aisance avec les interfaces riches en données
- Maîtrise de Figma et un bon sens du détail et du mouvement

## Pourquoi PrepIQ

Le design a un impact démesuré ici — la bonne interface fait la différence entre une équipe qui fait confiance au système et une qui l'ignore.`,
    sortOrder: 2,
  },
];

async function seedRoles() {
  for (const role of ROLES) {
    const existing = await prisma.jobRole.findUnique({ where: { slug: role.slug } });
    if (existing) {
      console.log(`= role ${role.slug} already exists, skipping`);
      continue;
    }
    await prisma.jobRole.create({ data: { ...role, isPublished: true } });
    console.log(`+ created role ${role.slug}`);
  }
}

async function main() {
  await seedLinks();
  await seedRoles();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
