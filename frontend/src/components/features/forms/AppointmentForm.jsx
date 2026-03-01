import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Mail, Send, X, CheckCircle } from 'lucide-react';

export default function AppointmentForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    fecha: '',
    hora: '',
    tipo_tramite: 'UEH'
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      // Llamada directa al Backend (asegúrate de que la URL sea correcta para tu entorno)
      const response = await axios.post('http://localhost:8000/api/appointments/book', formData);
      
      setStatus('success');
      setTimeout(() => {
        onSubmit(`✅ Cita confirmada con éxito para el ${formData.fecha} a las ${formData.hora}. Se ha enviado un correo a ${formData.email}.`);
      }, 1500);

    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || 'Error al agendar la cita. Intente otro horario o día.');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6 text-center animate-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Cita Agendada!</h3>
        <p className="text-gray-600">Revisa tu correo para los detalles de confirmación.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto bg-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Agendar Cita</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              required
              name="nombre"
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-800 bg-gray-50"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              required
              name="email"
              type="email"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-800 bg-gray-50"
              placeholder="juan@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                required
                name="fecha"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-800 bg-gray-50 text-sm"
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Hora */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Hora</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                required
                name="hora"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-800 bg-gray-50 text-sm appearance-none"
                value={formData.hora}
                onChange={handleChange}
              >
                <option value="">Seleccionar</option>
                <option value="08:00">08:00 AM</option>
                <option value="08:30">08:30 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="09:30">09:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="13:00">01:00 PM</option>
                <option value="13:30">01:30 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="14:30">02:30 PM</option>
                <option value="15:00">03:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={status === 'loading'}
          type="submit"
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {status === 'loading' ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Confirmar Cita
            </>
          )}
        </button>
      </form>
    </div>
  );
}
