import { motion } from "framer-motion";
import { QuoteMessage, StarSolid } from "iconoir-react";
import { useTranslation } from "react-i18next";
import { TestimonialsContent, SectionContent } from "@/types/cms";

const FALLBACK_TESTIMONIALS = {
  en: [
    { quote: "I used to guess prep every morning. Now I review it. PrepIQ changed how my kitchen thinks about waste.", name: "Chef Adamu", role: "Head Chef", company: "Lagos Kitchen Co.", metric: "9% waste reduction" },
    { quote: "We cut waste by 9% in the first month. The forecast just works. Our margin improved before we even noticed.", name: "Sarah K.", role: "Ops Manager", company: "FreshBite", metric: "$3,200/mo saved" },
    { quote: "Finally, a system that understands how kitchens actually run. No bloat, no training needed. Just intelligence.", name: "Marcus T.", role: "Owner", company: "3-Branch Network", metric: "92% accuracy" },
  ],
  fr: [
    { quote: "Je devinais la mise en place chaque matin. Maintenant, je la valide. PrepIQ a changé notre vision du gaspillage.", name: "Chef Adamu", role: "Chef de Cuisine", company: "Lagos Kitchen Co.", metric: "-9% de gaspillage" },
    { quote: "Nous avons réduit le gaspillage de 9% dès le premier mois. La prévision fonctionne tout simplement. Notre marge a bondi.", name: "Sarah K.", role: "Responsable Opérations", company: "FreshBite", metric: "3 200€/mois sauvés" },
    { quote: "Enfin un système qui comprend la réalité d'une cuisine. Pas de superflu, pas de formation. Juste de l'intelligence.", name: "Marcus T.", role: "Propriétaire", company: "3-Branch Network", metric: "92% de précision" },
  ],
};

const TestimonialsSection = ({ dbContent }: { dbContent?: SectionContent<TestimonialsContent> }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const content: TestimonialsContent = dbContent?.[currentLang] || {
    badge: t("testimonials.badge"),
    title: t("testimonials.title"),
    subtitle: t("testimonials.subtitle"),
    items: FALLBACK_TESTIMONIALS[currentLang] || FALLBACK_TESTIMONIALS.en,
    stats: {
      powered: t("testimonials.stats.powered"),
      processed: t("testimonials.stats.processed"),
      onboarding: t("testimonials.stats.onboarding"),
      accuracy: t("testimonials.stats.accuracy"),
    },
  };

  const trustSignals = [
    { value: "40+", label: content.stats.powered },
    { value: "8,000+", label: content.stats.processed },
    { value: "48h", label: content.stats.onboarding },
    { value: "92%", label: content.stats.accuracy },
  ];

  return (
    <section className="py-28 border-t border-border/50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-4 block">
            {content.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 leading-tight lg:leading-[1.15]">
            {content.title}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 mb-14">
          {content.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-7 md:p-8 flex flex-col hover:border-primary/20 transition-colors duration-200"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <StarSolid key={j} className="h-3.5 w-3.5 text-primary" />
                ))}
              </div>

              <QuoteMessage className="h-5 w-5 text-primary/30 mb-3" />
              <p className="text-sm text-foreground leading-relaxed flex-1">&ldquo;{item.quote}&rdquo;</p>

              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}, {item.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-primary">{item.metric}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border"
        >
          {trustSignals.map((signal) => (
            <div key={signal.label} className="bg-card px-5 py-5 text-center">
              <p className="text-xl md:text-2xl font-semibold text-primary mb-1">{signal.value}</p>
              <p className="text-xs text-muted-foreground">{signal.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
