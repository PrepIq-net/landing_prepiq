import "server-only";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import type { Lang } from "@/types/blog";

/**
 * Neural voices used for narration. Both are Microsoft Edge "Neural" voices,
 * which sound natural (not the robotic system TTS) and are free with no key.
 */
const VOICE: Record<Lang, string> = {
  en: "en-US-JennyNeural",
  fr: "fr-FR-DeniseNeural",
};

/**
 * Spoken cue announcing that the article contains a link, read in the language
 * of the narration so the track never switches voices mid-sentence.
 */
const LINK_CUE: Record<Lang, string> = {
  en: "a link is available in the article",
  fr: "un lien est disponible dans l'article",
};

/**
 * Turn article markdown into clean prose a screen reader would speak, dropping
 * anything that reads badly aloud: fenced code, raw URLs, image markup, table
 * pipes and heading/list punctuation. Headings keep their text (with a pause)
 * so the narration still has structure. Links keep their label followed by a
 * spoken cue — listeners can't click, so they're told a link exists and can
 * find it while reading along.
 */
export function markdownToSpeech(
  markdown: string,
  lang: Lang = "en"
): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code → its text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images → nothing
    .replace(/\[([^\]]+)\]\([^)]*\)/g, `$1 — ${LINK_CUE[lang]}.`)
    .replace(/^\s{0,3}#{1,6}\s+(.*)$/gm, "$1.") // headings → sentence + pause
    .replace(/^\s{0,3}>\s?/gm, "") // blockquote markers
    .replace(/^\s*[-*+]\s+/gm, "") // unordered list bullets
    .replace(/^\s*\d+\.\s+/gm, "") // ordered list markers
    .replace(/\|/g, " ") // table cell separators
    .replace(/^[-\s|:]{3,}$/gm, " ") // table/hr rule lines
    .replace(/(\*\*|__|\*|_|~~)/g, "") // bold/italic/strike markers
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n\n") // collapse blank runs → paragraph pause
    .trim();
}

/**
 * Synthesise narration for the given text and return the MP3 bytes. Streams
 * from Microsoft's endpoint and buffers the whole clip — callers should treat
 * this as potentially slow for long articles (see the route's maxDuration).
 */
export async function synthesizeNarration(
  text: string,
  lang: Lang
): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    VOICE[lang],
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
  );

  return new Promise<Buffer>((resolve, reject) => {
    const { audioStream } = tts.toStream(text);
    const chunks: Buffer[] = [];
    audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
    audioStream.on("end", () => {
      tts.close();
      const audio = Buffer.concat(chunks);
      if (audio.length === 0) reject(new Error("No audio was generated"));
      else resolve(audio);
    });
    audioStream.on("error", (err: Error) => {
      tts.close();
      reject(err);
    });
  });
}
