/**
 * API client for Monexo backend (Django REST).
 * Uses session auth and CSRF for cookie-based auth.
 * In production, VITE_API_BASE_URL is set at build time (e.g. https://oxinero.chilusoft.dev/backend/api).
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') || '/api';

function getCsrfToken(): string | null {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const [k, v] = c.trim().split('=');
    if (k === name) return decodeURIComponent(v || '');
  }
  return null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const csrf = getCsrfToken();
  if (csrf) headers['X-CSRFToken'] = csrf;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.error || `HTTP ${res.status}`);
  return data as T;
}

/** Call once on app load to ensure Django sets the CSRF cookie. */
export async function ensureCsrf(): Promise<void> {
  await fetch(`${API_BASE}/auth/csrf/`, { method: 'GET', credentials: 'include' });
}

export const api = {
  ensureCsrf,
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export default api;
