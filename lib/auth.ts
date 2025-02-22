import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key'
);

export interface UserSession {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export async function getUserSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;

    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload;

    if (!isUserSessionPayload(payload)) {
      console.error('Invalid session payload:', payload);
      return null;
    }

    return payload as UserSession;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function createSession(user: UserSession) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
  });

  return token;
}

function isUserSessionPayload(payload: any): payload is UserSession {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof payload.id === 'string' &&
    typeof payload.email === 'string' &&
    (payload.name === null || typeof payload.name === 'string') &&
    (payload.image === null || typeof payload.image === 'string')
  );
}