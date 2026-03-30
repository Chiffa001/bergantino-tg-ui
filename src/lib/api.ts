const FALLBACK_API_URL = 'https://localhost:8000';

export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL?.trim() || FALLBACK_API_URL;
}
