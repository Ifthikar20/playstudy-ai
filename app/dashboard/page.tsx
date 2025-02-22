'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/signin');
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        router.push('/signin');
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
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signout failed");
      }
  
      const { redirectUrl } = await response.json();
      window.location.href = redirectUrl; // ✅ Redirect client manually to avoid CORS issues
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="max-w-4xl w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user.name || 'User'}! 👋
        </h1>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <p className="text-gray-300 mb-4">
            You are signed in as: {user.email}
          </p>
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
          {/* Add your dashboard content here */}
        </div>
      </div>
    </div>
  );
}