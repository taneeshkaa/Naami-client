import React from 'react';
import { Home, Compass, Calendar, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/feed' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const BottomBar = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 pb-2 z-50">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith('/profile') && item.path === '/profile');
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-accent' : 'text-gray-500 hover:text-textMain'
              }`}
            >
              <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
