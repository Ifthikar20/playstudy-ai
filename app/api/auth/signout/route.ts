import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the auth-token cookie
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');

    // Redirect to the homepage (localhost:3000/)
    return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}