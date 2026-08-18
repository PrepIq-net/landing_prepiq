import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function isSafeHref(href?: string): href is string {
  return Boolean(
    href && (href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://"))
  );
}

/**
 * Compact markdown renderer for the concierge's LLM-generated replies.
 * react-markdown never executes embedded HTML unless rehype-raw is added
 * (it deliberately isn't here), so this is safe for untrusted model output
 * the same way the plain-text-plus-linkify renderer it replaces was — links
 * are re-validated the same way.
 */
export function ConciergeMarkdown({
  content,
  onNavigate,
}: {
  content: string;
  /** Fired before an internal (same-tab) link navigates — lets the panel
   *  close itself so the page transition isn't covered by the chat. */
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-1.5 [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p>{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) =>
            isSafeHref(href) ? (
              <a
                href={href}
                target={href.startsWith("/") ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={
                  href.startsWith("/")
                    ? () => {
                        onNavigate?.();
                      }
                    : undefined
                }
                className="text-primary underline underline-offset-2 hover:opacity-80 inline-block py-0.5"
              >
                {children}
              </a>
            ) : (
              <>{children}</>
            ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-4 marker:text-primary/60">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-4 marker:text-primary/60">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-0.5">{children}</li>,
          code: ({ className, children }) => {
            const isBlock = Boolean(className?.startsWith("language-"));
            return isBlock ? (
              <code className="block overflow-x-auto font-mono text-[12px] leading-relaxed">
                {children}
              </code>
            ) : (
              <code className="rounded border border-border bg-background/60 px-1 py-0.5 font-mono text-[0.85em]">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg border border-border bg-background/60 p-2.5">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
