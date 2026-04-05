"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ModuleContent({ markdown }: { markdown: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
      <article className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-a:text-[#1D9E75] prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0A0F0D] prose-pre:text-sm prose-table:text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </article>
    </div>
  );
}
