// /Users/ifthikaraliseyed/Desktop/AI_PLAY_STUDY/playstudy-ai/app/dashboard/_components/Games/GameLayout.tsx
"use client";

import { Gamepad } from "lucide-react";
import { ReactNode } from "react";

interface GameLayoutProps {
  title: string;
  children: ReactNode;
}

export default function GameLayout({ title, children }: GameLayoutProps) {
  return (
    <div className="mt-6 card-hover p-4 sm:p-6 lg:p-8 col-span-full relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl" />
      
      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2 relative z-10">
        <Gamepad className="h-6 w-6 text-purple-500 animate-spin-slow" />
        {title}
      </h2>
      
      {/* Inner content area */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-inner relative z-10">
        {children}
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-full filter blur-xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full filter blur-xl animate-pulse delay-75" />
    </div>
  );
}