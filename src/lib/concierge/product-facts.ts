// Hand-written product facts for the PrepIQ Concierge knowledge base.
// This is the bot's source of truth for anything not stored in the CMS —
// especially exact pricing (mirrors PLAN_META in PricingSection.tsx; keep the
// two in sync when prices change). Updating this file requires a deploy.

export const PRODUCT_FACTS = `
# PrepIQ — what it is
PrepIQ is a kitchen intelligence platform for restaurants. It forecasts daily
demand from historical sales, weather, local events and operational learning,
and turns that into a recommended prep plan the chef reviews, adjusts or
overrides before production begins. It supports chefs — it never replaces them.

# Pricing (quote exactly, per location, USD; EUR shown on the French site)
- Core — $49/month or $499/year. For independent, single-branch restaurants.
  1 branch, up to 15 staff. Free pilot available.
- Intelligence — $149/month or $1,519/year. Margin-protection intelligence.
  Up to 10 branches, unlimited staff. Most popular plan.
- Command — $349/month or $3,559/year. Multi-branch command center.
  Unlimited branches and staff. Enterprise deployments with 10+ locations get
  custom pricing — talk to sales.
Optional add-ons (per location, monthly): Tax Engine $79, Liability Shield $59,
Enterprise SSO $99, Advanced API $49, Dedicated Analyst $299 (availability
varies by plan). All plans include encrypted data, SOC 2 practices, and
dedicated onboarding.

# POS compatibility & data import
PrepIQ works alongside your existing POS — it never replaces it. Sales data
arrives three ways: direct POS integrations, CSV imports, or the PrepIQ
Connector, a small companion app that syncs sales from an on-premise POS
database to PrepIQ automatically and securely. No POS at all is also fine:
sales can be entered manually or via CSV.

# AI forecasting
Forecasts combine historical sales, day-of-week patterns, weather, holidays,
local events and chef feedback. Accuracy improves within the first week and
keeps learning from every service and every chef override. During service,
Live Mode tracks sales in real time and alerts the kitchen when an item trends
toward a stockout, suggesting batch adjustments to avoid waste.

# Mobile app
PrepIQ has a mobile app for owners, managers and kitchen staff: today's prep
plan, live service pace, task board, and close-of-day review from a phone.

# Roles & permissions
Role-based access for owners, managers, chefs and staff, per branch. Staff see
what they need for service; owners get cross-branch visibility and controls.

# Setup
Most kitchens are fully set up within 48 hours: connect sales data, configure
menu items, and PrepIQ starts learning immediately.

# Security & privacy
Data is encrypted in transit and at rest; PrepIQ follows SOC 2 practices.
Full details are on the website's Security and Privacy Policy pages.

# Booking a demo
Visitors can book a live demo from the website (the "Book a demo" button) or
leave their contact details in this chat and the PrepIQ team will follow up.
`.trim();
