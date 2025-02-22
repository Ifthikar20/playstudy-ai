// app/dashboard/_components/Header.tsx
"use client";

import { Search, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { SessionUser } from "@/app/api/auth/session/route";

export default function Header() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  return (
    <header className="p-4 sm:p-5 shadow-sm border-b border-gray-800 bg-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
    <div className="flex items-center w-full sm:w-auto max-w-lg bg-gray-700 rounded-md p-2">
      <Search className="h-5 w-5 text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent outline-none text-[var(--foreground)] w-full"
      />
    </div>
    <div className="flex items-center gap-3 sm:gap-4">
      {user && (
        <h1 className="text-sm sm:text-lg font-semibold flex gap-1">
          <span>Welcome,</span>
          <span className="text-purple-400">{user.name?.split(" ")[0] || "User"} 👋</span>
        </h1>
      )}
      <Rocket className="h-5 w-5 text-purple-500" />
      <span className="text-xs sm:text-sm bg-purple-600 px-2 py-1 rounded-full hover:bg-purple-700 transition-all">
        Upgrade to Pro - $9.99/mo
      </span>
    </div>
  </header>
  );
}