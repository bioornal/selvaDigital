import { useEffect, useState } from 'react';
import type { Client } from '../../types/admin';
import { statusLabels, statusColors } from '../../types/admin';
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
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'Nova Square, Inter, sans-serif' }}>
                Selva Digital
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-sm text-gray-400">Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
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
          <div className="bg-[#12121a] border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-[#12121a] border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Activos</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.active}</p>
          </div>
          <div className="bg-[#12121a] border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Finalizados</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.finished}</p>
          </div>
          <div className="bg-[#12121a] border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Propuestas</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.proposals}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Clientes y Proyectos</h2>
          <a
            href="/admin/clientes/nuevo"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-none transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo cliente
          </a>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Clients Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 bg-[#12121a] border border-gray-800 border-dashed">
            <p className="text-gray-500 mb-2">No hay clientes registrados</p>
            <a href="/admin/clientes/nuevo" className="text-sm text-blue-400 hover:text-blue-300">
              Crear el primer cliente →
            </a>
          </div>
        ) : (
          <div className="bg-[#12121a] border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Fase</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{client.name}</div>
                        {client.email && (
                          <div className="text-xs text-gray-500">{client.email}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-300">{client.project_type}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium text-white ${statusColors[client.status]}`}>
                          {statusLabels[client.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-400">
                          Fase {client.current_phase}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 font-mono text-xs">{client.phone}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {client.total_amount ? `$${client.total_amount.toLocaleString('es-AR')}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={`/admin/clientes/${client.id}`}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Ver
                          </a>
                          <a
                            href={`/admin/clientes/${client.id}/editar`}
                            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                            Editar
                          </a>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="inline-flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
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
