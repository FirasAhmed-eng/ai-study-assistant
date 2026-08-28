import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50">
      <BookOpen className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-5xl font-bold text-slate-900 mb-6">
        AI Study Assistant
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mb-8">
        Turn your notes and study materials into structured summaries, flashcards, and quizzes in seconds.
      </p>
      <Link href="/dashboard">
        <Button size="lg" className="text-lg px-8 py-6">
          Get Started
        </Button>
      </Link>
    </div>
  );
}