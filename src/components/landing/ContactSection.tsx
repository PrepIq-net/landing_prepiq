import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  ArrowRight,
  CheckCircle,
} from "iconoir-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { submitContactForm } from "@/lib/actions/contact-actions";
import { ContactContent, SectionContent } from "@/types/cms";
import { SeamAccent } from "./motion-primitives";
import { GoldText } from "./GoldText";

const ContactSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<ContactContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const fallbackContent: ContactContent = {
    getInTouch: t("contact.getInTouch"),
    title: t("contact.title"),
    subtitle: t("contact.subtitle"),
    contactInfo: {
      email: t("contact.email"),
      phone: t("contact.phone"),
      office: t("contact.office"),
    },
    trustPoint: t("contact.trustPoint"),
    formHeader: t("contact.formHeader"),
    optionalEmail: t("contact.optionalEmail"),
    name: t("contact.name"),
    placeholderName: t("contact.placeholderName"),
    placeholderEmail: t("contact.placeholderEmail"),
    company: t("contact.company"),
    placeholderCompany: t("contact.placeholderCompany"),
    locations: t("contact.locations"),
    message: t("contact.message"),
    placeholderMessage: t("contact.placeholderMessage"),
    sent: t("contact.sent"),
    sentSubtitle: t("contact.sentSubtitle"),
    sending: t("contact.sending"),
    send: t("contact.send"),
    noSpam: t("contact.noSpam"),
  };

  const localizedContent = dbContent?.[currentLang] as
    | Partial<ContactContent>
    | undefined;
  const content: ContactContent = {
    ...fallbackContent,
    ...localizedContent,
    contactInfo: {
      ...fallbackContent.contactInfo,
      ...(localizedContent?.contactInfo ?? {}),
    },
  };

  const contactInfo = [
    {
      icon: Mail,
      label: content.contactInfo.email,
      value: "customer@prepiq.net",
      href: "mailto:customer@prepiq.net",
    },
    {
      icon: Phone,
      label: content.contactInfo.phone,
      value: "+256 709 802 259",
      href: "tel:+256709802259",
    },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string | null>(
    null,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("company", company);
    formData.append("locations", selectedLocations || "");
    formData.append("message", message);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
        setSelectedLocations(null);
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "h-14 rounded-xl border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-card transition-colors duration-200";

  const textareaClasses =
    "w-full min-h-[140px] rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-card transition-colors duration-200 resize-none";

  const fieldLabel =
    "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3";

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 border-t border-border/50 section-band scroll-mt-20"
    >
      <SeamAccent />
      <div className="section-container">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-5 items-start">
          {/* Left — copy + contact info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8 lg:space-y-10"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-px bg-primary" />
                <span className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] text-primary font-medium">
                  {content.getInTouch}
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl lg:text-[52px] font-semibold text-foreground leading-[1.06] tracking-[-0.02em] mb-5 text-balance">
                <GoldText text={content.title} />
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground max-w-md leading-relaxed">
                {content.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              {contactInfo.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -3,
                    transition: { duration: 0.2, delay: 0 },
                  }}
                  className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-border bg-card/60 px-4 sm:px-5 py-3.5 sm:py-4 group hover:border-primary/25 hover:shadow-l2 transition-[border-color,box-shadow] duration-200"
                >
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/15 group-hover:bg-primary/15 group-hover:border-primary/25 transition-colors duration-200 shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/50 mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--success)/.2)] bg-[hsl(var(--success)/.08)] px-3 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
              <span className="text-xs font-medium text-[hsl(var(--success))]">
                {content.trustPoint}
              </span>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border bg-card/80 overflow-hidden shadow-l2">
              <div className="px-5 sm:px-8 md:px-10 py-4 sm:py-5 border-b border-border/50 bg-accent/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/15 shrink-0">
                    <Mail className="h-4 w-4 text-primary" aria-hidden />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {content.formHeader}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground/50 hidden sm:inline">
                  {content.optionalEmail}
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>
                      {content.name}
                    </label>
                    <Input
                      name="name"
                      type="text"
                      placeholder={content.placeholderName}
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={fieldLabel}>
                      {content.contactInfo.email}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder={content.placeholderEmail}
                      required
                      maxLength={255}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className={fieldLabel}>
                    {content.company}
                  </label>
                  <Input
                    name="company"
                    type="text"
                    placeholder={content.placeholderCompany}
                    maxLength={200}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>
                    {content.locations}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {["1", "2–5", "6–20", "20+"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedLocations(opt)}
                        className={`flex items-center justify-center rounded-xl border px-3 py-2.5 sm:py-3 text-sm font-medium cursor-pointer transition-all duration-200 ${
                          selectedLocations === opt
                            ? "border-primary bg-primary/5 text-foreground shadow-l1"
                            : "border-border bg-card/80 text-muted-foreground hover:border-primary/25 hover:bg-card hover:text-foreground hover:shadow-l1"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={fieldLabel}>
                    {content.message}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={content.placeholderMessage}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={textareaClasses}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl bg-[hsl(var(--success)/.08)] border border-[hsl(var(--success)/.15)] p-5 text-center"
                    >
                      <CheckCircle className="h-6 w-6 text-[hsl(var(--success))] mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        {content.sent}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {content.sentSubtitle}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="button"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Button
                        type="submit"
                        variant="hero"
                        size="xl"
                        className="w-full group"
                        disabled={loading}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                              {content.sending}
                            </>
                          ) : (
                            <>
                              {content.send}
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </span>
                      </Button>
                      <p className="text-xs text-muted-foreground/50 text-center mt-3">
                        {content.noSpam}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
