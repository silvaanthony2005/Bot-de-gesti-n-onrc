import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, hoverEffect = false, ...props }) {
  return (
    <div 
      className={twMerge(
        "bg-dark-800/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-white",
        hoverEffect && "transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10 hover:border-primary-500/30 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
