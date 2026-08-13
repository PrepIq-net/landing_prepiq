import type { Currency } from "./engine";

const LOCALE_FOR_CURRENCY: Partial<Record<Currency, string>> = {
  USD: "en-US",
  EUR: "fr-FR",
  UGX: "en-UG",
  KES: "en-KE",
  RWF: "en-RW",
};

/** Full, non-compact figure — e.g. "UGX 7,500,000". Used for exact amounts. */
export function formatMoney(value: number, currency: Currency): string {
  if (currency === "OTHER") {
    return Math.round(value).toLocaleString("en-US");
  }
  try {
    return new Intl.NumberFormat(LOCALE_FOR_CURRENCY[currency] ?? "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${Math.round(value).toLocaleString()} ${currency}`;
  }
}

/** Full range — e.g. "UGX 7,500,000 – 15,000,000". Used in the follow-up email,
 * which reads as a written document rather than a dashboard tile. */
export function formatMoneyRange(low: number, high: number, currency: Currency): string {
  return `${formatMoney(low, currency)} – ${formatMoney(high, currency)}`;
}

/** Compact figure — e.g. "UGX 7.8B", "$150K". Used for headline numbers. */
export function formatCompactMoney(value: number, currency: Currency): string {
  if (currency === "OTHER") {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  try {
    return new Intl.NumberFormat(LOCALE_FOR_CURRENCY[currency] ?? "en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return formatMoney(value, currency);
  }
}
