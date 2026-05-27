import React from 'react';
import { Home, Compass, Calendar, Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/feed' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Calendar, label: 'My Events', path: '/events' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 bg-white p-4">
      <div className="text-2xl font-bold mb-8 pl-4 tracking-tight">Naami</div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith('/profile') && item.path === '/profile');
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'font-semibold text-accent' : 'text-textMain hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-lg">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
