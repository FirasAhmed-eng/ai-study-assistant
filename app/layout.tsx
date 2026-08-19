import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Study Assistant",
  description: "Generate summaries, flashcards, and quizzes in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}
      >
        {/* The provider manages the open/collapsed state of the sidebar */}
        <SidebarProvider defaultOpen = {false}  >
          <AppSidebar />
          <div className="mt-2">
            <SidebarTrigger />
          </div>

          {/* Added 'w-full' so the container fills the remaining space next to the sidebar */}
          <main className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
