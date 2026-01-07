import React, { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hello! How can I help you with your learning journey today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: input }]);
    setInput('');
    
    // Simulate generic response
    setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: 'That sounds interesting! Tell me more about it.' }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto space-y-6 p-4 scroll-smooth">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                        msg.role === 'bot' 
                            ? 'bg-gradient-to-br from-primary-500 to-primary-700' 
                            : 'bg-dark-700'
                    }`}>
                        {msg.role === 'bot' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-gray-400" />}
                    </div>
                    
                    <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-md ${
                        msg.role === 'bot' 
                            ? 'bg-dark-800 rounded-tl-none text-gray-200 border border-white/5' 
                            : 'bg-primary-600 rounded-tr-none text-white'
                    }`}>
                        <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="p-4 bg-dark-900/50 backdrop-blur-sm mt-auto">
            <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
                <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..." 
                    className="pr-12 bg-dark-800 border-white/10 focus:border-primary-500 transition-colors h-12 rounded-xl shadow-lg"
                />
                <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    </div>
  );
}
