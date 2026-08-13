import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Stable heading ids so the table of contents and deep links can target them. */
export function slugifyHeading(children: React.ReactNode): string {
  const text = Array.isArray(children)
    ? children.map((c) => (typeof c === "string" ? c : "")).join("")
    : typeof children === "string"
      ? children
      : "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Long-form article renderer. Measure is capped around 68 characters and the
 * vertical rhythm is looser than the marketing sections — this is the one
 * surface on the site meant to be read for several minutes at a time.
 */
export default function BlogMarkdown({ body }: { body: string }) {
  return (
    <div className="text-[17px] leading-[1.75] text-foreground/85">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2
              id={slugifyHeading(children)}
              className="scroll-mt-28 font-display text-2xl md:text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground mt-14 mb-4 first:mt-0"
            >
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2
              id={slugifyHeading(children)}
              className="scroll-mt-28 font-display text-2xl md:text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground mt-14 mb-4 first:mt-0"
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              id={slugifyHeading(children)}
              className="scroll-mt-28 font-display text-lg font-semibold text-foreground mt-10 mb-3"
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-foreground mt-8 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="my-5">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-5 list-disc space-y-2 pl-5 marker:text-primary/60">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-5 list-decimal space-y-2 pl-5 marker:text-primary/60">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1.5">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="my-8 rounded-r-2xl border-l-2 border-primary/50 bg-card/40 py-2 pl-6 pr-5 text-foreground/90 [&>p]:my-3 [&>p]:text-[17px] [&>p]:italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-12 border-border/50" />,
          a: ({ href, children }) => {
            const external = Boolean(href && /^https?:\/\//.test(href));
            return (
              <a
                href={href}
                className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {children}
              </a>
            );
          },
          // Markdown wraps images in a paragraph; figure/figcaption inside <p> is
          // invalid, so the image renders as a self-contained block instead.
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              <span className="my-10 block">
                <img
                  src={src}
                  alt={alt ?? ""}
                  loading="lazy"
                  className="w-full rounded-2xl border border-border/60 shadow-l2"
                  style={{ filter: "saturate(0.92) brightness(0.96)" }}
                />
                {alt ? (
                  <span className="mt-3 block text-center text-sm text-muted-foreground/80">
                    {alt}
                  </span>
                ) : null}
              </span>
            ) : null,
          code: ({ className, children }) => {
            const isBlock = Boolean(className?.startsWith("language-"));
            if (isBlock) {
              return (
                <code className="block font-mono text-[13px] leading-relaxed text-foreground/90">
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded border border-border/60 bg-card px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-8 overflow-x-auto rounded-xl border border-border/60 bg-card p-5">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-card/80 text-foreground">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/40 px-4 py-3 align-top">
              {children}
            </td>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

/** Extracts `##`/`###` headings for the article's table of contents. */
export function extractHeadings(
  body: string
): { id: string; text: string; level: 2 | 3 }[] {
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,3})\s+(.*)$/.exec(line.trim());
    if (!match) continue;

    // `#` and `##` both render as an h2, so they share a level in the outline.
    const level = match[1].length === 3 ? 3 : 2;
    const text = match[2].replace(/[*_`]/g, "").trim();
    if (text) headings.push({ id: slugifyHeading(text), text, level });
  }

  return headings;
}
