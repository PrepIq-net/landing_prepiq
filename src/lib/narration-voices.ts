import type { Lang } from "@/types/blog";

/**
 * Default neural voices per language. Microsoft Edge "Neural" voices sound
 * natural (not the robotic system TTS) and are free with no key.
 */
const DEFAULT_VOICE: Record<Lang, string> = {
  en: "en-US-JennyNeural",
  fr: "fr-FR-DeniseNeural",
};

/**
 * Curated Microsoft Edge neural voices the admin can pick from per language,
 * with a friendly label for the picker. Kept deliberately small — every entry
 * is a voice someone chose, not the full 60-voice catalogue.
 */
export const NARRATION_VOICES: Record<Lang, { id: string; label: string }[]> = {
  en: [
    { id: "en-US-JennyNeural", label: "Jenny (US, female) — default" },
    { id: "en-US-AriaNeural", label: "Aria (US, female)" },
    { id: "en-US-EmmaNeural", label: "Emma (US, female)" },
    { id: "en-US-GuyNeural", label: "Guy (US, male)" },
    { id: "en-US-ChristopherNeural", label: "Christopher (US, male)" },
    { id: "en-GB-SoniaNeural", label: "Sonia (UK, female)" },
    { id: "en-GB-RyanNeural", label: "Ryan (UK, male)" },
    { id: "en-AU-NatashaNeural", label: "Natasha (AU, female)" },
  ],
  fr: [
    { id: "fr-FR-DeniseNeural", label: "Denise (FR, female) — default" },
    { id: "fr-FR-EloiseNeural", label: "Éloïse (FR, female)" },
    { id: "fr-FR-HenriNeural", label: "Henri (FR, male)" },
    { id: "fr-CA-SylvieNeural", label: "Sylvie (CA, female)" },
    { id: "fr-CA-AntoineNeural", label: "Antoine (CA, male)" },
    { id: "fr-BE-CharlineNeural", label: "Charline (BE, female)" },
  ],
};

/**
 * Resolve the voice to use for a narration: the stored choice if it's still in
 * the catalog, otherwise the language default (covers stale rows after the
 * catalog is trimmed).
 */
export function resolveNarrationVoice(
  lang: Lang,
  stored: string | null | undefined
): string {
  const known = NARRATION_VOICES[lang].some((v) => v.id === stored);
  return known && stored ? stored : DEFAULT_VOICE[lang];
}