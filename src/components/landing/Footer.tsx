"use client";

import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = [
    {
      heading: t("footer.headings.product"),
      links: [
        { label: t("navbar.howItWorks"), href: "#how-it-works" },
        { label: t("navbar.intelligence"), href: "#intelligence" },
        { label: t("navbar.pricing"), href: "#value" },
        { label: t("navbar.integrations"), href: "#integrations" },
      ]
    },
    {
      heading: t("footer.headings.company"),
      links: [
        { label: t("footer.links.about"), href: "#" },
        { label: t("footer.links.blog"), href: "#" },
        { label: t("footer.links.careers"), href: "#" },
        { label: t("footer.links.contact"), href: "#contact" },
      ]
    },
    {
      heading: t("footer.headings.legal"),
      links: [
        { label: t("footer.links.privacy"), href: "/privacy-policy" },
        { label: t("footer.links.terms"), href: "/terms-of-service" },
        { label: t("footer.links.security"), href: "/security" },
      ]
    }
  ];

  return (
    <footer className="border-t border-border/50 relative overflow-hidden">
      {/* Giant watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span className="font-display text-[28vw] sm:text-[20vw] font-black uppercase tracking-tighter text-foreground/[0.06] sm:text-foreground/[0.045] whitespace-nowrap leading-none">
          PrepIQ
        </span>
      </div>

      <div className="section-container py-10 sm:py-16 relative">
        <div className="grid gap-8 sm:gap-12 grid-cols-2 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="space-y-5 col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-sm font-bold text-primary-foreground">P</span>
              </div>
              <span className="font-display text-lg font-semibold text-foreground">PrepIQ</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">{t("footer.status")}</span>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((column) => (
            <div key={column.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {column.heading}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50 relative">
        <div className="section-container flex flex-col items-center gap-4 py-6 md:flex-row md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PrepIQ. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-5">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
