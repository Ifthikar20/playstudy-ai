// /Users/ifthikaraliseyed/Desktop/AI_PLAY_STUDY/playstudy-ai/app/dashboard/layout.tsx
import React from "react";
import SideNav from "./_components/SideNav";
import Header from "./_components/Header";
import { GameProvider } from "./_components/GameContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GameProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="hidden md:block md:w-64 fixed h-screen">
          <SideNav />
        </div>
        <div className="md:ml-64">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </GameProvider>
  );
}