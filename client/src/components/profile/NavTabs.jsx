import React from 'react';
import { Grid, Calendar, Clock } from 'lucide-react';

const tabs = [
  { id: 'posts', label: 'Posts', icon: Grid },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'archive', label: 'Past Editions', icon: Clock },
];

export const NavTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 relative -top-[1px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex justify-center items-center py-3 md:py-4 transition-colors space-x-2 border-t-2 ${
              isActive
                ? 'border-textMain text-textMain'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon className="w-5 h-5 md:w-4 md:h-4" strokeWidth={isActive ? 2 : 1.5} />
            <span className={`text-[11px] md:text-sm tracking-wide ${isActive ? 'font-semibold' : 'font-medium hidden md:inline'}`}>
              {tab.label.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
};
