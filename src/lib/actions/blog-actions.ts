"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "@/lib/revalidate";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity-logger";
import {
  destroyBlogAudio,
  destroyBlogImage,
  uploadBlogAudio,
  uploadBlogImage,
} from "@/lib/cloudinary";
import { markdownToSpeech, synthesizeNarration } from "@/lib/blog-narration";
import type { Lang } from "@/types/blog";
import { z } from "zod";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true },
  });
}

function revalidateBlog(slug?: string) {
  revalidateTag("blog");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/"); // the home page carries the featured strip
  if (slug) revalidatePath(`/blog/${slug}`);
}

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : null));

const PostSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  titleEn: z.string().min(1, "English title is required").max(200),
  titleFr: optionalText(200),
  excerptEn: z.string().min(1, "English excerpt is required").max(500),
  excerptFr: optionalText(500),
  bodyEn: z.string().min(1, "English body is required"),
  bodyFr: optionalText(200_000),
  coverUrl: optionalText(2000),
  coverPublicId: optionalText(300),
  coverAlt: optionalText(300),
  category: z.string().min(1, "Category is required").max(60),
  tags: z
    .string()
    .max(500)
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    ),
  authorName: z.string().min(1, "Author is required").max(120),
  authorRole: optionalText(120),
  authorAvatar: optionalText(2000),
  readMinutes: z
    .string()
    .optional()
    .transform((v) => {
      const n = Number(v);
      return v && Number.isFinite(n) && n > 0 ? Math.round(n) : null;
    }),
  seoTitle: optionalText(200),
  seoDescription: optionalText(320),
  publishedAt: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || !v.trim()) return null;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d;
    }),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.literal("on").optional(),
  isFeatured: z.literal("on").optional(),
});

/**
 * Attach every uploaded image that the saved post actually references, so the
 * assets are destroyed with the post. Images uploaded then removed from the
 * body stay orphaned (postId null) and can be cleared from the media library.
 */
async function linkReferencedImages(
  postId: string,
  parts: (string | null | undefined)[]
) {
  const haystack = parts.filter(Boolean).join("\n");
  if (!haystack) return;

  const candidates = await prisma.blogImage.findMany({
    where: { OR: [{ postId: null }, { postId }] },
    select: { id: true, publicId: true, url: true, postId: true },
  });

  const referenced = candidates.filter(
    (img) => haystack.includes(img.url) || haystack.includes(img.publicId)
  );
  const toAttach = referenced.filter((img) => img.postId !== postId);
  if (toAttach.length > 0) {
    await prisma.blogImage.updateMany({
      where: { id: { in: toAttach.map((i) => i.id) } },
      data: { postId },
    });
  }

  // Images previously attached to this post but no longer referenced are
  // released back to the library rather than deleted — an editor may be
  // mid-rewrite, and a destroyed asset can't be recovered.
  const orphaned = candidates.filter(
    (img) =>
      img.postId === postId &&
      !haystack.includes(img.url) &&
      !haystack.includes(img.publicId)
  );
  if (orphaned.length > 0) {
    await prisma.blogImage.updateMany({
      where: { id: { in: orphaned.map((i) => i.id) } },
      data: { postId: null },
    });
  }
}

/* -------------------------------------------------------------------------- */
/*  Posts                                                                      */
/* -------------------------------------------------------------------------- */

