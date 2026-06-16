import { revalidateTag as nextRevalidateTag } from "next/cache";

/**
 * Wrapper for revalidateTag to handle potential TypeScript issues
 * and version differences in Next.js 16.
 */
export function revalidateTag(tag: string) {
  try {
    // @ts-ignore
    nextRevalidateTag(tag);
  } catch (e) {
    console.error(`Failed to revalidate tag: ${tag}`, e);
  }
}
