// Ficha del cliente → «Servicio y cobros»: datos del servicio, estado del abono,
// historial de pagos y las acciones de entrega, condiciones, baja y reactivación.
import { useEffect, useId, useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Client, Payment } from '../../types/admin';
import { TIPOS_PAGO, MEDIOS_PAGO } from '../../types/admin';
import { adminFetch } from '../../lib/admin-fetch';
import { estadoCobro, finPermanencia, hoyAR, tocaAjusteIPC, fechaCorta } from '../../lib/cobros';
import { PLANES_WEB, MODALIDADES, formatARS } from '../../lib/pricing';
import { linkWhatsAppCliente, mensajeCobro } from '../../lib/mensajes-cobro';
import { EstadoCobroBadge } from './cobros-ui';

interface Props {
  client: Client;
  onClientChange: (c: Client) => void;
}

const fechaLarga = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

async function leerError(res: Response): Promise<string> {
  const data = await res.json().catch(() => ({}));
  return data.error || `Error ${res.status}`;
}

export default function ServicioCobros({ client, onClientChange }: Props) {
  const id = useId();
  const hoy = hoyAR();
  const [pagos, setPagos] = useState<Payment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState('');
  const vacio = () => ({
    tipo: (client.modalidad === 'abono' ? 'abono' : client.modalidad === 'unico' ? 'anticipo' : 'otro') as Payment['tipo'],
    monto: client.modalidad === 'abono' && client.abono_mensual ? String(client.abono_mensual) : '',
    pagado_at: hoy,
    medio: 'transferencia' as Payment['medio'],
    nota: '',
    periodo: '',
  });
  const [form, setForm] = useState(vacio);

  async function cargarPagos() {
    setCargando(true);
    try {
      const res = await adminFetch(`/api/admin/payments?client_id=${client.id}`);
      if (!res.ok) throw new Error(await leerError(res));
      setPagos(await res.json());
      setError('');
    } catch (e: any) {
      setError(e.message || 'No pude cargar los pagos');
    }
    setCargando(false);
  }

  useEffect(() => { cargarPagos(); }, [client.id]);

  async function actualizar(cambios: Partial<Client>, ok: string) {
    setError('');
    setAviso('');
    try {
      const res = await adminFetch(`/api/admin/clients/${client.id}`, { method: 'PUT', body: JSON.stringify(cambios) });
      if (!res.ok) throw new Error(await leerError(res));
      onClientChange(await res.json());
      setAviso(ok);
    } catch (e: any) {
      setError(e.message || 'No pude guardar el cambio');
    }
  }

  async function registrarPago(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError('');
    setAviso('');
    try {
      const res = await adminFetch('/api/admin/payments', {
        method: 'POST',
        body: JSON.stringify({ ...form, client_id: client.id, monto: Number(form.monto), periodo: form.tipo === 'abono' ? form.periodo : '' }),
      });
      if (!res.ok) throw new Error(await leerError(res));
      const pago: Payment = await res.json();
      setAviso(pago.periodo ? `Pago registrado: abono del ${fechaCorta(pago.periodo)}.` : 'Pago registrado.');
      setForm(vacio());
      await cargarPagos();
    } catch (e: any) {
      setError(e.message || 'No pude registrar el pago');
    }
    setGuardando(false);
  }

  async function borrarPago(p: Payment) {
    if (!window.confirm(`¿Borrar el pago de ${formatARS(Number(p.monto))} del ${fechaLarga(p.pagado_at)}?`)) return;
    try {
      const res = await adminFetch(`/api/admin/payments/${p.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await leerError(res));
      await cargarPagos();
    } catch (e: any) {
      setError(e.message || 'No pude borrar el pago');
    }
  }

  const estado = estadoCobro(client, pagos, hoy);
  const recordatorio = mensajeCobro(client, estado);
  const plan = PLANES_WEB.find((p) => p.id === client.plan_id);
  const fin = finPermanencia(client);
  const baja = client.servicio_estado === 'baja';

  const dato = (titulo: string, valor: React.ReactNode) => (
    <div>
      <dt className="text-xs text-[var(--on-petrol-soft)]">{titulo}</dt>
      <dd className="text-sm text-[var(--ice)]">{valor}</dd>
    </div>
  );
  const labelClass = 'mb-1 block text-xs text-[var(--on-petrol-dim)]';
  const campo = 'w-full px-3 py-2 text-sm';

  return (
    <section aria-labelledby={`${id}-titulo`} className="space-y-5 border border-[var(--line-petrol)] bg-[var(--petrol-deep)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-petrol)] pb-3">
        <h3 id={`${id}-titulo`} className="text-xs font-semibold uppercase tracking-wider text-[var(--on-petrol-dim)]">Servicio y cobros</h3>
        <div className="flex flex-wrap items-center gap-3">
          {baja ? <span className="font-mono text-xs text-[var(--on-petrol-dim)]">Dado de baja{client.baja_at ? ` el ${fechaLarga(client.baja_at)}` : ''}</span>
            : <EstadoCobroBadge estado={estado} />}
          {tocaAjusteIPC(client, hoy) && (
            <span className="border border-[#F5C76B] px-2 py-0.5 font-mono text-xs text-[#F5C76B]">Toca ajuste IPC</span>
          )}
        </div>
      </div>

      {error && <p role="alert" className="border border-[#FFB4A8] p-3 text-sm text-[#FFB4A8]">{error}</p>}
      {aviso && <p role="status" className="border border-[var(--lime)] p-3 text-sm text-[var(--ice)]">{aviso}</p>}

      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {dato('Modalidad', client.modalidad ? MODALIDADES[client.modalidad].label : 'Sin definir')}
        {dato('Plan', plan?.nombre ?? '—')}
        {client.modalidad === 'abono' ? (
          <>
            {dato('Alta', client.abono_alta ? formatARS(client.abono_alta) : '—')}
            {dato('Abono', client.abono_mensual ? `${formatARS(client.abono_mensual)}/mes` : '—')}
            {dato('Inicio del abono', client.abono_inicio ? fechaLarga(client.abono_inicio) : '—')}
            {dato('Permanencia hasta', fin ? fechaLarga(fin) : '—')}
          </>
        ) : (
          dato('Total', client.total_amount ? formatARS(client.total_amount) : '—')
        )}
        {dato('Entrega', client.entregado_at ? `Entregado el ${fechaLarga(client.entregado_at)}` : 'Sin entregar')}
        {dato('Condiciones', client.condiciones_aceptadas_at
          ? `Aceptadas el ${fechaLarga(client.condiciones_aceptadas_at.slice(0, 10))}` : 'Sin registrar')}
      </dl>

      <div className="flex flex-wrap gap-2">
        {recordatorio && client.phone && !baja && (
          <a href={linkWhatsAppCliente(client.phone, recordatorio)} target="_blank" rel="noopener noreferrer"
            className="btn btn-lime text-sm" data-wa-origen="admin-ficha">
            Recordar por WhatsApp
          </a>
        )}
        {!client.entregado_at && (
          <button type="button" className="btn btn-ghost text-sm" onClick={() => actualizar({ entregado_at: hoy }, 'Marcado como entregado.')}>
            Marcar entregado
          </button>
        )}
        {!client.condiciones_aceptadas_at && (
          <button type="button" className="btn btn-ghost text-sm"
            onClick={() => actualizar({ condiciones_aceptadas_at: new Date().toISOString() }, 'Aceptación de condiciones registrada.')}>
            Registrar aceptación de condiciones
          </button>
        )}
        {client.modalidad === 'abono' && !baja && (
          <button type="button" className="btn btn-ghost text-sm" style={{ color: '#FFB4A8' }}
            onClick={() => window.confirm(`¿Dar de baja a ${client.name}? Acordate de apagar el sitio.`)
              && actualizar({ servicio_estado: 'baja', baja_at: hoy }, 'Cliente dado de baja.')}>
            Dar de baja
          </button>
        )}
        {baja && (
          <button type="button" className="btn btn-ghost text-sm"
            onClick={() => window.confirm('¿Reactivar? El abono vuelve a contar desde hoy.')
              && actualizar({ servicio_estado: 'activo', baja_at: null, abono_inicio: hoy }, 'Servicio reactivado: el próximo vencimiento es en un mes.')}>
            Reactivar
          </button>
        )}
      </div>

      <form onSubmit={registrarPago} aria-labelledby={`${id}-pago`} className="space-y-3 border-t border-[var(--line-petrol)] pt-4">
        <h4 id={`${id}-pago`} className="text-sm font-semibold text-[var(--ice)]">Registrar pago</h4>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          <div>
            <label htmlFor={`${id}-tipo`} className={labelClass}>Tipo</label>
            <select id={`${id}-tipo`} className={campo} value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as Payment['tipo'] })}>
              {Object.entries(TIPOS_PAGO).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-monto`} className={labelClass}>Monto (ARS)</label>
            <input id={`${id}-monto`} className={campo} type="number" min="1" required value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })} />
          </div>
          <div>
            <label htmlFor={`${id}-fecha`} className={labelClass}>Fecha de pago</label>
            <input id={`${id}-fecha`} className={campo} type="date" required value={form.pagado_at}
              onChange={(e) => setForm({ ...form, pagado_at: e.target.value })} />
          </div>
          <div>
            <label htmlFor={`${id}-medio`} className={labelClass}>Medio</label>
            <select id={`${id}-medio`} className={campo} value={form.medio}
              onChange={(e) => setForm({ ...form, medio: e.target.value as Payment['medio'] })}>
              {Object.entries(MEDIOS_PAGO).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </select>
          </div>
          {form.tipo === 'abono' && (
            <div>
              <label htmlFor={`${id}-periodo`} className={labelClass}>Vencimiento que cubre</label>
              <input id={`${id}-periodo`} className={campo} type="date" value={form.periodo}
                onChange={(e) => setForm({ ...form, periodo: e.target.value })} aria-describedby={`${id}-periodo-ayuda`} />
            </div>
          )}
          <div className={form.tipo === 'abono' ? '' : 'md:col-span-2'}>
            <label htmlFor={`${id}-nota`} className={labelClass}>Nota</label>
            <input id={`${id}-nota`} className={campo} maxLength={500} value={form.nota} placeholder="Opcional"
              onChange={(e) => setForm({ ...form, nota: e.target.value })} />
          </div>
        </div>
        {form.tipo === 'abono' && (
          <p id={`${id}-periodo-ayuda`} className="text-xs text-[var(--on-petrol-dim)]">
            Si dejás el vencimiento vacío, se asigna al mes impago más viejo.
          </p>
        )}
        <button type="submit" disabled={guardando} className="btn btn-ghost text-sm">
          {guardando ? 'Guardando…' : 'Registrar pago'}
        </button>
      </form>

      <div className="border-t border-[var(--line-petrol)] pt-4">
        <h4 className="mb-2 text-sm font-semibold text-[var(--ice)]">Pagos</h4>
        {cargando ? (
          <p role="status" className="text-sm text-[var(--on-petrol-dim)]">Cargando pagos…</p>
        ) : pagos.length === 0 ? (
          <p className="text-sm text-[var(--on-petrol-dim)]">Todavía no hay pagos registrados.</p>
        ) : (
          <ul className="divide-y divide-[var(--line-petrol)]">
            {pagos.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
                <div className="min-w-0">
                  <span className="font-mono text-sm text-[var(--ice)]">{formatARS(Number(p.monto))}</span>
                  <span className="ml-2 text-sm text-[var(--on-petrol-soft)]">
                    {TIPOS_PAGO[p.tipo]}{p.periodo ? ` del ${fechaCorta(p.periodo)}` : ''}
                  </span>
                  <div className="font-mono text-xs text-[var(--on-petrol-dim)]">
                    {fechaLarga(p.pagado_at)} · {MEDIOS_PAGO[p.medio]}{p.nota ? ` · ${p.nota}` : ''}
                  </div>
                </div>
                <button type="button" onClick={() => borrarPago(p)} className="btn btn-ghost inline-flex items-center gap-1 text-xs" style={{ color: '#FFB4A8' }}
                  aria-label={`Borrar pago de ${formatARS(Number(p.monto))} del ${fechaLarga(p.pagado_at)}`}>
                  <Trash2 className="h-3 w-3" aria-hidden="true" />Borrar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
