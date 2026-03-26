import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Building2, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation, Trans } from "react-i18next";

const WEB3FORMS_KEY = "ccacc9ed-7685-4d71-bef2-55f5c3013efc";

const ContactSection = () => {
  const { t, i18n } = useTranslation();

  const contactInfo = [
    { icon: Mail, label: t("contact.email"), value: "hello@prepiq.com", href: "mailto:hello@prepiq.com" },
    { icon: Phone, label: t("contact.phone", "Phone"), value: "+1 (800) 773-7749", href: "tel:+18007737749" },
    { icon: MapPin, label: t("contact.office", "Office"), value: "San Francisco, CA", href: "#" },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New PrepIQ Lead — ${company || name || email}`,
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          locations: selectedLocations || "Not specified",
          message: message.trim(),
          language: i18n.language,
        }),
      });

      const data = await res.json();

      if (data.success) {
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
    "w-full rounded-xl border border-border bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-background transition-all duration-200";

  return (
    <section id="contact" className="py-20 md:py-32 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.03),transparent_60%)] pointer-events-none" />

      <div className="section-container relative">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-5 items-start">
          {/* Left — copy + contact info (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8 lg:space-y-10"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium mb-5 block">
                {t("contact.getInTouch")}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-foreground mb-4 sm:mb-5 leading-tight lg:leading-[1.15]">
                <Trans
                  i18nKey="contact.title"
                  components={{ gold: <span className="text-gradient-gold" /> }}
                />
              </h2>
              <p className="text-muted-foreground max-w-md leading-relaxed text-sm sm:text-base">
                {t("contact.subtitle")}
              </p>
            </div>

            {/* Contact cards */}
            <div className="space-y-2 sm:space-y-3">
              {contactInfo.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3 sm:gap-4 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 -mx-3 sm:-mx-4 group hover:bg-accent/40 transition-all duration-300"
                >
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-accent border border-border/30 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 shrink-0">
                    <item.icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/50 mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Trust points */}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="flex items-center gap-2.5"
            >
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              <span className="text-xs text-muted-foreground/60">{t("contact.trustPoint")}</span>
            </motion.div>
          </motion.div>

          {/* Right — form (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-[0_8px_40px_-8px_hsl(0_0%_0%/0.2)]">
              {/* Form header */}
              <div className="px-5 sm:px-8 md:px-10 py-4 sm:py-5 border-b border-border/50 bg-accent/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">{t("contact.formHeader")}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground/40 hidden sm:inline">{t("contact.optionalEmail")}</span>
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
                {/* Name + Email row */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {t("contact.name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("contact.placeholderName")}
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail className="h-3 w-3" />
                      {t("contact.email")} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder={t("contact.placeholderEmail")}
                      required
                      maxLength={255}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-2.5">
                  <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" />
                    {t("contact.company")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("contact.placeholderCompany")}
                    maxLength={200}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClasses}
                  />
                </div>

                {/* Locations selector */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                    {t("contact.locations")}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {["1", "2–5", "6–20", "20+"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedLocations(opt)}
                        className={`flex items-center justify-center rounded-xl border px-3 py-2.5 sm:py-3 text-sm font-medium cursor-pointer transition-all duration-200 ${
                          selectedLocations === opt
                            ? "border-primary/40 bg-primary/5 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.06)]"
                            : "border-border bg-background/50 text-muted-foreground/60 hover:border-primary/20 hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2.5">
                  <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                    {t("contact.message")}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t("contact.placeholderMessage")}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                {/* Submit */}
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl bg-[hsl(var(--success)/.08)] border border-[hsl(var(--success)/.15)] p-5 text-center"
                    >
                      <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))] mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">{t("contact.sent")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("contact.sentSubtitle")}</p>
                    </motion.div>
                  ) : (
                    <motion.div key="button" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {t("contact.sending")}
                            </>
                          ) : (
                            <>
                              {t("contact.send")}
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </span>
                      </Button>
                      <p className="text-[11px] text-muted-foreground/30 text-center mt-3">
                        {t("contact.noSpam")}
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
