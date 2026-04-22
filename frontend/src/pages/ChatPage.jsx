import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { chatService } from '@/services/chatService';
import { getFormById } from '@/components/features/forms/registry';
import { useLocation } from 'react-router-dom';
import api from '@/lib/api';
import { StatsChart } from '@/components/features/stats/StatsChart';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {
  const location = useLocation();
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: '¡Hola! Soy el asistente virtual del Registro Civil. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const hasSentInitialPrompt = useRef(false);

  // Efecto para manejar el prompt inicial desde el Dashboard
  useEffect(() => {
    if (location.state?.initialPrompt && !hasSentInitialPrompt.current) {
      hasSentInitialPrompt.current = true;
      sendMessage(location.state.initialPrompt);
      // Limpiar el estado para evitar repeticiones
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: text.trim() }]);
    setIsLoading(true);

    try {
      const data = await chatService.sendMessage(text);
      const responseText = data?.response || '';
      const chartIntent = /(grafico|gráfico|estadistica|estadística|tendencia|distribucion|distribución|panel|dashboard)/i.test(text);
      const analysisIntent = /(analisis|análisis|reporte|resumen|filtr|compar|insight|indicador|metric)/i.test(text);
      const appointmentIntent = /(agendar|agenda|cita|reservar|reserva|turno)/i.test(text);

      const parseDays = () => {
        if (/(hoy)/i.test(text)) return 1;
        if (/(semana|semanal|7 dias|7 días)/i.test(text)) return 7;
        if (/(mes|mensual|30 dias|30 días)/i.test(text)) return 30;
        if (/(trimestre|90 dias|90 días)/i.test(text)) return 90;
        return 30;
      };

      const parseTipoTramite = () => {
        const upper = text.toUpperCase();
        const options = ['UNION ESTABLE', 'DEFUNCION', 'NACIONALIDAD', 'NACIMIENTO', 'CAPACIDAD', 'MATRIMONIO', 'UEH'];
        return options.find((opt) => upper.includes(opt)) || null;
      };
      
      const formMatch = responseText.match(/\[FORMULARIO:\s*(\w+)\]/);
      const actionMatch =
        responseText.match(/\[VER_GRAFICOS\]/i) ||
        responseText.match(/__VER_GRAFICOS__/i) ||
        responseText.match(/\[ACCION:\s*(\w+)\]/i);
      let formId = null;
      let cleanText = responseText;

      if (formMatch) {
        formId = formMatch[1];
        cleanText = data.response.replace(formMatch[0], '').trim();
      }

      if (!formId && appointmentIntent) {
        formId = 'AGENDAR_CITA';
      }

      if (actionMatch || chartIntent) {
        const action = actionMatch[1]?.toUpperCase() || 'VER_GRAFICOS';
        if (actionMatch) {
          cleanText = cleanText.replace(actionMatch[0], '').trim();
        }
        if (action === 'VER_GRAFICOS') {
          let charts = null;
          try {
            const statsResponse = await api.get('/stats/summary');
            charts = statsResponse.data;
          } catch (statsError) {
            console.error('No se pudieron cargar los gráficos:', statsError);
          }

          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            role: 'bot',
            text: cleanText || 'Aquí tienes el análisis visual solicitado:',
            chartData: charts
          }]);
          return;
        }
      }

      if (analysisIntent && !formId) {
        try {
          const params = {
            days: parseDays(),
            tipo_tramite: parseTipoTramite() || undefined,
            tipo_acta: parseTipoTramite() || undefined,
          };
          const insightsResponse = await api.get('/stats/insights', { params });
          const insights = insightsResponse.data;

          let insightsText = "\n\n### Resumen analítico filtrado\n";
          insightsText += insights?.summary_markdown || '- No hay datos para el filtro seleccionado.';

          if (insights?.top_tramites?.length) {
            insightsText += "\n\n### Top trámites\n";
            insights.top_tramites.forEach((item) => {
              insightsText += `- **${item.name}**: ${item.value}\n`;
            });
          }

          if (insights?.top_actas?.length) {
            insightsText += "\n### Top actas\n";
            insights.top_actas.forEach((item) => {
              insightsText += `- **${item.name}**: ${item.value}\n`;
            });
          }

          cleanText = `${cleanText}${insightsText}`.trim();
        } catch (insightsError) {
          console.error('No se pudieron cargar insights:', insightsError);
        }
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'bot', 
        text: cleanText,
        formId: formId 
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'bot', 
        text: 'Error de conexión. Verifica que los servicios estén activos.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    await sendMessage(userMessage);
  };

  const renderMessageContent = (msg) => {
    const FormComponent = msg.formId ? getFormById(msg.formId) : null;
    const isBot = msg.role === 'bot';

    return (
      <div className="flex flex-col gap-2">
        {isBot ? (
          <div className="prose prose-invert max-w-none 
                          prose-p:my-3 
                          prose-headings:mt-6 prose-headings:mb-3 
                          prose-li:my-1 prose-ul:my-3 prose-ol:my-3 
                          prose-strong:text-white prose-code:text-primary-300
                          prose-table:w-full prose-table:border-collapse prose-table:my-4
                          prose-thead:bg-dark-700/50 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:border-b-2 prose-th:border-dark-600
                          prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-dark-700/50
                          leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text || ''}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
        )}
        
        {FormComponent && (
           <div className="mt-4 p-0 bg-transparent rounded-lg text-gray-100 border-0 shadow-none animate-in fade-in slide-in-from-bottom-4">
             <FormComponent onSubmit={(successMsg) => {
                setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: successMsg }]);
             }} onCancel={() => {
                setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: "Cancelé el formulario." }]);
             }} />
          </div>
        )}

        {msg.chartData && (
          <div className="mt-4 grid grid-cols-1 gap-4">
            <StatsChart
              type="line"
              data={msg.chartData?.citas_tendencia || []}
              title="Tendencia de Citas (Últimos 7 días)"
            />
            <StatsChart
              type="pie"
              data={msg.chartData?.distribucion_tramites || []}
              title="Distribución por Trámite"
            />
            <StatsChart
              type="bar"
              data={msg.chartData?.actas_tendencia || []}
              title="Tendencia de Actas (Últimos 7 días)"
            />
            <StatsChart
              type="pie"
              data={msg.chartData?.distribucion_actas || []}
              title="Distribución de Actas por Tipo"
            />
          </div>
        )}
      </div>
    );
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
                        {renderMessageContent(msg)}
                    </div>
                </div>
            ))}
            
            {isLoading && (
                <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br from-primary-500 to-primary-700">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <div className="bg-dark-800 rounded-2xl rounded-tl-none p-4 border border-white/5">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-dark-900/50 backdrop-blur-sm mt-auto">
            <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
                <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? "Waiting for AI..." : "Type your message..."}
                    disabled={isLoading}
                    className="pr-12 bg-dark-800 border-white/10 focus:border-primary-500 transition-colors h-12 rounded-xl shadow-lg disabled:opacity-50"
                />
                <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    </div>
  );
}
