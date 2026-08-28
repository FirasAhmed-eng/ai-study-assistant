/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    // 1. Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
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

  if (loading) return <p className="text-center mt-20">Loading dashboard...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Study Sessions</h1>
        <div className="flex gap-4">
          <Link href="/create">
            <Button>+ New Session</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <Link href={`/session/${s.id}`} key={s.id}>
            <div className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
              <h2 className="font-semibold text-lg">{s.title}</h2>
              <p className="text-sm text-slate-500">
                {new Date(s.created_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
        {sessions.length === 0 && (
          <p className="text-slate-500">No sessions yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}