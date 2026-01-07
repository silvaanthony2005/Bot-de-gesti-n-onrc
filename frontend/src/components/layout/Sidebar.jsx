import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Settings, LogOut, User, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

function SidebarItem({ icon: Icon, label, to, onClick }) {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => twMerge(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        isActive 
          ? "bg-primary-600/20 text-white shadow-inner shadow-primary-500/10" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon size={20} className="group-hover:scale-110 transition-transform" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
    {/* Mobile Overlay */}
    {isOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
        />
    )}

    <aside className={twMerge(
        "w-64 h-screen bg-dark-900 border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Brand */}
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-blue flex items-center justify-center">
                <span className="font-bold text-white text-lg">AI</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Learn With AI
            </h1>
        </div>
        
        {/* Mobile Close Button */}
        <button 
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
        >
            <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <SidebarItem icon={MessageSquare} label="Chats" to="/chat" onClick={() => onClose && onClose()} />
        <SidebarItem icon={Settings} label="Dashboard" to="/dashboard" onClick={() => onClose && onClose()} />
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-white/5 pt-6 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Settings size={20} />
            <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
            <LogOut size={20} />
            <span>Log Out</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="mt-6 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-primary-500">
            <User size={24} />
        </div>
        <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">Ayush Gupta</p>
            <p className="text-xs text-gray-500 truncate">ayush@gmail.com</p>
        </div>
      </div>
    </aside>
    </>
  );
}
