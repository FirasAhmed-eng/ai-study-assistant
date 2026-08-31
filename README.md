# AI Study Assistant 🧠

## What the project does
The AI Study Assistant is a full-stack learning platform that instantly transforms raw text into a comprehensive, interactive study session. Users can paste their notes or reading materials, and the application automatically generates structured summaries, flashcards, multiple-choice quizzes, and provides an interactive AI tutor contextualized exactly to the provided material.

## Tech Stack
*   **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
*   **State Management:** Zustand
*   **Backend:** Python, FastAPI
*   **Database & Auth:** Supabase (PostgreSQL) with Row Level Security (RLS)
*   **AI Integration:** OpenAI API (gpt-4o-mini)

## Architecture
1.  **Client:** Next.js handles the UI, routing, and optimistic state updates via Zustand.
2.  **API Gateway:** A FastAPI Python backend processes requests, validates schemas, and manages secure communication with OpenAI.
3.  **Database:** Supabase acts as the primary data store, securely saving user sessions, generated materials, and chat histories using PostgreSQL JSONB columns and Row Level Security.

## AI Implementation
*   **Contextual Q&A:** The AI chat injects the user's study material and previous conversation history directly into the system instructions, creating a highly focused tutor.
*   **Structured Outputs:** Uses Pydantic models to force the LLM to return strictly typed JSON, ensuring the UI never breaks due to malformed quiz questions or flashcards.
*   **Streaming Responses:** Implements asynchronous generators and the browser's ReadableStream API to deliver ChatGPT-like real-time typing experiences.

### Prerequisites
*   Node.js 18+
*   Python 3.10+
*   Supabase account
*   OpenAI API Key
