const footerLinks = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Intelligence", href: "#intelligence" },
    { label: "Pricing", href: "#value" },
    { label: "Integrations", href: "#integrations" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Security", href: "/security" },
  ],
};

const Footer = () => {
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
              Daily prep intelligence for kitchens that take food operations seriously. Predict demand, reduce waste, protect margins.
            </p>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
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
            © {new Date().getFullYear()} PrepIQ. All rights reserved.
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
