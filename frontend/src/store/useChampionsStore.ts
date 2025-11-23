import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
  partype: string;
  stats: Record<string, number>;
}

export type Role = 'All' | 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Support';
export type SortBy = 'alpha' | 'difficulty';

interface ChampionsState {
  // State
  champions: Record<string, Champion> | null;
  selectedChampionId: string | null;
  loading: boolean;
  error: string | null;
  
  // Filters
  searchQuery: string;
  selectedRole: Role;
  sortBy: SortBy;

  // Actions
  setChampions: (champions: Record<string, Champion>) => void;
  setSelectedChampion: (championId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedRole: (role: Role) => void;
  setSortBy: (sortBy: SortBy) => void;
  clearFilters: () => void;

  // Async actions
  fetchChampions: () => Promise<void>;
  
  // Computed/derived state
  getFilteredChampions: () => Champion[];
  getSelectedChampion: () => Champion | null;
}

// Helper function to infer roles from tags
function inferRolesFromTags(tags: string[] = []): Role[] {
  const roleSet = new Set<Role>();
  const tagLower = tags.map((s) => s.toLowerCase());
  
  if (tagLower.includes('marksman')) roleSet.add('ADC');
  if (tagLower.includes('support')) roleSet.add('Support');
  if (tagLower.includes('mage') || tagLower.includes('assassin')) roleSet.add('Mid');
  if (tagLower.includes('fighter') || tagLower.includes('tank')) {
    roleSet.add('Top');
    roleSet.add('Jungle');
  }
  
  return roleSet.size > 0 ? Array.from(roleSet) : ['All'];
}

export const useChampionsStore = create<ChampionsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      champions: null,
      selectedChampionId: null,
      loading: false,
      error: null,
      searchQuery: '',
      selectedRole: 'All',
      sortBy: 'alpha',

      // Setters
      setChampions: (champions) => set({ champions, error: null }),
      setSelectedChampion: (championId) => set({ selectedChampionId: championId }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),

      // Filter setters
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedRole: (role) => set({ selectedRole: role }),
      setSortBy: (sortBy) => set({ sortBy }),
      clearFilters: () => set({ 
        searchQuery: '', 
        selectedRole: 'All', 
        sortBy: 'alpha' 
      }),

      // Fetch champions
      fetchChampions: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('http://localhost:3001/api/champions');
          if (!response.ok) {
            throw new Error('Could not load champion data');
          }
          const data = await response.json();
          set({ 
            champions: data.data, 
            loading: false, 
            error: null 
          });
        } catch (e: any) {
          set({ 
            error: e?.message || 'Failed to fetch champions', 
            loading: false 
          });
        }
      },

      // Get filtered champions
      getFilteredChampions: () => {
        const { champions, searchQuery, selectedRole, sortBy } = get();
        
        if (!champions) return [];

        let championsList = Object.values(champions);

        // Enrich with inferred roles
        championsList = championsList.map((c) => ({
          ...c,
          _roles: inferRolesFromTags(c.tags),
        })) as any;

        // Filter by search query
        if (searchQuery.trim()) {
          const needle = searchQuery.trim().toLowerCase();
          championsList = championsList.filter(
            (c) =>
              c.name.toLowerCase().includes(needle) ||
              c.id.toLowerCase().includes(needle)
          );
        }

        // Filter by role
        if (selectedRole !== 'All') {
          championsList = championsList.filter((c: any) =>
            (c._roles as Role[]).includes(selectedRole)
          );
        }

        // Sort
        if (sortBy === 'alpha') {
          championsList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'difficulty') {
          championsList.sort(
            (a, b) => (b.info?.difficulty ?? 0) - (a.info?.difficulty ?? 0)
          );
        }

        return championsList;
      },

      // Get selected champion
      getSelectedChampion: () => {
        const { champions, selectedChampionId } = get();
        if (!champions || !selectedChampionId) return null;
        return champions[selectedChampionId] || null;
      },
    }),
    { name: 'ChampionsStore' }
  )
);
