import ReactMarkdown from "react-markdown";

// Renders a job role's Markdown body with brand-aligned typography, matching
// the prose style used elsewhere on the site.
export default function CareerMarkdown({ body }: { body: string }) {
  return (
    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3 pt-6 first:pt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-xl font-semibold text-foreground mb-3 pt-6 first:pt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-foreground mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc space-y-1.5 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1.5 pl-5">{children}</ol>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
