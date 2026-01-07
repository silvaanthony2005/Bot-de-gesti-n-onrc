import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Input({ className, icon: Icon, ...props }) {
  return (
    <div className="relative w-full">
      <input 
        className={twMerge(
          "w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all",
          Icon && "pr-10",
          className
        )}
        {...props}
      />
      {Icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}
