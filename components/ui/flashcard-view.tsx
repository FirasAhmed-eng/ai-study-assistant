"use client";

import { useState, useEffect, useCallback } from "react";
import { useStudyStore } from "@/store/useStudyStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export function FlashcardView() {
  const { flashcards } = useStudyStore();
  
  // Fallback mock data if the store is empty
  const cards = flashcards.length > 0 ? flashcards : [
    { front: "What is photosynthesis?", back: "The process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water." },
    { front: "What is the powerhouse of the cell?", back: "The Mitochondria." },
    { front: "What does ATP stand for?", back: "Adenosine Triphosphate." },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;
  const progressPercentage = Math.round(((currentIndex + 1) / totalCards) * 100);

  // Navigation Handlers
  const handleNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150); // slight delay for unflip
    }
  }, [currentIndex, totalCards]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard Shortcuts (Space to flip, Arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleNext, handlePrev]);

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6 w-full py-4">
      
      {/* 1. Header & Counter */}
      <div className="w-full flex justify-between items-center text-sm font-medium text-slate-500">
        <span>Card {currentIndex + 1} of {totalCards}</span>
        <span>{progressPercentage}% Mastered</span>
      </div>

      {/* 2. Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-slate-900 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* 3. The 3D Flashcard */}
      {/* perspective creates the 3D depth field */}
      <div 
        className="relative w-full h-80 cursor-pointer [perspective:1000px] group"
        onClick={handleFlip}
      >
        <div 
          className={`w-full h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
            <div className="w-full h-full bg-white border-2 border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center p-8 text-center hover:border-slate-300 transition-colors">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Question</span>
              <h2 className="text-2xl font-medium text-slate-800 leading-snug">
                {currentCard.front}
              </h2>
              <div className="absolute bottom-6 text-xs text-slate-400 flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Click or press Space to flip
              </div>
            </div>
          </div>

          {/* BACK OF CARD */}
          {/* rotateY(180deg) puts it on the back, backface-visibility hides it until flipped */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="w-full h-full bg-slate-900 border-2 border-slate-900 rounded-2xl shadow-md flex flex-col items-center justify-center p-8 text-center text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Answer</span>
              <p className="text-xl font-light leading-relaxed">
                {currentCard.back}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Navigation Controls */}
      <div className="flex items-center gap-4 pt-4">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="w-32 bg-white"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>

        <Button 
          variant="default" 
          size="lg" 
          onClick={handleNext} 
          disabled={currentIndex === totalCards - 1}
          className="w-32"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

    </div>
  );
}