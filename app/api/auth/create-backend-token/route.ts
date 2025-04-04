import { NextResponse } from 'next/server';
import { getUserSession, createBackendToken } from '@/lib/auth';

export async function GET() {
  try {
    console.log('Backend token API endpoint called');
    // Get the current user session
    const session = await getUserSession();
    
    if (!session) {
      console.log('No valid session found for backend token generation');
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to generate a backend token' },
        { status: 401 }
      );
    }

    console.log('Valid session found, generating backend token');
    // Create a backend token with the user information
    const backendToken = await createBackendToken(session);

    // Return the token to the client
    console.log('Returning backend token to client');
    return NextResponse.json({ token: backendToken });
  } catch (error) {
    console.error('Error creating backend token:', error);
    return NextResponse.json(
      { error: 'Failed to create backend token' },
      { status: 500 }
    );
  }
}