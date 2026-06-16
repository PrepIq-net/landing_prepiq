/**
 * Brand Design Tokens
 * Source of truth for PrepIQ Brand System v1.0
 */

export const BRAND_TOKENS = {
  colors: {
    background: "#141416",
    card: "#1C1C1F",
    elevated: "#232327",
    hover: "#2A2A2E",
    gold: {
      default: "#A8821F",
      hover: "#B8962E",
      pressed: "#8F6F18",
    },
    text: {
      primary: "#F5F5F7",
      secondary: "#C7C7CC",
      muted: "#8E8E93",
      disabled: "#5A5A60",
    },
    status: {
      critical: "#C44949",
      warning: "#C48B2A",
      success: "#3F8F68",
      info: "#3A6EA5",
    },
  },
  typography: {
    fonts: {
      display: "Satoshi, sans-serif",
      body: "Inter, sans-serif",
    },
    scale: {
      h1: { size: "40px", lineHeight: "48px", weight: "600" },
      h2: { size: "32px", lineHeight: "40px", weight: "600" },
      h3: { size: "24px", lineHeight: "32px", weight: "600" },
      h4: { size: "18px", lineHeight: "28px", weight: "500" },
      bodyLarge: { size: "16px", lineHeight: "24px", weight: "400" },
      body: { size: "14px", lineHeight: "22px", weight: "400" },
      small: { size: "12px", lineHeight: "18px", weight: "400" },
      kpi: { size: "48px", weight: "600", tracking: "-0.5px" },
    },
  },
  spacing: {
    px: "1px",
    0: "0",
    4: "4px",
    8: "8px",
    12: "12px",
    16: "16px",
    24: "24px",
    32: "32px",
    40: "40px",
    48: "48px",
    64: "64px",
    80: "80px",
  },
  radius: {
    button: "8px",
    card: "12px",
    modal: "16px",
  },
  shadows: {
    l1: "0 1px 2px rgba(0,0,0,0.3)",
    l2: "0 8px 24px rgba(0,0,0,0.4)",
    l3: "0 4px 12px rgba(0,0,0,0.35)",
  },
} as const;

export type BrandColors = typeof BRAND_TOKENS.colors;
export type BrandSpacing = keyof typeof BRAND_TOKENS.spacing;
