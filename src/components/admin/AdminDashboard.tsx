import { useEffect, useMemo, useState } from 'react';
import type { Client } from '../../types/admin';
import { statusLabels } from '../../types/admin';
import { Plus, LogOut, Users, Briefcase, CheckCircle, Clock, Pencil, Trash2, Tag, Wallet } from 'lucide-react';
import { adminFetch } from '../../lib/admin-fetch';
import { supabase } from '../../lib/supabase';
import { PLANES_WEB, MODALIDADES, formatARS } from '../../lib/pricing';
import HoyCobros from './HoyCobros';
import { usePagos, EstadoCobroBadge, debe } from './cobros-ui';

const nombrePlan = (id: string | null) => PLANES_WEB.find((p) => p.id === id)?.nombre ?? '';

function servicio(c: Client): string {
  if (!c.modalidad) return 'Sin definir';
  const plan = nombrePlan(c.plan_id);
  const base = plan ? `${MODALIDADES[c.modalidad].corto} · ${plan}` : MODALIDADES[c.modalidad].corto;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function importe(c: Client): string {
  if (c.modalidad === 'abono' && c.abono_mensual) return `${formatARS(c.abono_mensual)}/mes`;
  return c.total_amount ? formatARS(c.total_amount) : '—';
}

const SIN_FILTROS = { modalidad: '', plan: '', entrega: '', cobro: '' };

export default function AdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState(SIN_FILTROS);
  const cobros = usePagos(clients);

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

  const visibles = useMemo(() => clients.filter((c) => {
    if (filtros.modalidad === 'ninguna' && c.modalidad) return false;
    if (filtros.modalidad && filtros.modalidad !== 'ninguna' && c.modalidad !== filtros.modalidad) return false;
    if (filtros.plan && c.plan_id !== filtros.plan) return false;
    if (filtros.entrega === 'si' && !c.entregado_at) return false;
    if (filtros.entrega === 'no' && c.entregado_at) return false;
    if (filtros.cobro === 'baja') return c.servicio_estado === 'baja';
    if (filtros.cobro) {
      const e = cobros.estado(c);
      if (filtros.cobro === 'debe' && !debe(e)) return false;
      if (filtros.cobro === 'al_dia' && (e.tipo === 'no_aplica' || debe(e))) return false;
    }
    return true;
  }), [clients, filtros, cobros]);

  const filtrando = Object.values(filtros).some(Boolean);
  const setFiltro = (k: keyof typeof SIN_FILTROS) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFiltros((f) => ({ ...f, [k]: e.target.value }));

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
              <a
                href="/admin/cobros"
                className="btn btn-ghost flex items-center gap-2 text-xs text-[var(--on-petrol-dim)] transition-colors uppercase tracking-wider"
              >
                <Wallet className="w-4 h-4" aria-hidden="true" />
                Cobros
              </a>
              <a
                href="/admin/precios"
                className="btn btn-ghost flex items-center gap-2 text-xs text-[var(--on-petrol-dim)] transition-colors uppercase tracking-wider"
              >
                <Tag className="w-4 h-4" aria-hidden="true" />
                Precios
              </a>
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
        {!loading && !error && (
          <HoyCobros clients={clients} estado={cobros.estado} hoy={cobros.hoy} cargando={cobros.cargando} error={cobros.error} />
        )}

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

        {clients.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4" role="group" aria-label="Filtrar clientes">
            <label className="flex flex-col gap-1 text-[var(--on-petrol-dim)]">
              Modalidad
              <select value={filtros.modalidad} onChange={setFiltro('modalidad')} className="px-2 text-sm">
                <option value="">Todas</option>
                <option value="abono">Abono mensual</option>
                <option value="unico">Pago único</option>
                <option value="proyecto">Proyecto a medida</option>
                <option value="ninguna">Sin definir</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[var(--on-petrol-dim)]">
              Plan
              <select value={filtros.plan} onChange={setFiltro('plan')} className="px-2 text-sm">
                <option value="">Todos</option>
                {PLANES_WEB.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[var(--on-petrol-dim)]">
              Entrega
              <select value={filtros.entrega} onChange={setFiltro('entrega')} className="px-2 text-sm">
                <option value="">Todas</option>
                <option value="si">Entregados</option>
                <option value="no">Sin entregar</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[var(--on-petrol-dim)]">
              Cobro
              <select value={filtros.cobro} onChange={setFiltro('cobro')} className="px-2 text-sm">
                <option value="">Todos</option>
                <option value="al_dia">Al día</option>
                <option value="debe">Deben</option>
                <option value="baja">Dados de baja</option>
              </select>
            </label>
          </div>
        )}

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
        ) : visibles.length === 0 ? (
          <div className="text-center py-10 bg-[var(--petrol-deep)] border border-[var(--line-petrol)] border-dashed">
            <p className="text-[var(--on-petrol-soft)] mb-2">Ningún cliente coincide con los filtros.</p>
            {filtrando && (
              <button type="button" onClick={() => setFiltros(SIN_FILTROS)} className="btn btn-ghost text-sm">
                Quitar filtros
              </button>
            )}
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
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Servicio</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Entrega</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Cobro</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Teléfono</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Monto</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-[var(--on-petrol-soft)] uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line-petrol)]">
                  {visibles.map((client) => (
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
                      <td className="py-3 px-4 text-xs text-[var(--on-petrol-dim)] whitespace-nowrap">{servicio(client)}</td>
                      <td className="py-3 px-4 font-mono text-xs text-[var(--on-petrol-dim)] whitespace-nowrap">
                        {client.entregado_at ? `Entregado ${client.entregado_at.slice(8, 10)}/${client.entregado_at.slice(5, 7)}` : 'Sin entregar'}
                      </td>
                      <td className="py-3 px-4">
                        {client.servicio_estado === 'baja'
                          ? <span className="font-mono text-xs text-[var(--on-petrol-dim)]">Dado de baja</span>
                          : <EstadoCobroBadge estado={cobros.estado(client)} />}
                      </td>
                      <td className="py-3 px-4 text-[var(--on-petrol-dim)] font-mono text-xs">{client.phone}</td>
                      <td className="py-3 px-4 font-mono text-xs text-[var(--on-petrol-dim)] whitespace-nowrap">{importe(client)}</td>
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
