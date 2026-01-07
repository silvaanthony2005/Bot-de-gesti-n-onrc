import api from '@/lib/api';

export const chatService = {
  /**
   * Envía un mensaje al backend y recibe la respuesta del bot.
   * @param {string} message - El mensaje del usuario.
   * @param {string} sessionId - (Opcional) ID de sesión para contexto.
   */
  sendMessage: async (message, sessionId = null) => {
    try {
      const response = await api.post('/chat', {
        message,
        session_id: sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};
