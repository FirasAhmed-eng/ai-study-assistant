"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStudyStore } from "@/store/useStudyStore";
import { fetchWithRetry } from "@/lib/api";
export default function Create() {
  const saveSessionToDb = useStudyStore((state) => state.saveSessionToDb);
  const router = useRouter();
  // Pull in  Zustand actions
  const setSessionText = useStudyStore((state) => state.setSessionText);
  const setGeneratedMaterials = useStudyStore(
    (state) => state.setGeneratedMaterials,
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Validations
  const MIN_CHARS = 100;
  const MAX_CHARS = 10000;
  const charCount = content.length;
  // Regex to accurately count words even with extra spaces
  const wordCount = content
    .trim() // remove leading/trailing spaces
    .split(/\s+/) // + means treat multiple spaces as a single space
    .filter((word) => word.length > 0).length;

  // Frontend validation rule: Title can't be empty, text must be >= minChars
  const isValid =
    title.trim() !== "" && charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const handleGenerate = async () => {
    if (!isValid) return;

    setIsGenerating(true);

    // 1. Save the raw text to our global state
    setSessionText(title, content);

    try {
      const baseOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      };
      // (2 retries, 20 second timeout per call)
      const [summaryData, flashcardsData, quizData] = await Promise.all([
        fetchWithRetry(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/ai/summarize`,
          baseOptions,
          2,
          20000,
        ),
        fetchWithRetry(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/ai/flashcards`,
          baseOptions,
          2,
          20000,
        ),
        fetchWithRetry(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/ai/quiz`,
          baseOptions,
          2,
          20000,
        ),
      ]);

      // 1. Process Summary
      // extract arrays with fallback empty arrays to prevent .map() errors
      const keyPoints = Array.isArray(summaryData?.keyPoints)
        ? summaryData.keyPoints
        : [];
      const importantTerms = Array.isArray(summaryData?.importantTerms)
        ? summaryData.importantTerms
        : [];
      const summaryText = summaryData?.summary || "No summary provided.";

      // Format into Markdown
      const markdownContent = `## Overview\n${summaryText}\n\n### Key Points\n${
        keyPoints.length > 0
          ? keyPoints.map((point: string) => `* ${point}`).join("\n")
          : "None provided."
      }\n\n### Important Terms\n${
        importantTerms.length > 0
          ? importantTerms.map((term: string) => `* **${term}**`).join("\n")
          : "None provided."
      }`;

      // 2. Process Flashcards ({ question, answer } -> { front, back })
      // Transform backend flashcards ({ question, answer }) into Zustand format ({ front, back })
      const rawCards = Array.isArray(flashcardsData?.cards)
        ? flashcardsData.cards
        : []; // return empty array if undefined
      const formattedCards = rawCards.map(
        (card: { question: string; answer: string }) => ({
          front: card.question,
          back: card.answer,
        }),
      );
      // 3. Process & Validate Quiz ({ question, options, correctAnswer } -> { question, options, answer })
      const rawQuiz = Array.isArray(quizData?.quiz) ? quizData.quiz : []; // return empty array if undefined
      const validatedQuiz = rawQuiz
        .filter(
          (q: {
            question: string;
            options: string[];
            correctAnswer: string;
            explanation: string;
          }) =>
            // Guard: Ensure valid question, at least 2 options, and valid correctAnswer
            q?.question &&
            Array.isArray(q?.options) &&
            q.options.length >= 2 &&
            q.options.includes(q.correctAnswer),
        )
        .map(
          (q: {
            question: string;
            options: string[];
            correctAnswer: string;
          }) => ({
            question: q.question,
            options: q.options,
            answer: q.correctAnswer, // Map to Zustand's answer field
          }),
        );
      // Store generated materials in global Zustand state
      setGeneratedMaterials(markdownContent, formattedCards, validatedQuiz);

      const newSessionId = await saveSessionToDb();
      if (newSessionId) {
        // Route to the new dynamic URL
        router.push(`/session/${newSessionId}`);
      } else {
        alert("Session generated, but failed to save to database.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong generating your study guide.");
    } finally {
      setIsGenerating(false);
    }
  };
  const loadExampleContent = () => {
    setTitle("Biology: The Mitochondria");
    setContent(
      "Mitochondria are membrane-bound cell organelles that generate most of the chemical energy needed to power the cell's biochemical reactions. Chemical energy produced by the mitochondria is stored in a small molecule called adenosine triphosphate (ATP. Mitochondria contain their own small chromosomes. Generally, mitochondria, and therefore mitochondrial DNA, are inherited only from the mother.",
    );
  };
  return (
    <div className=" max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Create Session
        </h1>
        <p className="text-muted-foreground mt-1">
          Paste your study material below to generate flashcards and quizzes.
        </p>
      </header>
      <div className="space-y-4">
        {/* Title Input */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Session Title
            <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            placeholder="e.g, Biology Chapter 4, Economics 101..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isGenerating}
            className="bg-white border-2 rounded-lg w-xs"
          />
        </div>
        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label
              htmlFor="content"
              className="text-sm font-medium leading-none"
            >
              Source Material <span className="text-red-500">*</span>
            </label>
            {/* Example Content Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={loadExampleContent}
              disabled={isGenerating}
              className="text-muted-foreground hover:text-primary h-8"
            >
              <Wand2 className="h-3.5 w-3.5 mr-2" />
              Paste Example
            </Button>
          </div>
          <Textarea
            id="content"
            placeholder="Paste the text you want to study here..."
            className="min-h-75 bg-white resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isGenerating}
          />
          {/* Character and Word Counter */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span
              className={
                charCount > 0 && charCount < MIN_CHARS
                  ? "text-destructive font-medium"
                  : ""
              }
            >
              {charCount} / {MAX_CHARS} characters. 
              {charCount < MIN_CHARS
                ? ` Need at least ${MIN_CHARS - charCount} more characters`
                : ""}
            </span>
            <span>
              {wordCount} words | {charCount} chars
            </span>
          </div>
        </div>
        {/* Generate Button */}
        <div className="pt-4">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating materials...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Study Guide
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
