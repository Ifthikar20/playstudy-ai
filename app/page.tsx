// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">
        playstudy.ai <span className="text-lg font-normal">(using AI to leverage learning)</span>
      </h1>
      <p className="text-lg mb-6">Welcome to the future of learning with AI.</p>
      <Link href="/api/auth/login">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Login with Google
        </button>
      </Link>
    </div>
  );
}