export async function createBlogPost(formData: FormData) {
  const validated = PostSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }
  const { isPublished, isFeatured, publishedAt, ...data } = validated.data;
  const published = isPublished === "on";

  try {
    const post = await prisma.blogPost.create({
      data: {
        ...data,
        isPublished: published,
        isFeatured: isFeatured === "on",
        // A post going live without an explicit date is stamped now; drafts stay
        // undated so they don't sort ahead of real articles once published.
        publishedAt: publishedAt ?? (published ? new Date() : null),
      },
    });

    await linkReferencedImages(post.id, [
      post.bodyEn,
      post.bodyFr,
      post.coverPublicId,
    ]);

    // A post created already-published gets its narration synthesised now, so
    // the spoken version is live the moment the article is.
    if (published) {
      await autoGenerateNarration(post.id, {
        regenEn: true,
        regenFr: Boolean(post.bodyFr && post.bodyFr.trim()),
        dropFr: false,
      });
    }

    const user = await getSessionUser();
    if (user) {
      await logActivity(user.id, "CREATE", "BLOG_POST", post.id, `Created post ${post.slug}`);
    }
    revalidateBlog(post.slug);
    return { success: true, id: post.id };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, errors: { slug: ["That slug is already in use"] } };
    }
    console.error("Failed to create blog post:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const validated = PostSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }
  const { isPublished, isFeatured, publishedAt, ...data } = validated.data;
  const published = isPublished === "on";

  try {
    const previous = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        slug: true,
        publishedAt: true,
        coverPublicId: true,
        bodyEn: true,
        bodyFr: true,
        audioUrlEn: true,
        audioUrlFr: true,
      },
    });
    if (!previous) return { success: false, message: "Post not found" };

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        isPublished: published,
        isFeatured: isFeatured === "on",
        publishedAt:
          publishedAt ?? previous.publishedAt ?? (published ? new Date() : null),
      },
    });

    // Replacing the cover leaves the old asset unreachable — destroy it.
    if (
      previous.coverPublicId &&
      previous.coverPublicId !== post.coverPublicId
    ) {
      await destroyBlogImage(previous.coverPublicId).catch((e) =>
        console.error("Failed to destroy replaced cover:", e)
      );
      await prisma.blogImage.deleteMany({
        where: { publicId: previous.coverPublicId },
      });
    }

    await linkReferencedImages(post.id, [
      post.bodyEn,
      post.bodyFr,
      post.coverPublicId,
    ]);

    // Keep narration in step with the copy: for a published post, (re)generate
    // a language whose body changed or has no track yet, and drop the French
    // track if French copy was removed. Skipped entirely for drafts so audio is
    // only ever synthesised for articles that are actually live.
    if (published) {
      const nowHasFr = Boolean(post.bodyFr && post.bodyFr.trim());
      await autoGenerateNarration(post.id, {
        regenEn: post.bodyEn !== previous.bodyEn || !previous.audioUrlEn,
        regenFr:
          nowHasFr &&
          (post.bodyFr !== previous.bodyFr || !previous.audioUrlFr),
        dropFr: !nowHasFr && Boolean(previous.audioUrlFr),
      });
    }

    const user = await getSessionUser();
    if (user) {
      await logActivity(user.id, "UPDATE", "BLOG_POST", post.id, `Updated post ${post.slug}`);
    }
    revalidateBlog(post.slug);
    if (previous.slug !== post.slug) revalidatePath(`/blog/${previous.slug}`);
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, errors: { slug: ["That slug is already in use"] } };
    }
    console.error("Failed to update blog post:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        slug: true,
        coverPublicId: true,
        audioPublicIdEn: true,
        audioPublicIdFr: true,
        images: { select: { publicId: true } },
      },
    });
    if (!post) return { success: false, message: "Post not found" };

    const publicIds = new Set<string>(post.images.map((i) => i.publicId));
    if (post.coverPublicId) publicIds.add(post.coverPublicId);

    // Narration lives under Cloudinary's "video" resource type, so destroy it
    // separately from the images above.
    await Promise.all(
      [post.audioPublicIdEn, post.audioPublicIdFr]
        .filter((pid): pid is string => Boolean(pid))
        .map((pid) =>
          destroyBlogAudio(pid).catch((e) =>
            console.error(`Failed to destroy narration ${pid}:`, e)
          )
        )
    );

    // Destroy the cloud assets before the rows that point at them, otherwise a
    // failure here would leave assets with no record of their existence.
    await Promise.all(
      [...publicIds].map((publicId) =>
        destroyBlogImage(publicId).catch((e) =>
          console.error(`Failed to destroy blog image ${publicId}:`, e)
        )
      )
    );

    await prisma.blogImage.deleteMany({ where: { postId: id } });
    await prisma.blogPost.delete({ where: { id } });

    const user = await getSessionUser();
    if (user) {
      await logActivity(user.id, "DELETE", "BLOG_POST", id, `Deleted post ${post.slug}`);
    }
    revalidateBlog(post.slug);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function toggleBlogPostPublished(id: string, next: boolean) {
  try {
    const current = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        publishedAt: true,
        bodyFr: true,
        audioUrlEn: true,
        audioUrlFr: true,
      },
    });
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        isPublished: next,
        publishedAt:
          current?.publishedAt ?? (next ? new Date() : null),
      },
    });

    // Publishing a draft (e.g. one saved unpublished, then flipped live here)
    // fills in any narration it never got. Existing tracks are left untouched —
    // this path has no way to know the body changed, so it only backfills gaps.
    if (next && current) {
      const hasFr = Boolean(current.bodyFr && current.bodyFr.trim());
      await autoGenerateNarration(id, {
        regenEn: !current.audioUrlEn,
        regenFr: hasFr && !current.audioUrlFr,
        dropFr: false,
      });
    }

    const user = await getSessionUser();
    if (user) {
      await logActivity(
        user.id,
        next ? "ACTIVATE" : "DEACTIVATE",
        "BLOG_POST",
        id,
        `${next ? "Published" : "Unpublished"} ${post.slug}`
      );
    }
    revalidateBlog(post.slug);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle publish state:", error);
    return { success: false, message: "Internal error" };
  }
}

