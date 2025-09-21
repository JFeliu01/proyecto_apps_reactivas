import React from "react";
import lolggIcon from "../assets/lolggicon.png";

interface HeroPageProps {
  onEnterApp: () => void;
}

const HeroPage: React.FC<HeroPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans flex items-center">
      <div className="relative mx-auto max-w-7xl px-4 py-8 w-full -mt-16">
        {/* Hero */}
        <div className="text-center space-y-8 md:space-y-10">
          {/* Title */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-center">
              <img 
                src={lolggIcon} 
                alt="LoL GG Logo" 
                className="h-20 w-auto sm:h-24 md:h-28 lg:h-32 invert dark:invert-0 transition-all duration-300" 
              />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-neutral-600 dark:text-neutral-300">
                Your ultimate companion to become a legend
            </h2>
          </div>

          {/* Description */}
          <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-neutral-400">
            Explore the complete champion roster, learn their abilities and stats, and find the perfect champion for your playstyle.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 p-6 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition">
              <div className="mb-6 text-sky-500 dark:text-sky-400">
                <svg className="mx-auto h-10 w-10" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Champion Collection
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Explore the complete collection and get to know each champion in detail.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 p-6 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition">
              <div className="mb-6 text-purple-500 dark:text-purple-300">
                <svg className="mx-auto h-10 w-10" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Role Filters
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Filter by your preferred role.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 p-6 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition">
              <div className="mb-6 text-emerald-500 dark:text-emerald-300">
                <svg className="mx-auto h-10 w-10" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3v18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Detailed Stats
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Check stats, items, and abilities for each champion.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <button
              onClick={onEnterApp}
              className="group relative inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-neutral-700 dark:border-neutral-300 bg-neutral-800 dark:bg-white px-8 py-4 text-base sm:text-lg font-semibold text-white dark:text-neutral-900 shadow-xl hover:border-neutral-600 dark:hover:border-neutral-400 hover:bg-neutral-700 dark:hover:bg-neutral-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-neutral-500/50 dark:focus:ring-neutral-400/50 focus:ring-offset-2 cursor-pointer"
            >
              Explore Champions
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1 text-neutral-100 dark:text-neutral-700"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* subtle border container like the rest of the app */}
        <div className="pointer-events-none absolute inset-x-4 -z-10 top-10 rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70" />
      </div>
    </div>
  );
};

export default HeroPage;
