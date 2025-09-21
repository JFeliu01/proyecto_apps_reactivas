import React from "react";
import lolggIcon from "../assets/lolggicon.png";
import ThemeToggle from "../ThemeToggle";

type AppView = 'hero' | 'grid' | 'aatrox';

interface NavbarProps {
  onShowAatrox: () => void;
  onShowGrid: () => void;
  onShowHero: () => void;
  currentView: AppView;
}

const Navbar: React.FC<NavbarProps> = ({ onShowAatrox, onShowGrid, onShowHero, currentView }) => {
  const renderNavigationButton = () => {
    if (currentView === 'hero') {
      return null; // No mostramos botón de navegación en la hero page
    }

    return (
      <button 
        onClick={currentView === 'aatrox' ? onShowGrid : onShowAatrox}
        className="p-2 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2"
        aria-label={currentView === 'aatrox' ? "Back to Grid" : "View Aatrox"}
      >
        {currentView === 'aatrox' ? (
          // Icono de grid/lista para volver
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-sm">Grid</span>
          </>
        ) : (
          // Icono de estrella para Aatrox
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-sm">Aatrox</span>
          </>
        )}
      </button>
    );
  };

  return (
    <nav className="w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
      <div className="flex items-center justify-between w-full">
        <button onClick={onShowHero} aria-label="Go to homepage">
          <img 
            src={lolggIcon} 
            alt="LoL GG Logo" 
            className="h-20 w-auto -my-2 invert dark:invert-0 transition-all duration-300" 
          />
        </button>
        <div className="flex items-center space-x-2">
          {renderNavigationButton()}
          <ThemeToggle />
          {/* Icono de usuario para login/signin */}
          <button 
            className="p-2 mr-4 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Login"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;