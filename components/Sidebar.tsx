
import React from 'react';
import type { View } from '../types';
import { LayoutDashboard, FolderKanban, Settings, CreditCard, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const iconMap = {
  dashboard: <LayoutDashboard size={20} />,
  projects: <FolderKanban size={20} />,
  settings: <Settings size={20} />,
  billing: <CreditCard size={20} />,
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems: { id: View; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'settings', label: 'Settings' },
    { id: 'billing', label: 'Billing' },
  ];

  return (
    <aside className="w-64 bg-dark-surface flex-shrink-0 p-4 border-r border-dark-border hidden md:flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="text-brand-primary" size={28} />
        <h1 className="text-xl font-bold text-dark-text-primary">CaptionChef</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-brand-primary text-white'
                : 'text-dark-text-secondary hover:bg-dark-border hover:text-dark-text-primary'
            }`}
          >
            {iconMap[item.id]}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4 bg-dark-border rounded-lg text-center">
          <p className="text-xs text-dark-text-secondary">© 2024 CaptionChef</p>
          <p className="text-xs text-dark-text-secondary mt-1">AI-Powered Creativity</p>
      </div>
    </aside>
  );
};
