import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/admin/login';
        return;
      }
      setAuthenticated(true);
      setLoading(false);
    }
    check();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
