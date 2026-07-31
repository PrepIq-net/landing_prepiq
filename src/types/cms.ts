export interface LocalizedString {
  en: string;
  fr: string;
}

export interface SectionContent<T> {
  en: T;
  fr: T;
}

export interface DbSection {
  id: string;
  componentType: string;
  contentJson: string;
  isActive: boolean;
  sortOrder: number;
}

// Specific Section Contents
export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  proof: {
    lessWaste: string;
    noStockouts: string;
    betterMargins: string;
  };
  ctaStart: string;
  ctaDemo: string;
  /**
   * Commitments and product behaviour, not outcome averages. We have not run
   * PrepIQ across enough kitchens to publish a waste or accuracy figure, so the
   * hero must not imply one.
   */
  stats: ProofFact[];
}

export interface PosSystem {
  name: string;
  status: "live" | "soon";
}

export interface IntegrationsContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  body: string;
  csvNote: string;
  posSystems: PosSystem[];
  tickerLabel: string;
}

export interface ProblemCard {
  title: string;
  result: string;
  desc: string;
  impact: string;
  impactLabel: string;
}

export interface PressureCard {
  title: string;
  desc: string;
  metric: string;
  metricLabel: string;
}

export interface CostOfGuessingContent {
  badge: string;
  title: string;
  subtitle: string;
  problems: ProblemCard[];
  pressures: PressureCard[];
  cta: string;
}

export interface HowItWorksContent {
  badge: string;
  title: string;
  subtitle: string;
  signalsTitle: string;
  signals: { label: string }[];
  phases: {
    plan: { label: string; time: string; desc: string; title: string; body: string };
    live: { label: string; time: string; desc: string; title: string; body: string };
    review: { label: string; time: string; desc: string; title: string; body: string };
  };
  chefOverride: { title: string; body: string; simulate: string; reset: string };
  liveFeatures: { title: string; desc: string }[];
  reviewFeatures: { title: string; desc: string }[];
  comparison: {
    badge: string;
    withoutLabel: string;
    withLabel: string;
    dailyMarginLost: string;
    dailyMarginRecovered: string;
  };
}

export interface IntelligenceSignal {
  label: string;
  desc: string;
}

export interface MarginAlert {
  type: string;
  detail: string;
  action: string;
}

export interface IntelligenceContent {
  badge: string;
  title: string;
  subtitle: string;
  signals: IntelligenceSignal[];
  footer: string;
  pipelineTitle: string;
  pipelineSteps: string[];
  alerts: MarginAlert[];
  atRiskLabel: string;
  suggestedLabel: string;
  leakTypes: string[];
  totalProtectionLabel: string;
  roiNote: string;
  whyBadge: string;
  whyPoints: { highlight: string; body: string }[];
  whyFooter: string;
}

export interface Persona {
  title: string;
  desc: string;
  stat: string;
}

export interface BranchScenario {
  problem: string;
  aiLearning: string;
  prevention: string;
  saved: string;
  tag: string;
}

export interface Branch {
  name: string;
  country: string;
  scenario: BranchScenario;
}

export interface GlobalFeature {
  label: string;
  desc: string;
}

export interface BuiltForScaleContent {
  badge: string;
  title: string;
  subtitle: string;
  personas: Persona[];
  networkTitle: string;
  networkSubtitle: string;
  sidebarTitle: string;
  /**
   * Multi-branch capabilities, not network averages. PrepIQ currently runs in a
   * single group of two kitchens — there is no network to average.
   */
  stats: ProofFact[];
  branches: Branch[];
  globalTitle: string;
  globalSubtitle: string;
  globalFeatures: GlobalFeature[];
  regions: string[];
}

export interface ValueContent {
  title: string;
  subtitle: string;
  metrics: {
    waste: { label: string; desc: string };
    revenue: { label: string; desc: string };
    saved: { label: string; desc: string };
  };
  calculator: {
    title: string;
    subtitle: string;
    inputLabel: string;
    monthlyRecovery: string;
    annualImpact: string;
    projection: string;
    breakdown: string;
    roiNote: string;
    categories: { waste: string; stockout: string; labor: string };
  };
}

/**
 * A verifiable claim shown under the testimonials — a commitment we control
 * (pilot length, data ownership) or a count we can actually stand behind, never
 * an aggregate outcome we have not measured.
 */
export interface ProofFact {
  value: string;
  label: string;
}

/**
 * Copy around the quotes only. There is no empty-state copy: with no published
 * testimonials the section is not rendered at all.
 */
export interface TestimonialsContent {
  badge: string;
  title: string;
  subtitle: string;
  facts: ProofFact[];
}

export interface PricingPlan {
  name: string;
  tagline: string;
  cta: string;
  features: string[];
}

export interface AddOn {
  name: string;
  desc: string;
}

export interface PricingContent {
  badge: string;
  title: string;
  subtitle: string;
  monthly: string;
  annual: string;
  /**
   * Fallback only. The rendered badge is computed from each plan's real
   * monthly/yearly prices (see PricingSection) so it cannot contradict them;
   * this authored string is used only when the plan catalog is unreachable.
   */
  save: string;
  perMonth: string;
  perYear: string;
  billedAnnually: string;
  billedMonthly: string;
  staff: string;
  mostPopular: string;
  footer: string;
  plans: {
    core: PricingPlan;
    intelligence: PricingPlan;
    command: PricingPlan;
  };
  addOns: {
    title: string;
    subtitle: string;
    items: AddOn[];
  };
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQContent {
  badge: string;
  title: string;
  subtitle: string;
  footer: string;
  items: FAQItem[];
}

export interface ContactInfoItem {
  label: string;
  value: string;
}

export interface ContactContent {
  getInTouch: string;
  title: string;
  subtitle: string;
  contactInfo: { email: string; phone: string; office: string };
  trustPoint: string;
  formHeader: string;
  optionalEmail: string;
  name: string;
  placeholderName: string;
  placeholderEmail: string;
  company: string;
  placeholderCompany: string;
  locations: string;
  message: string;
  placeholderMessage: string;
  sent: string;
  sentSubtitle: string;
  sending: string;
  send: string;
  noSpam: string;
}

export interface PageHeaderContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  icon?: string;
  stats?: { value: string; label: string }[];
}

export interface ExploreContent {
  badge: string;
  title: string;
  subtitle: string;
  items: { icon: string; title: string; desc: string; cta: string; href: string }[];
}

export interface FinalCTAContent {
  badge: string;
  title: string;
  subtitle: string;
  ctaStart: string;
  ctaDemo: string;
  proofs: string[];
}

export interface OperationsPillar {
  icon: string;
  phase: string;
  title: string;
  body: string;
  features: string[];
}

export interface OperationsContent {
  badge: string;
  title: string;
  subtitle: string;
  pillars: OperationsPillar[];
  footer: string;
}
