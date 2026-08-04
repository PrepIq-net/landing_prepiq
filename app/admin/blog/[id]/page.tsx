import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

// Server Actions invoked from this page (narration generation) run as POSTs to
// this route, so its segment config governs their timeout. Synthesising a long
// article can take a couple of minutes; 300s is the Vercel Pro ceiling.
export const maxDuration = 300;

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <PostForm
      post={{
        id: post.id,
        slug: post.slug,
        titleEn: post.titleEn,
        titleFr: post.titleFr,
        excerptEn: post.excerptEn,
        excerptFr: post.excerptFr,
        bodyEn: post.bodyEn,
        bodyFr: post.bodyFr,
        coverUrl: post.coverUrl,
        coverPublicId: post.coverPublicId,
        coverAlt: post.coverAlt,
        category: post.category,
        tags: post.tags,
        authorName: post.authorName,
        authorRole: post.authorRole,
        authorAvatar: post.authorAvatar,
        readMinutes: post.readMinutes,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        isPublished: post.isPublished,
        isFeatured: post.isFeatured,
        sortOrder: post.sortOrder,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
        audioUrlEn: post.audioUrlEn,
        audioUrlFr: post.audioUrlFr,
        audioUpdatedAt: post.audioUpdatedAt
          ? post.audioUpdatedAt.toISOString()
          : null,
      }}
    />
  );
}