export async function toggleBlogPostFeatured(id: string, next: boolean) {
  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: { isFeatured: next },
    });
    revalidateBlog(post.slug);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle featured state:", error);
    return { success: false, message: "Internal error" };
  }
}

/* -------------------------------------------------------------------------- */
/*  Narration                                                                  */
/* -------------------------------------------------------------------------- */

const AUDIO_FIELDS = {
  en: { url: "audioUrlEn", publicId: "audioPublicIdEn", voice: "voiceEn" },
  fr: { url: "audioUrlFr", publicId: "audioPublicIdFr", voice: "voiceFr" },
} as const;

type NarratablePost = {
  id: string;
  slug: string;
  bodyEn: string;
  bodyFr: string | null;
  audioPublicIdEn: string | null;
  audioPublicIdFr: string | null;
  voiceEn: string | null;
  voiceFr: string | null;
};

/**
 * Synthesise one language of a post and store the MP3 URL. Shared by the manual
 * admin button and the on-publish auto-generation; the caller owns auth and
 * cache revalidation. Returns the stored URL, or null when there is nothing to
 * narrate (e.g. a French track requested with no French body).
 */
async function synthesizeAndStore(
  post: NarratablePost,
  lang: Lang,
  voiceId?: string | null
): Promise<string | null> {
  const source = lang === "fr" ? post.bodyFr : post.bodyEn;
  if (!source || !source.trim()) return null;

  const speech = markdownToSpeech(source, lang);
  if (!speech) return null;

  const audio = await synthesizeNarration(speech, lang, voiceId);
  const uploaded = await uploadBlogAudio(audio, post.slug, lang);

  const fields = AUDIO_FIELDS[lang];

  // Uploads use a deterministic `blog-audio/<slug>-<lang>` public id with
  // overwrite, so a same-slug regeneration replaces the old clip in place.
  // Only a slug change since the last run leaves a stale asset behind —
  // destroy it in that case so the blob always mirrors the row.
  const previousPublicId =
    lang === "fr" ? post.audioPublicIdFr : post.audioPublicIdEn;
  if (previousPublicId && previousPublicId !== uploaded.publicId) {
    await destroyBlogAudio(previousPublicId).catch((e) =>
      console.error(`Failed to destroy superseded narration ${previousPublicId}:`, e)
    );
  }

  await prisma.blogPost.update({
    where: { id: post.id },
    data: {
      [fields.url]: uploaded.url,
      [fields.publicId]: uploaded.publicId,
      [fields.voice]: voiceId ?? null,
      audioUpdatedAt: new Date(),
    },
  });
  return uploaded.url;
}

/**
 * (Re)generate narration for a post that was just saved in a published state.
 * Called from create/update/publish flows so an admin never has to click a
 * button. Deliberately non-fatal: a synthesis failure logs and leaves the
 * manual "Regenerate" control on the editor as a fallback rather than blocking
 * the publish itself.
 *
 * `regenEn`/`regenFr` say which languages are stale (body changed) or missing a
 * track; `dropFr` clears an orphaned French track when French copy was removed.
 */
async function autoGenerateNarration(
  id: string,
  opts: { regenEn: boolean; regenFr: boolean; dropFr: boolean }
): Promise<void> {
  try {
    if (opts.dropFr) {
      const existing = await prisma.blogPost.findUnique({
        where: { id },
        select: { audioPublicIdFr: true },
      });
      if (existing?.audioPublicIdFr) {
        await destroyBlogAudio(existing.audioPublicIdFr).catch((e) =>
          console.error("Failed to destroy orphaned FR narration:", e)
        );
      }
      await prisma.blogPost.update({
        where: { id },
        data: { audioUrlFr: null, audioPublicIdFr: null },
      });
    }

    if (!opts.regenEn && !opts.regenFr) return;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        bodyEn: true,
        bodyFr: true,
        audioPublicIdEn: true,
        audioPublicIdFr: true,
        voiceEn: true,
        voiceFr: true,
      },
    });
    if (!post) return;

    if (opts.regenEn) {
      await synthesizeAndStore(post, "en", post.voiceEn).catch((e) =>
        console.error("Auto EN narration failed:", e)
      );
    }
    if (opts.regenFr && post.bodyFr && post.bodyFr.trim()) {
      await synthesizeAndStore(post, "fr", post.voiceFr).catch((e) =>
        console.error("Auto FR narration failed:", e)
      );
    }
  } catch (error) {
    console.error("autoGenerateNarration failed:", error);
  }
}

