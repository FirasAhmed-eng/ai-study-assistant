"use client";

import { SummaryView } from "@/components/ui/summary-view";
import { useStudyStore } from "@/store/useStudyStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CurrentSessionPage() {
  const title = useStudyStore((state) => state.title) || "Biology — Cell Structure";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-slate-900 mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      </div>

      {/* Summary View Shell */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <SummaryView />
      </div>

    </div>
  );
}