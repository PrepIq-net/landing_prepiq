import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  ArrowRight,
  CheckCircle,
  Building,
  User,
} from "iconoir-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { submitContactForm } from "@/lib/actions/contact-actions";
import { ContactContent, SectionContent } from "@/types/cms";
import { SeamAccent } from "./motion-primitives";

const ContactSection = ({
  dbContent,
}: {
  dbContent?: SectionContent<ContactContent>;
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || "en") as "en" | "fr";

  const fallbackContent: ContactContent = {
    getInTouch: t("contact.getInTouch"),
    title: t("contact.title").replace(/<\/?gold>/g, ""),
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
    "w-full rounded-xl border border-border bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-background transition-colors duration-200";

  return (
    <section
      id="contact"
      className="relative py-20 md:py-32 border-t border-border/50 section-band scroll-mt-20"
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
              <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
                {content.getInTouch}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
                {content.title}
              </h2>
              <p className="text-muted-foreground max-w-md leading-relaxed text-sm sm:text-base">
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
                    <item.icon className="h-4.5 w-4.5 text-primary" />
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
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {content.formHeader}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground/40 hidden sm:inline">
                  {content.optionalEmail}
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      {content.name}
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder={content.placeholderName}
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail className="h-3 w-3" />
                      {content.contactInfo.email}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
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

                <div className="space-y-2.5">
                  <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
                    <Building className="h-3 w-3" />
                    {content.company}
                  </label>
                  <input
                    name="company"
                    type="text"
                    placeholder={content.placeholderCompany}
                    maxLength={200}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                    {content.locations}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {["1", "2–5", "6–20", "20+"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedLocations(opt)}
                        className={`flex items-center justify-center rounded-xl border px-3 py-2.5 sm:py-3 text-sm font-medium cursor-pointer transition-colors duration-200 ${
                          selectedLocations === opt
                            ? "border-primary/40 bg-primary/5 text-primary"
                            : "border-border bg-background/50 text-muted-foreground/60 hover:border-primary/20 hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                    {content.message}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={content.placeholderMessage}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl bg-[hsl(var(--success)/.08)] border border-[hsl(var(--success)/.15)] p-5 text-center"
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
                      <p className="text-[11px] text-muted-foreground/30 text-center mt-3">
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
