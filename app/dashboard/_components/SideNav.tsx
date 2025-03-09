"use client";

import { usePathname } from "next/navigation";
import { Home, FileClock, WalletCards, Settings, Gamepad } from "lucide-react";
import Link from "next/link";

export default function SideNav() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "Your notes", icon: FileClock, path: "/dashboard/your_notes" },
    { name: "Your performance", icon: WalletCards, path: "/dashboard/your_performance" },
    { name: "Billing", icon: WalletCards, path: "/dashboard/billing" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <div className="h-full p-5 bg-gray-800 shadow-sm border-r border-gray-700">
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
  );
}
