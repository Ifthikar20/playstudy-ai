import { NextResponse } from "next/server";

const CLIENT_ID = process.env.AUTH_GOOGLE_ID!;
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";
const AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;

export async function GET() {
  try {
    return NextResponse.redirect(new URL(AUTH_URL));
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return NextResponse.redirect(new URL("/signin?error=oauth_failed", AUTH_URL));
  }
}