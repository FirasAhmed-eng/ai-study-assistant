import { create } from "zustand";
import { supabase } from "@/lib/supabase";
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
  sessionId: string | null;
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
  appendChunkToLastMessage: (chunk: string) => void;
  saveSessionToDb: () => Promise<string | null>;
  loadSessionFromDb: (id: string) => Promise<void>;
}

// Create and export the store
export const useStudyStore = create<StudyState>((set, get) => ({
  // Initial empty state
  title: "",
  sourceText: "",
  summary: "",
  flashcards: [],
  quiz: [],
  messages: [],
  isLoading: false,
  error: null,
  sessionId: null,
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
  appendChunkToLastMessage: (chunk) =>
    set((state) => {
      const newMessages = [...state.messages];
      const lastIndex = newMessages.length - 1;

      // Ensure we are appending to an assistant message
      if (lastIndex >= 0 && newMessages[lastIndex].role === "assistant") {
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          content: newMessages[lastIndex].content + chunk,
        };
      }
      return { messages: newMessages };
    }),
  saveSessionToDb: async () => {
  const state = get(); 
  const { data, error } = await supabase
    .from('study_sessions')
    .insert([{
      title: state.title,
      source_text: state.sourceText,
      summary: state.summary,
      flashcards: state.flashcards,
      quiz: state.quiz,
      messages: state.messages
    }])
    .select()
    .single();

  if (error) {
    console.error("Failed to save session:", error);
    return null;
  }
  
  if (data) {
    set({ sessionId: data.id });
    return data.id; // Return the ID for the router
  }
  return null;
},

loadSessionFromDb: async (id: string) => {
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Failed to load session:", error);
    return;
  }

  if (data) {
    set({
      sessionId: data.id,
      title: data.title,
      sourceText: data.source_text,
      summary: data.summary,
      flashcards: data.flashcards || [],
      quiz: data.quiz || [],
      messages: data.messages || []
    });
  }
}
}));
