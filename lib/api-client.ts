const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function getBackendToken(): Promise<string> {
  const response = await fetch('/api/auth/create-backend-token');
  if (!response.ok) throw new Error("Failed to fetch backend token");
  const data = await response.json();
  return data.token;
}

export async function fetchFromBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getBackendToken();

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return await response.json();
}
export async function getUserProfile(): Promise<{
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  created_at: string;
}> {
  return fetchFromBackend('users/me');
}
