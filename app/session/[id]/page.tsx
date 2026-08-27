"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStudyStore } from "@/store/useStudyStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Layers,
  HelpCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";

import { SummaryView } from "@/components/ui/summary-view";
import { FlashcardView } from "@/components/ui/flashcard-view";
import { QuizView } from "@/components/ui/quiz-view";
import { ChatView } from "@/components/ui/chat-view";

export default function SessionPage() {
  const params = useParams();
  const id = params.id as string;

  const { loadSessionFromDb, sessionId, title } = useStudyStore();
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    const initializeSession = async () => {
      // If the store doesn't already have this session loaded, fetch it
      if (sessionId !== id) {
        await loadSessionFromDb(id);
      }
      setIsInitializing(false);
    };
    initializeSession();
  }, [id, sessionId, loadSessionFromDb]);
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">
          Loading your study session...
        </p>
      </div>
    );
  }
 return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">{title || "Study Session"}</h1>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-150 mb-6">
          <TabsTrigger value="summary" className="gap-2"><BookOpen className="h-4 w-4 hidden sm:block" /> Summary</TabsTrigger>
          <TabsTrigger value="flashcards" className="gap-2"><Layers className="h-4 w-4 hidden sm:block" /> Flashcards</TabsTrigger>
          <TabsTrigger value="quiz" className="gap-2"><HelpCircle className="h-4 w-4 hidden sm:block" /> Quiz</TabsTrigger>
          <TabsTrigger value="chat" className="gap-2"><MessageSquare className="h-4 w-4 hidden sm:block" /> Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="summary"><SummaryView /></TabsContent>
        <TabsContent value="flashcards"><FlashcardView /></TabsContent>
        <TabsContent value="quiz"><QuizView /></TabsContent>
        <TabsContent value="chat"><ChatView /></TabsContent>
      </Tabs>
    </div>
  );
}
