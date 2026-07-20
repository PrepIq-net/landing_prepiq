"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Linkedin, Link as LinkIcon, Check } from "iconoir-react";

export default function ShareBar({ url, title }: { url: string; title: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard is unavailable over plain HTTP and in some embedded browsers;
      // the share links below still work, so fail quietly.
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      name: "X",
      Icon: X,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      Icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs text-muted-foreground">{t("blog.share")}</span>

      {targets.map(({ name, Icon, href }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("blog.share")} ${name}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
        >
          <Icon className="h-3.5 w-3.5" />
        </a>
      ))}

      <button
        type="button"
        onClick={copyLink}
        aria-label={t("blog.copyLink")}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-success" />
        ) : (
          <LinkIcon className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
