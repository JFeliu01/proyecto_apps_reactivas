import React from "react";
import Navbar from "./Navbar";

type AppView = 'hero' | 'grid' | 'aatrox';

interface LayoutProps {
  children: React.ReactNode;
  onShowAatrox: () => void;
  onShowGrid: () => void;
  currentView: AppView;
}

const Layout: React.FC<LayoutProps> = ({ children, onShowAatrox, onShowGrid, currentView }) => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <Navbar 
        onShowAatrox={onShowAatrox}
        onShowGrid={onShowGrid}
        currentView={currentView}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;