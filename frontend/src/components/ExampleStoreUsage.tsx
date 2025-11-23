/**
 * Example component showing how to use both Auth and Champions stores
 * This demonstrates the integration of multiple Zustand stores
 */

import { useAuthStore, useChampionsStore } from '../store';

export default function ExampleStoreUsage() {
  // Auth store
  const { user, status, login, logout } = useAuthStore();
  
  // Champions store
  const { 
    getFilteredChampions, 
    setSearchQuery, 
    setSelectedRole,
    selectedRole,
    loading: championsLoading 
  } = useChampionsStore();

  const champions = getFilteredChampions();

  const handleLogin = async () => {
    try {
      await login('test@example.com', 'password');
    } catch (err) {
      console.error('Login failed');
    }
  };

  return (
    <div className="p-4">
      {/* Auth Section */}
      <div className="mb-8 p-4 bg-white dark:bg-neutral-900 rounded-lg border">
        <h2 className="text-xl font-bold mb-4">Authentication Status</h2>
        
        <div className="space-y-2">
          <p>Status: <span className="font-mono">{status}</span></p>
          
          {user ? (
            <div>
              <p>Welcome, {user.name}!</p>
              <p className="text-sm text-neutral-500">{user.email}</p>
              <button
                onClick={logout}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login (Test)
            </button>
          )}
        </div>
      </div>

      {/* Champions Section */}
      <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border">
        <h2 className="text-xl font-bold mb-4">Champions</h2>
        
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search champions..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded dark:bg-neutral-800"
          />
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="px-4 py-2 border rounded dark:bg-neutral-800"
            aria-label="Select role filter"
          >
            <option value="All">All Roles</option>
            <option value="Top">Top</option>
            <option value="Jungle">Jungle</option>
            <option value="Mid">Mid</option>
            <option value="ADC">ADC</option>
            <option value="Support">Support</option>
          </select>
        </div>

        {/* Champions Grid */}
        {championsLoading ? (
          <p>Loading champions...</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {champions.slice(0, 8).map((champ) => (
              <div
                key={champ.id}
                className="p-2 border rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <p className="font-semibold">{champ.name}</p>
                <p className="text-sm text-neutral-500">{champ.title}</p>
              </div>
            ))}
          </div>
        )}
        
        <p className="mt-4 text-sm text-neutral-500">
          Showing {champions.length} champions
        </p>
      </div>
    </div>
  );
}
