import React from 'react';
import { Send, GraduationCap, Link, Bookmark, MessageCircle, FileText, Download } from 'lucide-react';
import { ActionCard } from '@/features/dashboard/components/ActionCard';
import { Input } from '@/components/ui/Input';

export default function DashboardPage() {
  const actions = [
    { title: "Guided Learning", icon: GraduationCap, progress: 15, color: "orange" },
    { title: "Links To Course", icon: Link, progress: 63, color: "yellow" },
    { title: "Save Courses", icon: Bookmark, progress: 41, color: "cyan" },
    { title: "Chat Wit AI", icon: MessageCircle, progress: 15, color: "purple" },
    { title: "Learning Plans", icon: FileText, progress: 63, color: "green" },
    { title: "Download PDFs", icon: Download, progress: 41, color: "indigo" },
  ];

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto px-3 md:px-4 lg:p-8">
      {/* Header Section - Flex None to stay fixed */}
      <div className="flex-none mb-2 md:mb-12 mt-2 md:mt-4 text-center space-y-1 md:space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-blue">Chat Bot</span>
        </h1>
        <p className="text-sm md:text-xl text-gray-400 font-light max-w-md mx-auto">Tell me your goal, and get complete Learning Plans.</p>
      </div>

      {/* Grid Section - Flex 1 + Overflow Auto handles the scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 pb-2 md:pb-4">
            {actions.map((action, idx) => (
                <ActionCard key={idx} {...action} />
            ))}
          </div>
      </div>

      {/* Footer Prompt Input - Flex None to stay at bottom */}
      <div className="flex-none mt-1 mb-2 md:mt-4 md:mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="relative max-w-4xl mx-auto">
            <Input 
                placeholder="Enter your goal/prompts here..." 
                className="bg-dark-800/80 backdrop-blur-xl border-white/10 rounded-full py-2.5 md:py-4 px-5 md:px-8 text-sm md:text-lg shadow-2xl shadow-primary-900/20 w-full"
            />
            <button type="submit" className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-2 bg-transparent text-gray-400 hover:text-white transition-colors">
                <Send className="w-5 h-5 md:w-6 md:h-6" />
            </button>
        </form>
      </div>
    </div>
  );
}
