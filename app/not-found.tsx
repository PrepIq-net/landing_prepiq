"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{i18n.resolvedLanguage === 'fr' ? 'Oups ! Page non trouvée' : 'Oops! Page not found'}</p>
        <Link href="/" className="text-primary underline hover:text-primary/90">
          {t("common.backToHome")}
        </Link>
      </div>
    </div>
  );
}
