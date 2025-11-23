/**
 * Example tests for Zustand stores
 * 
 * To run these tests, you'll need to install:
 * npm install --save-dev vitest @testing-library/react @testing-library/react-hooks
 */

import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './useAuthStore';
import { useChampionsStore } from './useChampionsStore';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
  });

  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('should update status when logging in', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setStatus('loading');
    });
    
    expect(result.current.status).toBe('loading');
  });

  it('should store user and token on successful login', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser = {
      _id: '123',
      name: 'Test User',
      email: 'test@example.com',
    };
    const mockToken = 'mock-jwt-token';

    act(() => {
      result.current.setUser(mockUser);
      result.current.setToken(mockToken);
      result.current.setStatus('authenticated');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.status).toBe('authenticated');
  });

  it('should clear auth state on logout', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Setup authenticated state
    act(() => {
      result.current.setUser({ _id: '123', name: 'Test', email: 'test@test.com' });
      result.current.setToken('token');
      result.current.setStatus('authenticated');
    });

    // Clear auth
    act(() => {
      result.current.clearAuth();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.status).toBe('unauthenticated');
  });
});

describe('ChampionsStore', () => {
  beforeEach(() => {
    // Reset store
    const store = useChampionsStore.getState();
    store.clearFilters();
    store.setChampions(null);
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useChampionsStore());
    
    expect(result.current.champions).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedRole).toBe('All');
  });

  it('should update search query', () => {
    const { result } = renderHook(() => useChampionsStore());
    
    act(() => {
      result.current.setSearchQuery('Ahri');
    });

    expect(result.current.searchQuery).toBe('Ahri');
  });

  it('should update selected role', () => {
    const { result } = renderHook(() => useChampionsStore());
    
    act(() => {
      result.current.setSelectedRole('Mid');
    });

    expect(result.current.selectedRole).toBe('Mid');
  });

  it('should filter champions by search query', () => {
    const { result } = renderHook(() => useChampionsStore());
    
    const mockChampions = {
      Ahri: {
        id: 'Ahri',
        name: 'Ahri',
        title: 'The Nine-Tailed Fox',
        tags: ['Mage', 'Assassin'],
        info: { attack: 3, defense: 4, magic: 8, difficulty: 5 },
      },
      Garen: {
        id: 'Garen',
        name: 'Garen',
        title: 'The Might of Demacia',
        tags: ['Fighter', 'Tank'],
        info: { attack: 7, defense: 7, magic: 1, difficulty: 5 },
      },
    };

    act(() => {
      result.current.setChampions(mockChampions as any);
      result.current.setSearchQuery('Ahri');
    });

    const filtered = result.current.getFilteredChampions();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Ahri');
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useChampionsStore());
    
    act(() => {
      result.current.setSearchQuery('Test');
      result.current.setSelectedRole('Top');
      result.current.setSortBy('difficulty');
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedRole).toBe('All');
    expect(result.current.sortBy).toBe('alpha');
  });
});
