import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose prose-invert max-w-none"
      components={{
        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        code: ({ children }) => (
          <code className="bg-white/20 px-1 py-0.5 rounded text-sm">{children}</code>
        ),
        pre: ({ children }) => (
          <pre className="bg-white/20 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}; 