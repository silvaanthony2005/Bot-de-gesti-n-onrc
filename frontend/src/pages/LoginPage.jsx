import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        await register(fullName, email, password);
      } else {
        await login(email, password);
      }
      navigate(redirectPath, { replace: true });
    } catch (submitError) {
      const backendMessage = submitError?.response?.data?.detail;
      setError(typeof backendMessage === 'string' ? backendMessage : 'No se pudo iniciar sesion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute -top-32 -left-20 w-72 h-72 bg-primary-600/20 rounded-full blur-[90px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-blue/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10 bg-dark-800/70 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-300">Registro Civil</p>
          <h1 className="text-2xl font-bold mt-2">{mode === 'login' ? 'Inicia sesion' : 'Crear cuenta'}</h1>
          <p className="text-gray-400 mt-2 text-sm">
            {mode === 'login'
              ? 'Ingresa con tu correo para usar el panel.'
              : 'Crea tu usuario para acceder al sistema.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <Input
              type="text"
              placeholder="Nombre completo"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
            />
          )}

          <Input
            type="email"
            placeholder="Correo"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Contrasena"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Registrarme'}
          </Button>
        </form>

        <button
          type="button"
          className="w-full mt-5 text-sm text-gray-300 hover:text-white transition-colors"
          onClick={() => {
            setMode((prev) => (prev === 'login' ? 'register' : 'login'));
            setError('');
          }}
        >
          {mode === 'login' ? 'No tienes cuenta? Registrate' : 'Ya tienes cuenta? Inicia sesion'}
        </button>
      </div>
    </div>
  );
}
