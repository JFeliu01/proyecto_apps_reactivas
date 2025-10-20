//import React from 'react';
import type { Champion } from '../types/champion';
import { API_URI } from '../runtimeConfig';

interface UserProfileProps {
  user: { name: string; email: string };
  champions: Record<string, Champion>;
  favorites: string[];
  onShowChampionDetails: (id: string) => void;
  onShowGrid: () => void;
  onShowHero: () => void;
}

export default function UserProfile({ user, champions, favorites, onShowChampionDetails, onShowGrid }: UserProfileProps) {
  const favoriteChamps = favorites.map(id => champions[id]).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
    <button
          onClick={onShowGrid}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to champion list
    </button>
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-lg mb-6 p-6">
      <div className="flex items-center gap-6 mb-6">
        <img
          src="/images/user-avatar.png" //aquí iría la imagen del usuario!
          alt={user.name}
          className="w-24 h-24 rounded-full shadow-md border border-neutral-300 dark:border-neutral-700 object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            {user.name}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-3">
            {user.email}
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-sm text-[#B08D57] dark:text-[#D4B483] bg-[#3A3A3A] dark:bg-[#2C2C2C] border border-[#555555] dark:border-[#444444]">
              Hierro IV
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3">Favorite Champions</h3>
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
  </div>
  );
}
