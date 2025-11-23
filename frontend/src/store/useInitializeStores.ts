import { useEffect } from 'react';
import { useAuthStore } from './useAuthStore';
import { useChampionsStore } from './useChampionsStore';

/**
 * Hook to initialize the application stores
 * - Restores auth session from localStorage
 * - Fetches champions data
 */
export function useInitializeStores() {
  const { refresh, token, status } = useAuthStore();
  const { fetchChampions, champions } = useChampionsStore();

  // Restore auth session on mount
  useEffect(() => {
    if (token && status === 'idle') {
      refresh();
    }
  }, [token, status, refresh]);

  // Fetch champions data on mount
  useEffect(() => {
    if (!champions) {
      fetchChampions();
    }
  }, [champions, fetchChampions]);
}
