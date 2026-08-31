"use client";

import { useState, useRef, useEffect } from "react";
import { useStudyStore } from "@/store/useStudyStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, AlertCircle, Loader2 } from "lucide-react";

export function ChatView() {
  const { messages, addMessage, sourceText, appendChunkToLastMessage } =
    useStudyStore();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Provide an initial greeting if the chat is empty
  const displayMessages =
    messages.length > 0
      ? messages
      : [
          {
            role: "assistant" as const,
            content:
              "Hi! I'm your AI study assistant. What questions do you have about this material?",
          },
        ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    // Take a snapshot of the history BEFORE we add the optimistic UI messages
    const chatHistory = [...messages];

    // Optimistically add user message
    addMessage({ role: "user", content: currentInput });
    setInput("");
    setError(null);

    // Push an empty assistant message that we will stream text into
    addMessage({ role: "assistant", content: "" });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/ai/chat}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            material: sourceText,
            history: chatHistory,
            question: currentInput,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to connect to the AI");
      if (!response.body) throw new Error("No readable stream available");

      // Initialize the stream reader and text decoder
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // Read the stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the raw bytes into a string
        const chunk = decoder.decode(value, { stream: true });

        // Dispatch directly to Zustand
        appendChunkToLastMessage(chunk);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to stream AI response. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-125 max-w-3xl mx-auto w-full border rounded-xl overflow-hidden bg-slate-50 shadow-sm">
      {/* Message List Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth"
      >
        {displayMessages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={idx}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}

              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                  isUser
                    ? "bg-slate-900 text-white rounded-br-sm"
                    : "bg-white border text-slate-800 rounded-bl-sm shadow-sm"
                }`}
              >
                {msg.content}
              </div>

              {isUser && (
                <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isTyping && (
          <div className="flex gap-3 justify-start items-center text-slate-500 animate-in fade-in duration-300">
            <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3 bg-white border rounded-2xl rounded-bl-sm shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs font-medium">AI is typing...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg animate-in fade-in">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about your study guide..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1 bg-slate-50 focus-visible:ring-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="gap-2"
          >
            Send <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
