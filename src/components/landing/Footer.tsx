"use client";

import { useTranslation } from "react-i18next";

interface FooterLink {
  id: string;
  labelEn: string;
  labelFr: string;
  url: string;
  category: string | null;
}

const Footer = ({ links }: { links: FooterLink[] }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage as "en" | "fr";

  const categories = [
    { id: "product", heading: t("footer.headings.product") },
    { id: "company", heading: t("footer.headings.company") },
    { id: "legal", heading: t("footer.headings.legal") },
  ];

  const groupedLinks = categories.map(cat => ({
    heading: cat.heading,
    links: links.filter(l => l.category === cat.id)
  }));

  return (
    <footer className="border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span className="font-display text-[28vw] sm:text-[20vw] font-black uppercase tracking-tighter text-foreground/[0.06] sm:text-foreground/[0.045] whitespace-nowrap leading-none">
          PrepIQ
        </span>
      </div>

      <div className="section-container py-10 sm:py-16 relative">
        <div className="grid gap-8 sm:gap-12 grid-cols-2 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr]">
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

          {groupedLinks.map((column) => (
            <div key={column.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {column.heading}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {currentLang === "fr" ? link.labelFr : link.labelEn}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

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
