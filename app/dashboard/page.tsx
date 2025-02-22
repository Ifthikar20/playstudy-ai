// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brain, Gamepad, Book } from "lucide-react";

interface User {
  name: string | null;
  email: string;
  image: string | null;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/signin");
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        router.push("/signin");
      }
    }
    fetchSession();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { redirectUrl } = await response.json();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (!user) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="card-hover p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">Active Learning</h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Engage with interactive quizzes and games to boost retention.
          </p>
        </div>
        <div className="card-hover p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <Gamepad className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">Game-Based Learning</h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Turn subjects into fun, AI-powered games.
          </p>
        </div>
        <div className="card-hover p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <Book className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">Note Transformation</h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Convert your notes into interactive experiences.
          </p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleSignOut}
          className="btn-primary text-sm sm:text-base"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}