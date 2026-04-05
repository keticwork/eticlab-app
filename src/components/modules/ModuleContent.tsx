"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef, useId } from "react";

function MermaidBlock({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "-");

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        fontFamily: "sans-serif",
      });

      if (containerRef.current && !cancelled) {
        try {
          const { svg } = await mermaid.render(`mermaid-${uniqueId}`, chart);
          if (containerRef.current && !cancelled) {
            containerRef.current.innerHTML = svg;
          }
        } catch {
          if (containerRef.current && !cancelled) {
            containerRef.current.textContent = chart;
          }
        }
      }
    }
    render();
    return () => { cancelled = true; };
  }, [chart, uniqueId]);

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-lg bg-gray-50 p-4"
    >
      <p className="text-sm text-gray-400">Chargement du schéma...</p>
    </div>
  );
}

export function ModuleContent({ markdown }: { markdown: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
      <article className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-a:text-[#1D9E75] prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0A0F0D] prose-pre:text-sm prose-table:text-sm">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-mermaid/.exec(className || "");
              if (match) {
                return <MermaidBlock chart={String(children).trim()} />;
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    </div>
  );
}
