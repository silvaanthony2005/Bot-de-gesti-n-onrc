import React from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';

export function ActionCard({ icon: Icon, title, progress, color, onClick }) {
  // Map simple color names to Tailwind classes
  const colorMap = {
    orange: 'bg-orange-500 text-orange-500 border-orange-500',
    yellow: 'bg-yellow-500 text-yellow-500 border-yellow-500', 
    cyan: 'bg-cyan-500 text-cyan-500 border-cyan-500',
    purple: 'bg-purple-500 text-purple-500 border-purple-500',
    green: 'bg-green-500 text-green-500 border-green-500',
    indigo: 'bg-indigo-500 text-indigo-500 border-indigo-500'
  };

  const activeColor = colorMap[color] || colorMap.purple;

  return (
    <Card hoverEffect className="relative group overflow-hidden h-32 md:h-48 flex flex-col justify-between border-l-4" style={{borderLeftColor: `var(--tw-${color}-500)`}}>
      
      <div className="flex justify-between items-start">
        <div className="space-y-1 md:space-y-2">
            <h3 className="text-sm md:text-lg font-semibold text-white/90 leading-tight">{title}</h3>
            {progress && (
                <span className="text-[10px] md:text-xs text-gray-400 font-mono">{progress}%</span>
            )}
        </div>
        <div className={`w-1 h-full absolute right-0 top-0 opacity-20 ${activeColor.split(' ')[0]}`} />
      </div>

      <div className="flex items-end justify-between mt-auto">
        <div className={`p-2 md:p-3 rounded-xl bg-dark-900/50 backdrop-blur-sm border ${activeColor.split(' ')[2]} ${activeColor.split(' ')[1]}`}>
            <Icon className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        
        {progress && (
             <div className="w-1.5 h-10 md:h-16 rounded-full bg-dark-700 overflow-hidden relative">
                <div 
                    className={`absolute bottom-0 left-0 w-full rounded-full ${activeColor.split(' ')[0]}`} 
                    style={{ height: `${progress}%` }}
                />
             </div>
        )}
      </div>
    </Card>
  );
}
