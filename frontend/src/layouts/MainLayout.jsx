import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Menu } from 'lucide-react';

export default function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen md:h-screen sm:h-[100dvh] w-full bg-dark-900 text-white flex overflow-hidden relative">
      {/* Sidebar Area */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full lg:ml-64 relative transition-all duration-300">
        
        {/* Mobile Header Trigger */}
        <div className="lg:hidden p-4 pb-0 z-20 flex-none">
            <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
                <Menu size={28} />
            </button>
        </div>

        {/* Decorative Background Glows */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 left-60 w-72 h-72 bg-accent-blue/10 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Content Wrapper - Handles internal scrolling per page */}
        <div className="relative z-10 flex-1 h-full overflow-hidden">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
