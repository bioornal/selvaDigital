import { useEffect, useState } from 'react';
import type { Client } from '../../types/admin';
import { statusLabels } from '../../types/admin';
import { Plus, LogOut, Users, Briefcase, CheckCircle, Clock, Pencil, Trash2 } from 'lucide-react';
import { adminFetch } from '../../lib/admin-fetch';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    setError('');
    try {
      const res = await adminFetch('/api/admin/clients');
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${res.status}`);
      }
      const data = await res.json();
      setClients(Array.isArray(data) ? (data as Client[]) : []);
    } catch (e: any) {
      setError(e.message || 'No se pudieron cargar los clientes');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este cliente permanentemente?')) return;
    try {
      const res = await adminFetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando cliente');
      loadClients();
    } catch (e: any) {
      setError(e.message || 'No se pudo eliminar el cliente');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut().catch(() => {});
    window.location.href = '/admin/login';
  }

  const stats = {
    total: clients.length,
    active: clients.filter(c => !['finalizado', 'pausado'].includes(c.status)).length,
    finished: clients.filter(c => c.status === 'finalizado').length,
    proposals: clients.filter(c => c.status === 'propuesta').length,
  };

  return (
    <div className="min-h-screen bg-[var(--petrol)]">
      {/* Header */}
      <header className="border-b border-[var(--line-petrol)] bg-[var(--petrol-deep)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-[var(--ice)]" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Selva Digital
              </span>
              <span className="text-[var(--on-petrol-soft)]">|</span>
              <span className="text-sm text-[var(--on-petrol-dim)]">Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="btn btn-ghost flex items-center gap-2 text-xs text-[var(--on-petrol-dim)]  transition-colors uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[var(--on-petrol-soft)]" />
              <span className="text-xs text-[var(--on-petrol-dim)] uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-bold text-[var(--ice)]">{stats.total}</p>
          </div>
          <div className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-4">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-[var(--on-petrol-soft)]" />
              <span className="text-xs text-[var(--on-petrol-dim)] uppercase tracking-wider">Activos</span>
            </div>
            <p className="text-2xl font-bold text-[var(--ice)]">{stats.active}</p>
          </div>
          <div className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-[var(--lime)]" />
              <span className="text-xs text-[var(--on-petrol-dim)] uppercase tracking-wider">Finalizados</span>
            </div>
            <p className="text-2xl font-bold text-[var(--ice)]">{stats.finished}</p>
          </div>
          <div className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-[#F5C76B]" />
              <span className="text-xs text-[var(--on-petrol-dim)] uppercase tracking-wider">Propuestas</span>
            </div>
            <p className="text-2xl font-bold text-[var(--ice)]">{stats.proposals}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--ice)]">Clientes y Proyectos</h2>
          <a
            href="/admin/clientes/nuevo"
            className="btn btn-lime inline-flex items-center gap-2    text-sm font-medium py-2 px-4 rounded-none transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo cliente
          </a>
        </div>

        {error && (
          <div role="alert" className="mb-4 p-3 bg-[var(--petrol-deep)] border border-[#FFB4A8] text-[#FFB4A8] text-sm">
            {error}
          </div>
        )}

        {/* Clients Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[var(--line-petrol-strong)] border-t-transparent rounded-full animate-spin" role="status" aria-label="Cargando" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 bg-[var(--petrol-deep)] border border-[var(--line-petrol)] border-dashed">
            <p className="text-[var(--on-petrol-soft)] mb-2">No hay clientes registrados</p>
            <a href="/admin/clientes/nuevo" className="btn btn-ghost text-sm text-[var(--on-petrol-soft)] hover:text-[var(--on-petrol-soft)]">
              Crear el primer cliente →
            </a>
          </div>
        ) : (
          <div className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--line-petrol)]">
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Cliente</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Proyecto</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Estado</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Fase</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Teléfono</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Monto</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line-petrol)]">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-[var(--petrol-raised)] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-[var(--ice)]">{client.name}</div>
                        {client.email && (
                          <div className="text-xs text-[var(--on-petrol-soft)]">{client.email}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[var(--on-petrol-dim)]">{client.project_type}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium text-[var(--ice)] project-status project-status-${client.status}`}>
                          {statusLabels[client.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-[var(--on-petrol-dim)]">
                          Fase {client.current_phase}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--on-petrol-dim)] font-mono text-xs">{client.phone}</td>
                      <td className="py-3 px-4 text-[var(--on-petrol-dim)]">
                        {client.total_amount ? `$${client.total_amount.toLocaleString('es-AR')}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={`/admin/clientes/${client.id}`}
                            className="btn btn-ghost text-sm text-[var(--on-petrol-soft)] hover:text-[var(--on-petrol-soft)] transition-colors"
                          >
                            Ver
                          </a>
                          <a
                            href={`/admin/clientes/${client.id}/editar`}
                            className="btn btn-ghost inline-flex items-center gap-1 text-sm text-[var(--on-petrol-dim)]  transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                            Editar
                          </a>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="btn btn-ghost inline-flex items-center gap-1 text-sm text-[#FFB4A8] hover:text-[#FFB4A8] transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
