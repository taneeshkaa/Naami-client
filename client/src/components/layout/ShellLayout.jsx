import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomBar } from './BottomBar';
import { Outlet } from 'react-router-dom';

export const ShellLayout = () => {
  return (
    <div className="flex h-screen bg-base">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto w-full min-h-full bg-white border-x border-gray-100 shadow-sm">
          <Outlet />
        </div>
      </main>
      <BottomBar />
    </div>
  );
};
