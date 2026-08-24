"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStudyStore } from "@/store/useStudyStore";
export default function Create() {
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
  const minChars = 100;
  const charCount = content.length;
  // Regex to accurately count words even with extra spaces
  const wordCount = content
    .trim() // remove leading/trailing spaces
    .split(/\s+/) // + means treat multiple spaces as a single space
    .filter((word) => word.length > 0).length;

  // Frontend validation rule: Title can't be empty, text must be >= minChars
  const isValid = title.trim().length > 0 && charCount >= minChars;

  const handleGenerate = async () => {
    if (!isValid) return;

    setIsGenerating(true);

    // 1. Save the raw text to our global state
    setSessionText(title, content);

    try {
      // call the fastapi endpoint
      const response = await fetch("http://localhost:8000/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content }),
      });
      if (!response.ok) throw new Error("Failed to generate summary");
      const data = await response.json();
      // Update Zustand store with the real AI summary
      setGeneratedMaterials(data.summary, [], []);
      router.push("/session/current");
    } catch (error) {
      console.error(error);
      alert("Something went wrong connecting to the AI. ");
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
                charCount > 0 && charCount < minChars
                  ? "text-destructive font-medium"
                  : ""
              }
            >
              {charCount < minChars
                ? `Need at least ${minChars - charCount} more characters`
                : "Minimum length reached"}
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
