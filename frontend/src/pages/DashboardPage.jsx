import React from 'react';
import { Send, GraduationCap, Calendar, UserPlus, Search, MessageCircle, FileText, Download } from 'lucide-react';
import { ActionCard } from '@/features/dashboard/components/ActionCard';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleAction = (prompt) => {
    // Navegamos al chat pasando el prompt inicial como estado
    navigate('/chat', { state: { initialPrompt: prompt } });
  };

  const actions = [
    { 
      title: "Agendar Cita", 
      icon: Calendar, 
      color: "purple", 
      onClick: () => handleAction("Quisiera agendar una cita para mi registro")
    },
    { 
      title: "Registro UEH", 
      icon: UserPlus, 
      color: "green", 
      onClick: () => handleAction("Quiero iniciar un registro de Unión Estable de Hecho")
    },
    { 
      title: "Consultar Acta", 
      icon: Search, 
      color: "cyan", 
      onClick: () => handleAction("Necesito buscar un acta en el sistema")
    },
    { 
      title: "Chat General", 
      icon: MessageCircle, 
      color: "indigo", 
      onClick: () => navigate('/chat')
    },
    { 
      title: "Información Trámites", 
      icon: FileText, 
      color: "yellow", 
      onClick: () => handleAction("¿Qué requisitos necesito para los trámites?")
    },
    { 
      title: "Ayuda Asistente", 
      icon: GraduationCap, 
      color: "orange", 
      onClick: () => handleAction("¿Cómo funciona este asistente virtual?")
    },
  ];

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto px-3 md:px-4 lg:p-8">
      {/* Header Section - Flex None to stay fixed */}
      <div className="flex-none mb-2 md:mb-12 mt-2 md:mt-4 text-center space-y-1 md:space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          Asistente Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-blue">Bot CNE</span>
        </h1>
        <p className="text-sm md:text-xl text-gray-400 font-light max-w-md mx-auto">Gestione sus trámites del Registro Civil de forma rápida y sencilla con IA.</p>
      </div>

      {/* Grid Section - Flex 1 + Overflow Auto handles the scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 pb-2 md:pb-4">
            {actions.map((action, idx) => (
                <div key={idx} onClick={action.onClick} className="cursor-pointer">
                  <ActionCard {...action} progress={null} />
                </div>
            ))}
          </div>
      </div>

      {/* Footer Prompt Input - Flex None to stay at bottom */}
      <div className="flex-none mt-1 mb-2 md:mt-4 md:mb-6">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const val = e.target.elements.goal.value;
            if (val.trim()) handleAction(val);
          }} 
          className="relative max-w-4xl mx-auto"
        >
            <Input 
                name="goal"
                placeholder="Escriba su consulta o tramite aqui..." 
                className="bg-dark-800/80 backdrop-blur-xl border-white/10 rounded-full py-2.5 md:py-4 px-5 md:px-8 text-sm md:text-lg shadow-2xl shadow-primary-900/20 w-full focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <button type="submit" className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-all">
                <Send className="w-5 h-5 md:w-6 md:h-6" />
            </button>
        </form>
      </div>
    </div>
  );
}

