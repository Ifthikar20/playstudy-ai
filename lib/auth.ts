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
  [key: string]: string | null;
}

interface JWTPayload {
  [key: string]: unknown;
  id?: string;
  email?: string;
  name?: string | null;
  image?: string | null;
}

export async function getUserSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      console.log('No auth-token found in cookies');
      return null;
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as JWTPayload;

    if (!isValidSession(payload)) {
      console.error('Invalid session payload:', payload);
      return null;
    }

    const session: UserSession = {
      id: payload.id,
      email: payload.email,
      name: payload.name ?? null,
      image: payload.image ?? null
    };

    return session;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function createSession(user: UserSession) {
  const expiresInSeconds = 60; // 60 seconds
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${expiresInSeconds}s`) // Align JWT expiration with cookie
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + expiresInSeconds * 1000), // 60 seconds
  });

  return token;
}

function isValidSession(payload: JWTPayload): payload is JWTPayload & Required<Pick<JWTPayload, 'id' | 'email'>> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof payload.id === 'string' &&
    typeof payload.email === 'string' &&
    (payload.name === null || typeof payload.name === 'string') &&
    (payload.image === null || typeof payload.image === 'string')
  );
}