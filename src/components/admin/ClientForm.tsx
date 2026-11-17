import { useState, useMemo, useId } from 'react';
import type { Client } from '../../types/admin';
import { adminFetch } from '../../lib/admin-fetch';
import { PLANES_WEB, MODALIDADES, formatARS, type Modalidad } from '../../lib/pricing';
import { hoyAR } from '../../lib/cobros';

interface ClientFormProps {
  client?: Client;
  onSuccess?: () => void;
}

export default function ClientForm({ client, onSuccess }: ClientFormProps) {
  const formId = useId();
  const [form, setForm] = useState({
    name: client?.name || '',
    phone: client?.phone || '549',
    email: client?.email || '',
    project_name: client?.project_name || '',
    project_type: client?.project_type || 'web',
    status: client?.status || 'lead',
    currency: client?.currency || 'ARS',
    total_amount: client?.total_amount?.toString() || '',
    weeks: client?.weeks?.toString() || '',
    access_code: client?.access_code || '',
    modalidad: (client?.modalidad || '') as Modalidad | '',
    plan_id: client?.plan_id || '',
    abono_alta: client?.abono_alta?.toString() || '',
    abono_mensual: client?.abono_mensual?.toString() || '',
    permanencia_meses: client?.permanencia_meses?.toString() || '',
    abono_inicio: client?.abono_inicio?.slice(0, 10) || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const calculated = useMemo(() => {
    const total = parseFloat(form.total_amount) || 0;
    const deposit = Math.round(total / 2);
    return { deposit, final: total - deposit };
  }, [form.total_amount]);

  /** Al elegir modalidad o plan, precarga los importes de pricing.ts (quedan editables). */
  function precargar(next: typeof form): typeof form {
    const plan = PLANES_WEB.find((pl) => pl.id === next.plan_id);
    if (!plan) return next;
    if (next.modalidad === 'abono') {
      return {
        ...next,
        abono_alta: String(plan.abono.alta),
        abono_mensual: String(plan.abono.mensual),
        permanencia_meses: String(plan.abono.permanenciaMeses),
        abono_inicio: next.abono_inicio || hoyAR(),
      };
    }
    if (next.modalidad === 'unico') return { ...next, total_amount: String(plan.unico) };
    return next;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'modalidad' && value === 'proyecto') next.plan_id = '';
      return name === 'modalidad' || name === 'plan_id' ? precargar(next) : next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const total = parseFloat(form.total_amount) || 0;
    const num = (v: string) => (v.trim() === '' ? null : Number(v));
    const esAbono = form.modalidad === 'abono';

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      project_name: form.project_name || null,
      project_type: form.project_type,
      status: form.status,
      currency: form.currency,
      total_amount: total || null,
      deposit_amount: total ? Math.round(total * 0.5) : null,
      design_amount: null,
      final_amount: total ? Math.round(total * 0.5) : null,
      weeks: form.weeks ? parseInt(form.weeks) : null,
      access_code: form.access_code || null,
      modalidad: form.modalidad || null,
      plan_id: form.modalidad === 'proyecto' ? null : form.plan_id || null,
      abono_alta: esAbono ? num(form.abono_alta) : null,
      abono_mensual: esAbono ? num(form.abono_mensual) : null,
      permanencia_meses: esAbono ? num(form.permanencia_meses) : null,
      abono_inicio: esAbono ? form.abono_inicio || null : null,
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

  const inputClass = 'w-full bg-[var(--petrol)] border border-[var(--line-petrol)] rounded-none px-3 py-2 text-sm text-[var(--ice)] placeholder-[var(--on-petrol-soft)]  focus:border-[var(--ice)] transition-colors';
  const labelClass = 'block text-xs font-medium text-[var(--on-petrol-dim)] mb-1 uppercase tracking-wider';
  const readonlyClass = 'w-full bg-[var(--petrol)] border border-[var(--line-petrol)] rounded-none px-3 py-2 text-sm text-[var(--on-petrol-dim)] cursor-not-allowed';

  return (
    <form aria-describedby={error ? `${formId}-error` : undefined} onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div id={`${formId}-error`} role="alert" className="p-3 bg-[var(--petrol-deep)] border border-[#FFB4A8] text-[#FFB4A8] text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--ice)] uppercase tracking-wider border-b border-[var(--line-petrol)] pb-2">
            Información del cliente
          </h3>

          <div>
            <label htmlFor={`${formId}-name`} className={labelClass}>Nombre *</label>
            <input id={`${formId}-name`} name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Juan Pérez" />
          </div>

          <div>
            <label htmlFor={`${formId}-phone`} className={labelClass}>Teléfono (WhatsApp) *</label>
            <input id={`${formId}-phone`} name="phone" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="3757652007" />
          </div>

          <div>
            <label htmlFor={`${formId}-email`} className={labelClass}>Email</label>
            <input id={`${formId}-email`} name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="cliente@email.com" />
          </div>

          <div>
            <label htmlFor={`${formId}-access_code`} className={labelClass}>Código de Acceso (Portal)</label>
            <input id={`${formId}-access_code`} name="access_code" value={form.access_code} onChange={handleChange} className={inputClass} placeholder="Autogenerado si se deja vacío" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--ice)] uppercase tracking-wider border-b border-[var(--line-petrol)] pb-2">
            Detalles del proyecto
          </h3>

          <div>
            <label htmlFor={`${formId}-project_name`} className={labelClass}>Nombre del proyecto</label>
            <input id={`${formId}-project_name`} name="project_name" value={form.project_name} onChange={handleChange} className={inputClass} placeholder="Sitio web El Fogón" />
          </div>

          <div>
            <label htmlFor={`${formId}-project_type`} className={labelClass}>Tipo de proyecto</label>
            <input id={`${formId}-project_type`} name="project_type" value={form.project_type} onChange={handleChange} className={inputClass} placeholder="Web, E-commerce, Chatbot..." />
          </div>

          <div>
            <label htmlFor={`${formId}-status`} className={labelClass}>Estado</label>
            <select id={`${formId}-status`} name="status" value={form.status} onChange={handleChange} className={inputClass}>
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
        <h3 className="text-sm font-semibold text-[var(--ice)] uppercase tracking-wider border-b border-[var(--line-petrol)] pb-2">
          Servicio y pago
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${formId}-modalidad`} className={labelClass}>Modalidad</label>
            <select id={`${formId}-modalidad`} name="modalidad" value={form.modalidad} onChange={handleChange} className={inputClass}>
              <option value="">Sin definir (consulta)</option>
              {(Object.keys(MODALIDADES) as Modalidad[]).map((m) => (
                <option key={m} value={m}>{MODALIDADES[m].label}</option>
              ))}
            </select>
          </div>
          {form.modalidad !== 'proyecto' && (
            <div>
              <label htmlFor={`${formId}-plan_id`} className={labelClass}>Plan</label>
              <select id={`${formId}-plan_id`} name="plan_id" value={form.plan_id} onChange={handleChange} className={inputClass}>
                <option value="">Sin plan</option>
                {PLANES_WEB.map((pl) => <option key={pl.id} value={pl.id}>{pl.nombre}</option>)}
              </select>
            </div>
          )}
          <div>
            <label htmlFor={`${formId}-weeks`} className={labelClass}>Semanas estimadas</label>
            <input id={`${formId}-weeks`} name="weeks" type="number" min="0" value={form.weeks} onChange={handleChange} className={inputClass} placeholder="4" />
          </div>
        </div>

        {form.modalidad === 'abono' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor={`${formId}-abono_alta`} className={labelClass}>Alta (ARS)</label>
                <input id={`${formId}-abono_alta`} name="abono_alta" type="number" min="0" value={form.abono_alta} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor={`${formId}-abono_mensual`} className={labelClass}>Abono mensual (ARS)</label>
                <input id={`${formId}-abono_mensual`} name="abono_mensual" type="number" min="0" value={form.abono_mensual} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor={`${formId}-permanencia_meses`} className={labelClass}>Permanencia (meses)</label>
                <input id={`${formId}-permanencia_meses`} name="permanencia_meses" type="number" min="0" value={form.permanencia_meses} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor={`${formId}-abono_inicio`} className={labelClass}>Inicio del abono</label>
                <input id={`${formId}-abono_inicio`} name="abono_inicio" type="date" value={form.abono_inicio} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <p className="text-xs text-[var(--on-petrol-dim)]">
              El abono vence cada mes el mismo día que el inicio. Poné la fecha en que pagó el alta, o la de entrega si preferís contar desde ahí.
            </p>
          </>
        )}

        {form.modalidad !== 'abono' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor={`${formId}-total_amount`} className={labelClass}>Total (ARS)</label>
              <input id={`${formId}-total_amount`} name="total_amount" type="number" min="0" value={form.total_amount} onChange={handleChange} className={inputClass} placeholder="Opcional" />
            </div>
            {form.modalidad === 'unico' && (
              <>
                <div>
                  <label htmlFor={`${formId}-deposit`} className={labelClass}>Anticipo 50%</label>
                  <input id={`${formId}-deposit`} value={calculated.deposit ? formatARS(calculated.deposit) : '—'} readOnly className={readonlyClass} />
                </div>
                <div>
                  <label htmlFor={`${formId}-final`} className={labelClass}>Contra entrega 50%</label>
                  <input id={`${formId}-final`} value={calculated.final ? formatARS(calculated.final) : '—'} readOnly className={readonlyClass} />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-[var(--line-petrol)]">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-lime    font-medium py-2 px-6 rounded-none transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
        >
          {saving ? 'Guardando...' : client ? 'Guardar cambios' : 'Crear cliente'}
        </button>
        <a href="/admin" className="btn btn-ghost text-sm text-[var(--on-petrol-dim)]  transition-colors">
          Cancelar
        </a>
      </div>
    </form>
  );
}
