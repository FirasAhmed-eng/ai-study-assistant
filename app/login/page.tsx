/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (action: "login" | "signup") => {
    setLoading(true);
    try {
      const { error } =
        action === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      if (action === "signup") {
        alert("Check your email for the confirmation link!");
      } else {
        router.push("/dashboard"); // Redirect on successful login
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <div className="flex gap-2 mt-2 w-full justify-center ">
          <Button
            onClick={() => handleAuth("login")}
            disabled={loading}
            className="w-1/3"
          >
            Log In
          </Button>
          <Button
            onClick={() => handleAuth("signup")}
            variant="outline"
            disabled={loading}
            className="w-1/3"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
