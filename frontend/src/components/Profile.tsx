import React from 'react';
import type { Champion } from '../types/champion';
import { API_URI } from '../runtimeConfig';

interface UserProfileProps {
  user: { name: string; email: string; favorites?: string[] };
  champions: Record<string, Champion>;
  onShowChampionDetails: (id: string) => void;
  onShowGrid: () => void;
  onShowHero: () => void;
}

export default function UserProfile({ user, champions, onShowChampionDetails }: UserProfileProps) {
  const favoriteChamps = user.favorites?.map(id => champions[id]).filter(Boolean) || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-6 space-y-1">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
      </div>

      <h3 className="text-xl font-semibold mb-2">Favorite Champions</h3>
      {favoriteChamps.length === 0 ? (
        <div className="text-sm text-neutral-500">No favorites yet</div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {favoriteChamps.map((champ) => (
            <button
              key={champ.id}
              onClick={() => onShowChampionDetails(champ.id)}
              className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-200/60 dark:bg-neutral-900/60 outline-none transition hover:border-sky-600"
            >
              <img
                src={`${API_URI}/images/${champ.id}.png`}
                alt={champ.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 text-xs font-semibold text-white text-center">
                {champ.name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
