
import React from 'react';
import { AppTab } from '../types';
import { Users, Map as MapIcon, MessageSquare, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.NEARBY, label: 'Nearby', icon: Users },
    { id: AppTab.MAP, label: 'Map', icon: MapIcon },
    { id: AppTab.CHATS, label: 'Chats', icon: MessageSquare },
    { id: AppTab.PROFILE, label: 'You', icon: UserIcon },
  ];

  return (
    <div className="fixed bottom-6 left-6 right-6 z-40">
      <div className="glass max-w-lg mx-auto p-2 rounded-[2rem] shadow-2xl flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 min-w-[70px] ${
                isActive ? 'text-rose-500 bg-rose-50' : 'text-rose-300 hover:text-rose-400'
              }`}
            >
              <Icon size={24} className={isActive ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
