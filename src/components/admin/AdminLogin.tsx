import { useState, useEffect, useId } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const formId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/admin';
      } else {
        setCheckingSession(false);
      }
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message === 'Invalid login credentials' 
        ? 'Email o contraseña incorrectos' 
        : authError.message);
    } else {
      window.location.href = '/admin';
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--petrol)]">
        <div className="w-8 h-8 border-2 border-[var(--line-petrol-strong)] border-t-transparent rounded-full animate-spin" role="status" aria-label="Cargando" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--ice)] mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Selva Digital
          </h1>
          <p className="text-[var(--on-petrol-dim)] text-sm">Panel de administración</p>
        </div>

        {error && (
          <div id={`${formId}-error`} role="alert" className="mb-4 p-3 bg-[var(--petrol-deep)] border border-[#FFB4A8] text-[#FFB4A8] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor={`${formId}-email`} className="block text-xs font-medium text-[var(--on-petrol-dim)] mb-1 uppercase tracking-wider">
              Email
            </label>
            <input
              id={`${formId}-email`}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${formId}-error` : undefined}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--petrol)] border border-[var(--line-petrol)] rounded-none px-4 py-3 text-sm text-[var(--ice)] placeholder-[var(--on-petrol-soft)]  focus:border-[var(--ice)] transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-password`} className="block text-xs font-medium text-[var(--on-petrol-dim)] mb-1 uppercase tracking-wider">
              Contraseña
            </label>
            <input
              id={`${formId}-password`}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${formId}-error` : undefined}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--petrol)] border border-[var(--line-petrol)] rounded-none px-4 py-3 text-sm text-[var(--ice)] placeholder-[var(--on-petrol-soft)]  focus:border-[var(--ice)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-lime w-full    font-medium py-3 px-4 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="btn btn-ghost text-xs text-[var(--on-petrol-soft)] hover:text-[var(--on-petrol-dim)] transition-colors">
            ← Volver al sitio
          </a>
        </div>
      </div>
    </div>
  );
}
