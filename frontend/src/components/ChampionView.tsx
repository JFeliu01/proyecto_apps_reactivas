import React from 'react';

// Role and sub-role icon imports
import FighterIcon from '../assets/Fighter_icon.png';
import TankIcon from "../assets/Tank_icon.png";
import MageIcon from "../assets/Mage_icon.png";
import AssassinIcon from "../assets/Assasin_icon.png";
import SupportTagIcon from "../assets/Support_icon.png";
import MarksmanTagIcon from "../assets/Marksman_icon.png";

// Mapping of tag names to their icons
const TAG_ICONS: Record<string, string> = {
  Fighter: FighterIcon,
  Tank: TankIcon,
  Mage: MageIcon,
  Assassin: AssassinIcon,
  Support: SupportTagIcon,
  Marksman: MarksmanTagIcon,
};

interface ChampionViewProps {
  champion: any;
  onShowGrid: () => void;
}

const ChampionView: React.FC<ChampionViewProps> = ({ champion, onShowGrid }) => {
  if (!champion) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="text-center">
          <p className="text-neutral-500 dark:text-neutral-400">Champion information not available.</p>
        </div>
      </div>
    );
  }

  const iconUrl = `http://localhost:3001/${champion.id}.png`;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Back to grid button */}
      <button
        onClick={onShowGrid}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to champion list
      </button>

      {/* Basic info header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-lg mb-6">
        <div className="p-6">
          <div className="flex items-center gap-6 mb-6">
            <img 
              src={iconUrl} 
              alt={champion.name}
              className="w-24 h-24 rounded-xl shadow-md"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                {champion.name}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-3">
                {champion.title}
              </p>
              <div className="flex gap-2">
                {(champion.tags || []).map((tag: string) => (
                  <span 
                    key={tag} 
                    className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700"
                  >
                    {TAG_ICONS[tag] && (
                      <img 
                        src={TAG_ICONS[tag]} 
                        alt={`${tag} icon`} 
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Lore</h3>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {champion.blurb}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            General Information
          </h3>
          <div className="space-y-3">
            {champion.info && Object.entries(champion.info).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400 capitalize">
                  {key}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${
                          i < (value as number) 
                            ? 'bg-sky-500' 
                            : 'bg-neutral-300 dark:bg-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-neutral-900 dark:text-white font-medium w-6">
                    {String(value)}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Resource Type
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {champion.partype || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Base Stats */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Base Stats
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {champion.stats && Object.entries(champion.stats).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-1">
                <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {typeof value === 'number' ? value.toFixed(1) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionView;
