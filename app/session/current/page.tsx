"use client";

import { useStudyStore } from "@/store/useStudyStore";
import { SummaryView } from "@/components/ui/summary-view";
import { FlashcardView } from "@/components/ui/flashcard-view";
import { QuizView } from "@/components/ui/quiz-view"; // 1. Import the Quiz
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Layers, CheckSquare } from "lucide-react"; // 2. Import CheckSquare icon
import Link from "next/link";
import { ChatView } from "@/components/ui/chat-view";
import { MessageSquare } from "lucide-react";

export default function CurrentSessionPage() {
  const title =
    useStudyStore((state) => state.title) || "Biology — Cell Structure";

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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="summary" className="w-full">
        {/* 3. Updated Grid Columns and Added Quiz Trigger */}
        <TabsList className="grid w-full grid-cols-4 max-w-125 mb-6">
          <TabsTrigger value="summary" className="gap-2">
            <FileText className="h-4 w-4 hidden sm:block" /> Summary
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="gap-2">
            <Layers className="h-4 w-4 hidden sm:block" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="quiz" className="gap-2">
            <CheckSquare className="h-4 w-4 hidden sm:block" /> Quiz
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4 hidden sm:block" /> Chat
          </TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent
          value="summary"
          className="bg-white rounded-xl border p-6 shadow-sm"
        >
          <SummaryView />
        </TabsContent>

        {/* Flashcards Tab */}
        <TabsContent
          value="flashcards"
          className="bg-white rounded-xl border p-2 sm:p-6 shadow-sm min-h-125 flex items-center"
        >
          <FlashcardView />
        </TabsContent>

        {/* 4. New Quiz Tab Content */}
        <TabsContent
          value="quiz"
          className="bg-white rounded-xl border p-4 sm:p-8 shadow-sm min-h-125"
        >
          <QuizView />
        </TabsContent>
        <TabsContent
          value="chat"
          className="bg-white rounded-xl border p-0 shadow-sm flex items-center"
        >
          <ChatView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
