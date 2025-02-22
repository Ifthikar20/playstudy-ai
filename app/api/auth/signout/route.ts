import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies(); // ✅ Await cookies() to properly access it
    cookieStore.delete("auth-token"); // ✅ Delete the auth-token correctly

    // ✅ Redirect based on environment (localhost vs. production)
    const isLocal = process.env.NODE_ENV !== "production";
    const redirectUrl = isLocal ? "http://localhost:3000" : process.env.NEXTAUTH_URL || "https://playstudy.ai";

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("Error signing out:", error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
