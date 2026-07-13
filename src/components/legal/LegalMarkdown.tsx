import ReactMarkdown from "react-markdown";

// Renders legal-document markdown with the same styling the hardcoded
// legal pages used, so the visual design is unchanged now that content
// comes from the database.
export default function LegalMarkdown({ body }: { body: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-foreground mb-3 pt-7 first:pt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-md font-semibold text-foreground mt-5 mb-2">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-1.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-1.5">{children}</ol>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline">
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
