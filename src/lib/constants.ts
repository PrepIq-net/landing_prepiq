export const APP_URL = "https://app.prepiq.net";
// Public marketing origin, used for canonicals, Open Graph URLs and the sitemap.
// Must match the origin the site is actually served from: pointing canonicals at
// a domain we do not control de-indexes the real site.
export const SITE_URL = "https://prepiq.net";
export const CALENDLY_URL = "https://calendly.com/blessambel1/new-meeting";

/**
 * The Android app has one Play Console listing that moves through two states:
 * a closed testing track while we onboard beta kitchens, then the public
 * listing once it's reviewed and released. Flipping NEXT_PUBLIC_PLAY_STORE_MODE
 * at deploy time (no code change) is what moves every "Get it on Android" touch
 * point on the site from beta copy to launch copy in one place.
 *
 * Package id (`net.prepiq`) must match `mobile-app/app.json`'s `expo.android.package`.
 */
export const PLAY_STORE_CONFIG = {
  mode: (process.env.NEXT_PUBLIC_PLAY_STORE_MODE === "production"
    ? "production"
    : "testing") as "testing" | "production",
  urls: {
    // TODO: replace with the real closed-testing opt-in link from Play Console
    // once the track is live (Testing > Closed testing > copy link).
    testing: "https://play.google.com/apps/testing/net.prepiq",
    production: "https://play.google.com/store/apps/details?id=net.prepiq",
  },
} as const;
