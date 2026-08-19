/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useStudyStore } from "@/store/useStudyStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check, RefreshCw, Lightbulb } from "lucide-react";

export function SummaryView() {
  const {
    summary,
    isLoading,
    setLoading,
    setGeneratedMaterials,
    flashcards,
    quiz,
  } = useStudyStore();
  const [copied, setCopied] = useState(false);

  // Fallback mock summary if user navigates directly without creating text first
  const displaySummary =
    summary ||
    `## Key Overview
The **mitochondrion** is a double-membrane-bound organelle found in most eukaryotic organisms. Often referred to as the *"powerhouse of the cell"*, its primary function is to generate chemical energy.

### Essential Functions
* **ATP Production**: Converts nutrients into adenosine triphosphate (ATP) through cellular respiration.
* **Maternal Inheritance**: Mitochondrial DNA (mtDNA) is inherited almost exclusively from the mother.
* **Apoptosis Regulation**: Plays a critical role in programmed cell death.

### Structure
1. **Outer Membrane**: Encloses the entire organelle.
2. **Inner Membrane**: Folded into structures called *cristae* to increase surface area.
3. **Matrix**: The fluid-filled space inside the inner membrane containing enzymes.`;

  // Copy button handler with 2-second checkmark feedback
  const handleCopy = () => {
    navigator.clipboard.writeText(displaySummary);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  // Regenerate handler to simulate AI re-processing
  const handleRegenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setGeneratedMaterials(
        `## Regenerated Summary: Cellular Energy & ATP
Mitochondria play a pivotal role in cellular metabolic processes by transforming glucose and oxygen into energy molecules.

### Key Updates
* **Cristae Density**: Correlates directly with the energy demand of the host cell.
* **Binary Fission**: Mitochondria divide independently of the host cell cycle.`,
        flashcards,
        quiz,
      );
      setLoading(false);
    }, 1500);
  };
  // Loading Skeleton State
  if (isLoading) return <SummarySkeleton />;
  return (
    <div className="spacy-y-6">
      {/* Header Toolbar */}
      <div className="flex justify-between items-center bg-slate-100/80 p-3 rounded-lg border border-slate-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          AI Generated Summary
        </span>
        <div className="flex items-center gap-2">
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

          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            className="h-8 gap-1.5 text-xs bg-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        </div>
      </div>
      {/* Key Concepts Box */}
      <Card className="border-amber-200 bg-amber-50/50 shadow-none">
        <CardHeader className="pb-2 flex flex-row items-center gap-2 space-y-0">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-base text-amber-900 font-semibold">
            Key Concepts
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-900/80 space-y-1">
          <p>
            • ATP is the universal energy currency generated inside the matrix.
          </p>
          <p>
            • Inner foldings (cristae) maximize internal surface area for
            efficiency.
          </p>
        </CardContent>
      </Card>
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
          {displaySummary}
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
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
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
