"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef, useId } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function MermaidBlock({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "-");

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({ startOnLoad: false, theme: "neutral", fontFamily: "sans-serif" });
      if (containerRef.current && !cancelled) {
        try {
          const { svg } = await mermaid.render(`mermaid-${uniqueId}`, chart);
          if (containerRef.current && !cancelled) containerRef.current.innerHTML = svg;
        } catch {
          if (containerRef.current && !cancelled) containerRef.current.textContent = chart;
        }
      }
    }
    render();
    return () => { cancelled = true; };
  }, [chart, uniqueId]);

  return (
    <div ref={containerRef} className="my-4 flex justify-center overflow-x-auto rounded-lg bg-gray-50 p-4">
      <p className="text-sm text-gray-400">Chargement du schéma...</p>
    </div>
  );
}

export function ModuleContent({ markdown }: { markdown: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
      <article className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-a:text-[#1D9E75] prose-table:text-sm">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const lang = match?.[1];

              if (lang === "mermaid") {
                return <MermaidBlock chart={String(children).trim()} />;
              }

              // Block code with language
              if (lang) {
                return (
                  <div className="not-prose relative my-4">
                    <span className="absolute right-3 top-2 text-xs text-gray-500">{lang}</span>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={lang}
                      customStyle={{
                        background: "#1E1E1E",
                        borderRadius: "8px",
                        padding: "16px",
                        paddingTop: "28px",
                        fontSize: "14px",
                        margin: 0,
                      }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              // Inline code
              return (
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-green-700" {...props}>
                  {children}
                </code>
              );
            },
            // Block code wrapper (pre)
            pre({ children }) {
              return <>{children}</>;
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    </div>
  );
}
