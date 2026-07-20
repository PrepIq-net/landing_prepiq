import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

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
      }}
    />
  );
}
