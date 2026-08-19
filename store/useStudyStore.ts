import { create } from "zustand";

// Define the shapes of the AI data
export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Define the entire State and Actions
interface StudyState {
  // State variables
  title: string;
  sourceText: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Actions to modify the state
  setSessionText: (title: string, text: string) => void;
  setGeneratedMaterials: (
    summary: string,
    flashcards: Flashcard[],
    quiz: QuizQuestion[],
  ) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
}

// Create and export the store
export const useStudyStore = create<StudyState>((set) => ({
  // Initial empty state
  title: "",
  sourceText: "",
  summary: "",
  flashcards: [],
  quiz: [],
  messages: [],
  isLoading: false,
  error: null,

  // Action implementations
  setSessionText: (title, text) => set({ title, sourceText: text }),

  setGeneratedMaterials: (summary, flashcards, quiz) =>
    set({ summary, flashcards, quiz, isLoading: false }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  clearSession: () =>
    set({
      title: "",
      sourceText: "",
      summary: "",
      flashcards: [],
      quiz: [],
      messages: [],
      isLoading: false,
      error: null,
    }),
}));
