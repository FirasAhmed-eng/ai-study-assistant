"use client";

import { useState } from "react";
import { useStudyStore } from "@/store/useStudyStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Award, RotateCcw, ListChecks } from "lucide-react";

export function QuizView() {
  const { quiz } = useStudyStore();
  
  // Mock data fallback if the store is empty
  const questions = quiz.length > 0 ? quiz : [
    { 
      question: "How is mitochondrial DNA inherited?", 
      options: ["From the father", "From the mother", "Equally from both", "Randomly"], 
      answer: "From the mother" 
    },
    { 
      question: "What is the primary function of the mitochondria?", 
      options: ["Protein synthesis", "Photosynthesis", "ATP production", "Cell division"], 
      answer: "ATP production" 
    },
    { 
      question: "Which molecule stores chemical energy?", 
      options: ["RNA", "DNA", "ATP", "ADP"], 
      answer: "ATP" 
    }
  ];

  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Handlers
  const handleSelect = (option: string) => {
    if (!isSubmitted) setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    setIsSubmitted(true);
    if (selectedAnswer === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setIsFinished(false);
    setShowReview(false);
  };

  // --- RENDERING: FINISHED STATE ---
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto py-12 text-center animate-in zoom-in-95 duration-500">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Award className="h-12 w-12 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Quiz Completed!</h2>
          <p className="text-muted-foreground text-lg">
            You scored {score} / {totalQuestions}
          </p>
        </div>
        
        <div className="text-5xl font-black text-slate-900 tracking-tighter">
          {percentage}%
        </div>

        <div className="flex gap-4 pt-6 w-fit justify-center">
          <Button variant="outline" size="lg" className="w-full bg-white" onClick={() => setShowReview(true)}>
            <ListChecks className="mr-2 h-4 w-4" /> Review Answers
          </Button>
          <Button size="lg" className="w-full" onClick={handleTryAgain}>
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>

        {/* Simple Review Mode List */}
        {showReview && (
          <div className="w-full mt-8 space-y-4 text-left border-t pt-8">
            <h3 className="font-semibold text-lg mb-4">Answer Key</h3>
            {questions.map((q, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-lg border">
                <p className="font-medium text-slate-900 text-sm mb-2">{i + 1}. {q.question}</p>
                <p className="text-green-700 text-sm font-semibold flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> {q.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- RENDERING: ACTIVE QUIZ STATE ---
  return (
    <div className="max-w-2xl mx-auto w-full space-y-8 py-4">
      
      {/* Header & Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-medium text-slate-500">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-900 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-semibold text-slate-900 leading-snug">
        {currentQ.question}
      </h2>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQ.answer;
          
          // Determine styling based on submission state
          let buttonStyles = "justify-start text-left h-auto py-4 px-6 text-base font-normal whitespace-normal transition-all ";
          
          if (!isSubmitted) {
            buttonStyles += isSelected 
              ? "border-primary bg-primary/5 ring-1 ring-primary" 
              : "bg-white hover:bg-slate-50 hover:border-slate-300";
          } else {
            if (isCorrect) {
              buttonStyles += "border-green-500 bg-green-50 text-green-900 ring-1 ring-green-500";
            } else if (isSelected && !isCorrect) {
              buttonStyles += "border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500 opacity-80";
            } else {
              buttonStyles += "bg-white opacity-40";
            }
          }

          return (
            <Button
              key={idx}
              variant="outline"
              className={buttonStyles}
              onClick={() => handleSelect(option)}
              disabled={isSubmitted}
            >
              <div className="flex items-center justify-between w-full gap-4">
                <span>{option}</span>
                {isSubmitted && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600 shrink-0" />}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Action Area */}
      <div className="pt-4 flex justify-end">
        {!isSubmitted ? (
          <Button 
            size="lg" 
            onClick={handleSubmit} 
            disabled={!selectedAnswer}
            className="w-full sm:w-auto"
          >
            Submit Answer
          </Button>
        ) : (
          <Button 
            size="lg" 
            onClick={handleNext}
            className="w-full sm:w-auto"
          >
            {currentIndex < totalQuestions - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        )}
      </div>
    </div>
  );
}