/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // Import a trash icon
export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    // 1. Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    // 2. Fetch ONLY this user's sessions
    const { data, error } = await supabase
      .from("study_sessions")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) setSessions(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    // 1. Delete from Supabase
    const { error } = await supabase
      .from("study_sessions")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete session.");
      console.error(error);
    } else {
      // 2. Remove from local state immediately so the UI updates
      setSessions(sessions.filter((session) => session.id !== id));
    }
  };
  if (loading) return <p className="text-center mt-20">Loading dashboard...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Study Sessions</h1>
        <div className="flex gap-4">
          <Link href="/create">
            <Button>+ New Session</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-start justify-between p-4 border rounded-lg hover:border-primary transition-colors group"
          >
            {/* Clickable area for opening the session */}
            <div
              className="cursor-pointer flex-1"
              onClick={() => router.push(`/session/${s.id}`)}
            >
              <h2 className="font-semibold text-lg text-slate-800">
                {s.title}
              </h2>
              <p className="text-sm text-slate-500">
                {new Date(s.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(s.id)}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-slate-50 rounded-lg border border-dashed">
            <p className="text-slate-500 mb-4">No sessions yet.</p>
            <Link href="/create">
              <Button variant="outline">Create your first study guide</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
