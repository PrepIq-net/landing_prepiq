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
  stats: {
    accuracy: string;
    waste: string;
    stockouts: string;
  };
}

export interface PricingPlan {
  name: string;
  tagline: string;
  cta: string;
}

export interface PricingContent {
  plans: {
    core: PricingPlan;
    intelligence: PricingPlan;
    command: PricingPlan;
  };
  title: string;
  subtitle: string;
  // ... other fields
}
