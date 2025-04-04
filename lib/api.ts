/**
 * API utility functions for making authenticated requests to the FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get an authentication token for the backend
 */
export async function getBackendToken(): Promise<string> {
  const response = await fetch('/api/auth/create-backend-token');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get backend token');
  }
  
  const data = await response.json();
  return data.token;
}

/**
 * Make an authenticated request to the backend API
 */
export async function fetchWithAuth(
  endpoint: string, 
  options: RequestInit = {}
) {
  try {
    // Get authentication token
    const token = await getBackendToken();
    
    // Prepare headers with authentication
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    
    // Make request with authentication
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Handle response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error making authenticated request:', error);
    throw error;
  }
}

/**
 * Example usage:
 * 
 * // GET request
 * const userData = await fetchWithAuth('/users/me');
 * 
 * // POST request with data
 * const result = await fetchWithAuth('/create-profile', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'John Doe', bio: 'Software developer' })
 * });
 */