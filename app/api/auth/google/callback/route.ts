import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

const CLIENT_ID = process.env.AUTH_GOOGLE_ID!;
const CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET!;

// ✅ Use environment logic for REDIRECT_URI
const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_REDIRECT_URI || "https://playstudy.ai/api/auth/google/callback"
    : "http://localhost:3000/api/auth/google/callback";

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token?: string;
  id_token?: string;
}

interface GoogleUserResponse {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(new URL(`/signin?error=${error}`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/signin?error=no_code", request.url));
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI, // ✅ Uses correct environment-based URI
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange authorization code for tokens");
    }

    const tokenData = await tokenResponse.json() as GoogleTokenResponse;

    // Fetch user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user information");
    }

    const userData = await userResponse.json() as GoogleUserResponse;

    // Create session
    await createSession({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      image: userData.picture ?? null,
    });

    // ✅ Redirect to dashboard based on environment
    const baseUrl = process.env.NODE_ENV === "production"
    ? (process.env.NEXTAUTH_URL || "https://playstudy.ai")
    : "http://localhost:3000";
  const redirectUrl = `${baseUrl}/dashboard`;
  return NextResponse.redirect(new URL(redirectUrl));
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/signin?error=auth_error&message=${encodeURIComponent(
          error instanceof Error ? error.message : "Unknown error"
        )}`,
        request.url
      )
    );
  }
}
