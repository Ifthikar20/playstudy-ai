import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface SessionResponse {
  user: SessionUser | null;
}

export async function GET() {
  const session = await getUserSession();
  
  if (!session) {
    return NextResponse.json<SessionResponse>({ user: null });
  }

  return NextResponse.json<SessionResponse>({
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      image: session.image
    }
  });
}