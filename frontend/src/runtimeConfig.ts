// Runtime-configured API base URL with sensible fallbacks
// Order: window.__ENV.API_URI (runtime) → Vite env → empty string (same origin)
export const API_URI: string = (
  (typeof window !== 'undefined' && (window as any)?.__ENV?.API_URI)
  || (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_URI)
  || ''  // Empty string = same origin (production)
);


