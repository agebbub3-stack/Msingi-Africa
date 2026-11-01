import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ArticleMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target={href?.startsWith("/") ? undefined : "_blank"}
            rel={href?.startsWith("/") ? undefined : "noopener noreferrer"}
          >
            {children}
          </a>
        ),
        img: () => null,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
