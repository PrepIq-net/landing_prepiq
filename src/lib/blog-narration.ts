import "server-only";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { resolveNarrationVoice } from "@/lib/narration-voices";
import type { Lang } from "@/types/blog";

/**
 * Spoken cue announcing that the article contains a link, read in the language
 * of the narration so the track never switches voices mid-sentence.
 */
const LINK_CUE: Record<Lang, string> = {
  en: "a link is available in the article",
  fr: "un lien est disponible dans l'article",
};

/** Max characters per TTS request (Edge TTS limit ~10k-20k; stay well under). */
const MAX_CHUNK_CHARS = 8000;

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
 * Split long text into chunks at paragraph boundaries, each under the character
 * limit. Keeps paragraphs intact so pauses remain natural.
 */
function splitIntoChunks(text: string): string[] {
  if (text.length <= MAX_CHUNK_CHARS) return [text];

  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const candidate = currentChunk ? `${currentChunk}\n\n${para}` : para;
    if (candidate.length <= MAX_CHUNK_CHARS) {
      currentChunk = candidate;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (para.length > MAX_CHUNK_CHARS) {
        // Paragraph itself is too long — split by sentences
        const sentences = para.split(/(?<=[.!?])\s+/);
        let sentenceChunk = "";
        for (const sent of sentences) {
          const test = sentenceChunk ? `${sentenceChunk} ${sent}` : sent;
          if (test.length <= MAX_CHUNK_CHARS) {
            sentenceChunk = test;
          } else {
            if (sentenceChunk) chunks.push(sentenceChunk);
            sentenceChunk = sent;
          }
        }
        if (sentenceChunk) chunks.push(sentenceChunk);
        currentChunk = "";
      } else {
        currentChunk = para;
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

/**
 * Synthesise a single chunk of text to an MP3 buffer.
 */
async function synthesizeChunk(
  text: string,
  lang: Lang,
  voiceId: string | null | undefined
): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    resolveNarrationVoice(lang, voiceId),
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

/**
 * Synthesise narration for the given text with the chosen neural voice (or the
 * language default when none is stored) and return the MP3 bytes. Streams from
 * Microsoft's endpoint and buffers the whole clip. For long articles, splits
 * into multiple requests and concatenates the audio to avoid the Edge TTS
 * character limit.
 */
export async function synthesizeNarration(
  text: string,
  lang: Lang,
  voiceId?: string | null
): Promise<Buffer> {
  const chunks = splitIntoChunks(text);
  if (chunks.length === 1) {
    return synthesizeChunk(chunks[0], lang, voiceId);
  }

  const buffers = await Promise.all(
    chunks.map((chunk) => synthesizeChunk(chunk, lang, voiceId))
  );
  return Buffer.concat(buffers);
}
