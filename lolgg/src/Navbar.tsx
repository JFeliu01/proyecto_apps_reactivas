import React from "react";
import lolggIcon from "./assets/lolggicon.png";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
      <div className="flex items-center justify-between w-full">
        <img 
          src={lolggIcon} 
          alt="LoL GG Logo" 
          className="h-20 w-auto -my-2 invert dark:invert-0 transition-all duration-300" 
        />
        <div className="flex items-center space-x-2">
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