/**
 * Turn an unexpected narration failure into a human-readable detail line for
 * the admin card. Prisma errors ship as multi-line JSON blobs; map the common
 * schema-drift codes to a plain sentence and truncate whatever else is left.
 */
function narrationErrorDetail(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: string }).code;
    if (code === "P2022" || code === "P2010" || code === "P2021") {
      return "database schema is out of date — the narration columns are missing (run prisma migrate deploy)";
    }
  }
  const message = error instanceof Error ? error.message : String(error);
  return message.length > 220 ? `${message.slice(0, 217)}…` : message;
}

/**
 * Manually generate (or regenerate) neural narration for one language of a
 * post. Auto-generation covers the normal publish flow; this stays as a fallback
 * for retrying a failed run or refreshing audio after a post-publish edit.
 *
 * The French track is only ever generated when the post has real French body
 * copy — otherwise the public page reads the English fallback and an English
 * track already covers it.
 */
export async function generatePostNarration(
  id: string,
  lang: Lang,
  voiceId?: string | null
) {
  const user = await getSessionUser();
  if (!user) return { success: false, message: "Not authenticated" };

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        bodyEn: true,
        bodyFr: true,
        audioPublicIdEn: true,
        audioPublicIdFr: true,
        voiceEn: true,
        voiceFr: true,
      },
    });
    if (!post) return { success: false, message: "Post not found" };

    if (lang === "fr" && !(post.bodyFr && post.bodyFr.trim())) {
      return {
        success: false,
        message: "This post has no French body — the English track covers it.",
      };
    }

    const url = await synthesizeAndStore(post, lang, voiceId);
    if (!url) return { success: false, message: "Nothing to narrate" };

    await logActivity(
      user.id,
      "UPDATE",
      "BLOG_POST",
      id,
      `Generated ${lang.toUpperCase()} narration for ${post.slug}`
    );
    revalidateBlog(post.slug);
    return { success: true, url };
  } catch (error) {
    console.error("Failed to generate narration:", error);
    return {
      success: false,
      message: `Narration failed: ${narrationErrorDetail(error)}`,
    };
  }
}

/** Remove the narration for one language of a post. */
export async function deletePostNarration(id: string, lang: Lang) {
  const user = await getSessionUser();
  if (!user) return { success: false, message: "Not authenticated" };

  try {
    const fields = AUDIO_FIELDS[lang];
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { slug: true, audioPublicIdEn: true, audioPublicIdFr: true },
    });
    if (!post) return { success: false, message: "Post not found" };

    const publicId =
      lang === "fr" ? post.audioPublicIdFr : post.audioPublicIdEn;
    if (publicId) {
      await destroyBlogAudio(publicId).catch((e) =>
        console.error(`Failed to destroy narration ${publicId}:`, e)
      );
    }

    await prisma.blogPost.update({
      where: { id },
      data: { [fields.url]: null, [fields.publicId]: null },
    });
    revalidateBlog(post.slug);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete narration:", error);
    return { success: false, message: "Internal error" };
  }
}

/* -------------------------------------------------------------------------- */
/*  Images                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Upload an image from the editor. Called directly from the client while the
 * post is still being written, so the asset is recorded with no post attached
 * and linked on save.
 */
export async function uploadPostImage(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return { success: false, message: "Not authenticated" };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "No file received" };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, message: "Only image files are allowed" };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { success: false, message: "Images must be under 8 MB" };
  }

  const postId = formData.get("postId");

  try {
    const uploaded = await uploadBlogImage(file);
    await prisma.blogImage.create({
      data: {
        ...uploaded,
        postId: typeof postId === "string" && postId ? postId : null,
      },
    });
    return { success: true, ...uploaded };
  } catch (error) {
    console.error("Failed to upload blog image:", error);
    return { success: false, message: "Upload failed" };
  }
}

export async function deletePostImage(publicId: string) {
  const user = await getSessionUser();
  if (!user) return { success: false, message: "Not authenticated" };

  try {
    await destroyBlogImage(publicId);
    await prisma.blogImage.deleteMany({ where: { publicId } });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog image:", error);
    return { success: false, message: "Internal error" };
  }
}
