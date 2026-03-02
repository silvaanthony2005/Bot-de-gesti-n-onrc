import React, { useState, useEffect } from 'react';
import { Send, GraduationCap, Calendar, UserPlus, Search, FileText, BarChart2 } from 'lucide-react';
import { ActionCard } from '@/features/dashboard/components/ActionCard';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { StatsChart } from '@/components/features/stats/StatsChart';
import api from '@/lib/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        setStatsError('');
        const response = await api.get('/stats/summary');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setStatsError('No se pudieron cargar las estadísticas en este momento.');
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

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
      title: "Análisis", 
      icon: BarChart2, 
      color: "indigo", 
      onClick: () => handleAction("Dame un análisis de los últimos 30 días con insights clave de citas y actas")
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
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto px-3 md:px-4 lg:px-8 py-3 md:py-6 space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-1 md:space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          Asistente Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-blue">Bot CNE</span>
        </h1>
        <p className="text-sm md:text-xl text-gray-400 font-light max-w-md mx-auto">Gestione sus trámites del Registro Civil de forma rápida y sencilla con IA.</p>
      </div>

      {/* Stats Section - New */}
      {isLoadingStats && (
        <div className="p-4 rounded-2xl bg-dark-800/50 border border-white/5 text-gray-300">
          Cargando gráficos...
        </div>
      )}

      {statsError && !isLoadingStats && (
        <div className="p-4 rounded-2xl bg-dark-800/50 border border-white/5 text-red-300">
          {statsError}
        </div>
      )}

      {stats && !isLoadingStats && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-dark-800/50 border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase">Citas Hoy</p>
              <p className="text-2xl font-bold text-white">{stats?.overview?.citas_hoy ?? 0}</p>
            </div>
            <div className="bg-dark-800/50 border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase">Total Citas</p>
              <p className="text-2xl font-bold text-white">{stats?.overview?.total_citas ?? 0}</p>
            </div>
            <div className="bg-dark-800/50 border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase">Total Actas</p>
              <p className="text-2xl font-bold text-white">{stats?.overview?.total_actas ?? 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsChart 
            type="line" 
            data={stats.citas_tendencia} 
            title="Tendencia de Citas (Últimos 7 días)" 
          />
          <StatsChart 
            type="pie" 
            data={stats.distribucion_tramites} 
            title="Distribución por Trámite" 
          />
          </div>
        </div>
      )}

      {/* Grid Section */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
        {actions.map((action, idx) => (
            <div key={idx} onClick={action.onClick} className="cursor-pointer">
              <ActionCard {...action} progress={null} />
            </div>
        ))}
      </div>

      {/* Footer Prompt Input */}
      <div className="pt-1 pb-2 md:pt-2 md:pb-6">
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
    </div>
  );
}

