/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useStudyStore } from "@/store/useStudyStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check } from "lucide-react";

export function SummaryView() {
  const { summary, isLoading } = useStudyStore();
  const [copied, setCopied] = useState(false);

  // Copy button handler with 2-second checkmark feedback
  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Loading Skeleton State
  if (isLoading) return <SummarySkeleton />;

  // Empty State Guard
  if (!summary) {
    return <p className="text-slate-500 py-8 text-center">No summary available.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex justify-between items-center bg-slate-100/80 p-3 rounded-lg border border-slate-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          AI Generated Summary
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-8 gap-1.5 text-xs bg-white"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* Formatted Markdown Output */}
      <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-3">
        <ReactMarkdown
          components={{
            h2: ({ node, ...props }) => (
              <h2
                className="text-xl font-bold tracking-tight text-slate-900 mt-4 mb-2"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-lg font-semibold text-slate-800 mt-3 mb-1"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-5 space-y-1 my-2" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-sm text-slate-700" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-sm text-slate-700 leading-6" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-slate-900" {...props} />
            ),
          }}
        >
          {summary}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// Skeleton Loader Sub-component
function SummarySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="space-y-3 pt-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}