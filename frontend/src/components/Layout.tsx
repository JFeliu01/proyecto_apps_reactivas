import React from "react";
import Navbar from "./Navbar";
import AuthModal from "./AuthModal";

type AppView = 'hero' | 'grid' | 'champion';

interface LayoutProps {
  children: React.ReactNode;
  onShowGrid: () => void;
  onShowHero: () => void;
  currentView: AppView;
  authOpen: boolean;
  onOpenAuth: () => void;
  onCloseAuth: () => void;
  onLoggedOut?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onShowGrid, onShowHero, currentView, authOpen, onOpenAuth, onCloseAuth, onLoggedOut }) => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <Navbar 
        onShowGrid={onShowGrid}
        onShowHero={onShowHero}
        currentView={currentView}
        onOpenAuth={onOpenAuth}
      />
      <main className="flex-1">
        {children}
      </main>
      {authOpen && <AuthModal onClose={onCloseAuth} onLoggedOut={onLoggedOut} />}
    </div>
  );
};

export default Layout;