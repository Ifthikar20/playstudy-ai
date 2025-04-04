/**
 * API client for making authenticated requests to the FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get an authentication token for the backend
 */
export async function getBackendToken(): Promise<string> {
  console.log('Requesting backend token from Next.js API');
  const response = await fetch('/api/auth/create-backend-token');
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Backend token request failed:', error);
    throw new Error(error.error || 'Failed to get backend token');
  }
  
  const data = await response.json();
  console.log('Successfully obtained backend token');
  return data.token;
}

/**
 * Make an authenticated request to the FastAPI backend
 */
export async function fetchFromBackend<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    console.log(`Making authenticated request to: ${endpoint}`);
    
    // Get authentication token
    const token = await getBackendToken();
    console.log('Token obtained, proceeding with authenticated request');
    
    // Prepare headers with authentication
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    
    // Make request with authentication
    console.log(`Sending request to ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Handle response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend request failed:', errorData);
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Backend request successful');
    return responseData as T; // Type assertion for clarity
  } catch (error) {
    console.error('Error making authenticated request:', error);
    throw error;
  }
}

// Example usage functions with explicit types

/**
 * Example: Get user profile from the backend
 */
export async function getUserProfile(): Promise<{ id: string; username: string; email: string }> {
  return fetchFromBackend<{ id: string; username: string; email: string }>('/api/user/profile');
}

/**
 * Example: Create a new note in the backend
 */
export async function createNote(title: string, content: string): Promise<{ id: string; title: string; content: string }> {
  return fetchFromBackend<{ id: string; title: string; content: string }>('/api/notes', {
    method: 'POST',
    body: JSON.stringify({ title, content })
  });
}

/**
 * Example: Update user game progress
 */
export async function updateGameProgress(gameId: string, score: number): Promise<{ gameId: string; score: number }> {
  return fetchFromBackend<{ gameId: string; score: number }>(`/api/games/${gameId}/progress`, {
    method: 'PUT',
    body: JSON.stringify({ score })
  });
}