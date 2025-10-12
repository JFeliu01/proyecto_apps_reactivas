// Runtime-configured API base URL with sensible fallbacks
// Order: window.__ENV.API_URI (runtime) → Vite env → localhost
export const API_URI: string = (
  (typeof window !== 'undefined' && (window as any)?.__ENV?.API_URI)
  || (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_URI)
  || 'http://localhost:3001'
);


