import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, StarSolid } from "iconoir-react";
import PostRowActions from "./PostRowActions";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogManager() {
  const [posts, publishedCount, featuredCount] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        titleEn: true,
        category: true,
        authorName: true,
        isPublished: true,
        isFeatured: true,
        publishedAt: true,
        coverUrl: true,
      },
    }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.blogPost.count({ where: { isPublished: true, isFeatured: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Blog
          </h1>
          <p className="text-sm text-muted-foreground">
            {posts.length} article{posts.length === 1 ? "" : "s"} · {publishedCount}{" "}
            published · {featuredCount} featured on the home page.
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-[#B8962E]">
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New article
          </Link>
        </Button>
      </div>

      {featuredCount > 3 && (
        <div className="rounded-lg border border-[hsl(var(--warning)/.2)] bg-[hsl(var(--warning)/.1)] px-4 py-3 text-sm text-[hsl(var(--warning))]">
          {featuredCount} articles are featured, but the home page shows only the
          first 3 by sort order.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#2A2A2E] bg-[#1C1C1F] shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="border-b border-[#2A2A2E] hover:bg-transparent">
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Article
              </TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Category
              </TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Author
              </TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Published
              </TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Control
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                className="border-b border-[#2A2A2E] transition-colors hover:bg-[#2A2A2E]/50"
              >
                {/* Capped so long headlines truncate instead of pushing the
                    action buttons out of view on narrower screens. */}
                <TableCell className="max-w-[360px] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-16 shrink-0 overflow-hidden rounded-md border border-[#2A2A2E] bg-[#232327]">
                      {post.coverUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        {post.isFeatured && (
                          <StarSolid className="h-3.5 w-3.5 shrink-0 text-primary" />
                        )}
                        <span className="truncate font-medium text-foreground">
                          {post.titleEn}
                        </span>
                      </div>
                      <div className="truncate font-mono text-xs text-muted-foreground">
                        /blog/{post.slug}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {post.category}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {post.authorName}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(post.publishedAt)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {post.isPublished ? (
                    <Badge className="border border-success/20 bg-success/15 text-success">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <PostRowActions
                    id={post.id}
                    slug={post.slug}
                    title={post.titleEn}
                    isPublished={post.isPublished}
                    isFeatured={post.isFeatured}
                  />
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  No articles yet. Write your first one, or run{" "}
                  <span className="font-mono text-xs">npm run db:seed:blog</span>{" "}
                  to load the launch set.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
