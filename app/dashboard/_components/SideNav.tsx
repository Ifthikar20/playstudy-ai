"use client";

import { usePathname } from "next/navigation";
import { Home, FileClock, WalletCards, Settings, Gamepad, LogOut } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

export default function SideNav() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "Your notes", icon: FileClock, path: "/dashboard/your_notes" },
    { name: "Your performance", icon: WalletCards, path: "/dashboard/your_performance" },
    { name: "Billing", icon: WalletCards, path: "/dashboard/billing" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  const handleSignOut = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Sign out failed");
      const { redirectUrl } = await response.json();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }, []);

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-gray-800 shadow-sm border-r border-gray-700">
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
          <Gamepad className="h-6 w-6 text-purple-500" />
          <span className="text-lg font-bold text-[var(--foreground)]">PlayStudy.AI</span>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              prefetch={false} // Disable prefetching
              className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                pathname === item.path
                  ? "nav-active"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm sm:text-base">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Sign Out Button */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 p-3 w-full rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm sm:text-base">Sign Out</span>
        </button>
      </div>
    </div>
  );
}