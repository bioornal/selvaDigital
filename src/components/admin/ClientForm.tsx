import { useState, useMemo } from 'react';
import type { Client } from '../../types/admin';
import { adminFetch } from '../../lib/admin-fetch';

interface ClientFormProps {
  client?: Client;
  onSuccess?: () => void;
}

export default function ClientForm({ client, onSuccess }: ClientFormProps) {
  const [form, setForm] = useState({
    name: client?.name || '',
    phone: client?.phone || '549',
    email: client?.email || '',
    project_name: client?.project_name || '',
    project_type: client?.project_type || 'web',
    status: client?.status || 'lead',
    total_amount: client?.total_amount?.toString() || '',
    weeks: client?.weeks?.toString() || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const calculated = useMemo(() => {
    const total = parseFloat(form.total_amount) || 0;
    return {
      deposit: Math.round(total * 0.5),
      design: 0,
      final: Math.round(total * 0.5),
    };
  }, [form.total_amount]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const total = parseFloat(form.total_amount) || 0;

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      project_name: form.project_name || null,
      project_type: form.project_type,
      status: form.status,
      total_amount: total || null,
      deposit_amount: total ? Math.round(total * 0.5) : null,
      design_amount: null,
      final_amount: total ? Math.round(total * 0.5) : null,
      weeks: form.weeks ? parseInt(form.weeks) : null,
    };

    try {
      let res;
      if (client) {
        res = await adminFetch(`/api/admin/clients/${client.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await adminFetch('/api/admin/clients', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error guardando cliente');
      }

      if (onSuccess) onSuccess();
      else window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
      setSaving(false);
    }
  }

  const inputClass = 'w-full bg-[#0a0a0f] border border-gray-700 rounded-none px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors';
  const labelClass = 'block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider';
  const readonlyClass = 'w-full bg-[#0a0a0f] border border-gray-800 rounded-none px-3 py-2 text-sm text-gray-400 cursor-not-allowed';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-gray-800 pb-2">
            Información del cliente
          </h3>

          <div>
            <label className={labelClass}>Nombre *</label>
            <input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Juan Pérez" />
          </div>

          <div>
            <label className={labelClass}>Teléfono (WhatsApp) *</label>
            <input name="phone" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="3548550334" />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="cliente@email.com" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-gray-800 pb-2">
            Detalles del proyecto
          </h3>

          <div>
            <label className={labelClass}>Nombre del proyecto</label>
            <input name="project_name" value={form.project_name} onChange={handleChange} className={inputClass} placeholder="Sitio web El Fogón" />
          </div>

          <div>
            <label className={labelClass}>Tipo de proyecto</label>
            <input name="project_type" value={form.project_type} onChange={handleChange} className={inputClass} placeholder="Web, E-commerce, Chatbot..." />
          </div>

          <div>
            <label className={labelClass}>Estado</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="lead">Lead</option>
              <option value="propuesta">Propuesta enviada</option>
              <option value="seña">Seña pagada</option>
              <option value="diseño">En diseño</option>
              <option value="desarrollo">En desarrollo</option>
              <option value="demo">Demo listo</option>
              <option value="deploy">Deployado</option>
              <option value="finalizado">Finalizado</option>
              <option value="pausado">Pausado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-gray-800 pb-2">
          Financiero
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Monto total del proyecto (ARS) *</label>
            <input name="total_amount" type="number" required min="0" value={form.total_amount} onChange={handleChange} className={inputClass} placeholder="250000" />
          </div>
          <div>
            <label className={labelClass}>Semanas estimadas</label>
            <input name="weeks" type="number" value={form.weeks} onChange={handleChange} className={inputClass} placeholder="4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Seña (50%)</label>
            <input value={calculated.deposit ? `$${calculated.deposit.toLocaleString('es-AR')}` : '-'} readOnly className={readonlyClass} />
          </div>
          <div>
            <label className={labelClass}>Final (50%)</label>
            <input value={calculated.final ? `$${calculated.final.toLocaleString('es-AR')}` : '-'} readOnly className={readonlyClass} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-none transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
        >
          {saving ? 'Guardando...' : client ? 'Guardar cambios' : 'Crear cliente'}
        </button>
        <a href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
          Cancelar
        </a>
      </div>
    </form>
  );
}
