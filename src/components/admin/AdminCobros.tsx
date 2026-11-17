// Cobros mes a mes: clientes con abono × 6 meses, más el total cobrado de cada mes.
// En el celular se ve un mes por vez, como lista.
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Client, Payment } from '../../types/admin';
import { adminFetch } from '../../lib/admin-fetch';
import { DIAS_AGUANTE, diasEntre, fechaCorta, hoyAR, sumarMeses, vencimientos } from '../../lib/cobros';
import { formatARS } from '../../lib/pricing';
import { usePagos } from './cobros-ui';

const MESES_VISIBLES = 6;

type Celda =
  | { tipo: 'sin'; }
  | { tipo: 'pagado'; vence: string; monto: number }
  | { tipo: 'pendiente' | 'aguante' | 'atrasado'; vence: string };

const ESTILO: Record<Celda['tipo'], { texto: string; color: string }> = {
  sin: { texto: '—', color: 'var(--on-petrol-dim)' },
  pagado: { texto: 'Pagado', color: 'var(--lime)' },
  pendiente: { texto: 'Pendiente', color: 'var(--on-petrol-soft)' },
  aguante: { texto: 'En aguante', color: '#F5C76B' },
  atrasado: { texto: 'Atrasado', color: '#FFB4A8' },
};

const primerDia = (iso: string) => `${iso.slice(0, 7)}-01`;
/** Último día del mes de `mes` ('YYYY-MM-01'). */
const ultimoDia = (mes: string) => new Date(Date.UTC(+mes.slice(0, 4), +mes.slice(5, 7), 0)).toISOString().slice(0, 10);
const etiquetaMes = (mes: string) =>
  new Intl.DateTimeFormat('es-AR', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${mes}T12:00:00Z`)).replace('.', '');

function celda(c: Client, mes: string, pagos: Payment[], hoy: string): Celda {
  if (c.modalidad !== 'abono' || !c.abono_inicio) return { tipo: 'sin' };
  const vence = vencimientos(c.abono_inicio, ultimoDia(mes)).find((v) => v.startsWith(mes.slice(0, 7)));
  if (!vence) return { tipo: 'sin' };
  const pago = pagos.find((p) => p.tipo === 'abono' && p.periodo?.slice(0, 10) === vence);
  if (pago) return { tipo: 'pagado', vence, monto: Number(pago.monto) };
  // Después de la baja ya no hay vencimientos.
  if (c.servicio_estado === 'baja' && (!c.baja_at || vence > c.baja_at.slice(0, 10))) return { tipo: 'sin' };
  if (vence >= hoy) return { tipo: 'pendiente', vence };
  return { tipo: diasEntre(vence, hoy) <= DIAS_AGUANTE ? 'aguante' : 'atrasado', vence };
}

function VistaCelda({ c, baja }: { c: Celda; baja: boolean }) {
  const e = ESTILO[c.tipo];
  const color = baja && c.tipo !== 'pagado' ? 'var(--on-petrol-dim)' : e.color;
  if (c.tipo === 'sin') return <span className="text-[var(--on-petrol-dim)]">—</span>;
  return (
    <span className="flex flex-col gap-0.5 font-mono text-xs" style={{ color }}>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
        {e.texto}
      </span>
      <span className="text-[var(--on-petrol-dim)]">
        {fechaCorta(c.vence)}{c.tipo === 'pagado' ? ` · ${formatARS(c.monto)}` : ''}
      </span>
    </span>
  );
}

export default function AdminCobros() {
  const [clients, setClients] = useState<Client[]>([]);
  const [cargandoClientes, setCargandoClientes] = useState(true);
  const [errorClientes, setErrorClientes] = useState('');
  const [corrimiento, setCorrimiento] = useState(0); // meses hacia atrás desde el actual
  const [mesMovil, setMesMovil] = useState(MESES_VISIBLES - 1);

  useEffect(() => {
    adminFetch('/api/admin/clients')
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
        setClients(Array.isArray(data) ? data : []);
      })
      .catch((e: Error) => setErrorClientes(e.message || 'No pude cargar los clientes'))
      .finally(() => setCargandoClientes(false));
  }, []);

  const hoyMes = primerDia(hoyAR());
  const meses = useMemo(() => {
    const ultimo = sumarMeses(primerDia(hoyMes), -corrimiento);
    return Array.from({ length: MESES_VISIBLES }, (_, i) => sumarMeses(ultimo, i - (MESES_VISIBLES - 1)));
  }, [hoyMes, corrimiento]);

  const { pagos, porCliente, hoy, error, cargando } = usePagos(clients, meses[0]);
  const conAbono = clients
    .filter((c) => c.modalidad === 'abono')
    .sort((a, b) => Number(a.servicio_estado === 'baja') - Number(b.servicio_estado === 'baja') || a.name.localeCompare(b.name));

  const totalMes = (mes: string) => pagos
    .filter((p) => p.pagado_at.slice(0, 7) === mes.slice(0, 7))
    .reduce((s, p) => s + Number(p.monto), 0);

  const errorTexto = errorClientes || error;
  const mesActivo = meses[mesMovil];

  const navegacion = (
    <div className="flex items-center gap-2">
      <button type="button" className="btn btn-ghost inline-flex items-center gap-1 text-sm" onClick={() => setCorrimiento((n) => n + MESES_VISIBLES)}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />Anteriores
      </button>
      <button type="button" className="btn btn-ghost inline-flex items-center gap-1 text-sm" disabled={corrimiento === 0}
        onClick={() => setCorrimiento((n) => Math.max(0, n - MESES_VISIBLES))}>
        Siguientes<ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );

  if (cargandoClientes) {
    return <p role="status" className="text-sm text-[var(--on-petrol-dim)]">Cargando clientes…</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[var(--ice)]">Cobros mes a mes</h1>
          <p className="mt-1 text-sm text-[var(--on-petrol-soft)]">
            Abonos de cada cliente por vencimiento. El total suma todo lo que entró en el mes: altas, abonos, anticipos y saldos.
          </p>
        </div>
        <div className="hidden md:block">{navegacion}</div>
      </div>

      {errorTexto && (
        <p role="alert" className="mb-4 border border-[#FFB4A8] p-3 text-sm text-[#FFB4A8]">{errorTexto}</p>
      )}
      {cargando && <p role="status" className="mb-4 text-sm text-[var(--on-petrol-dim)]">Cargando pagos…</p>}

      {conAbono.length === 0 && !errorTexto ? (
        <div className="border border-dashed border-[var(--line-petrol)] bg-[var(--petrol-deep)] py-10 text-center">
          <p className="mb-2 text-[var(--on-petrol-soft)]">Todavía no hay clientes con abono mensual.</p>
          <a href="/admin/clientes/nuevo" className="btn btn-ghost text-sm">Cargar un cliente</a>
        </div>
      ) : (
        <>
          {/* Escritorio: grilla */}
          <div className="hidden overflow-x-auto border border-[var(--line-petrol)] bg-[var(--petrol-deep)] md:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Estado del abono por cliente y mes</caption>
              <thead>
                <tr className="border-b border-[var(--line-petrol)]">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--on-petrol-soft)]">Cliente</th>
                  {meses.map((m) => (
                    <th key={m} scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--on-petrol-soft)]">
                      {etiquetaMes(m)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-petrol)]">
                {conAbono.map((c) => {
                  const baja = c.servicio_estado === 'baja';
                  return (
                    <tr key={c.id} className={baja ? 'opacity-70' : 'hover:bg-[var(--petrol-raised)]'}>
                      <th scope="row" className="px-4 py-3 text-left font-normal">
                        <a href={`/admin/clientes/${c.id}`} style={{ fontFamily: 'var(--font-body)' }}
                          className="font-medium text-[var(--ice)] underline-offset-4 hover:underline">{c.name}</a>
                        <div className="font-mono text-xs text-[var(--on-petrol-dim)]">
                          {baja ? 'Dado de baja' : c.abono_mensual ? `${formatARS(c.abono_mensual)}/mes` : 'Sin monto'}
                        </div>
                      </th>
                      {meses.map((m) => (
                        <td key={m} className="px-3 py-3 align-top">
                          <VistaCelda c={celda(c, m, porCliente.get(c.id) ?? [], hoy)} baja={baja} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-[var(--line-petrol-strong)]">
                  <th scope="row" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--on-petrol-soft)]">Cobrado</th>
                  {meses.map((m) => (
                    <td key={m} className="px-3 py-3 font-mono text-sm text-[var(--ice)]">{formatARS(totalMes(m))}</td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Celular: un mes por vez */}
          <div className="md:hidden">
            <div className="mb-3 flex items-center justify-between gap-2 border border-[var(--line-petrol)] bg-[var(--petrol-deep)] p-2">
              <button type="button" className="btn btn-ghost" aria-label="Mes anterior"
                onClick={() => (mesMovil > 0 ? setMesMovil(mesMovil - 1) : (setCorrimiento((n) => n + 1)))}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="text-center" aria-live="polite">
                <div className="font-medium capitalize text-[var(--ice)]">{etiquetaMes(mesActivo)}</div>
                <div className="font-mono text-xs text-[var(--on-petrol-dim)]">Cobrado {formatARS(totalMes(mesActivo))}</div>
              </div>
              <button type="button" className="btn btn-ghost" aria-label="Mes siguiente"
                disabled={corrimiento === 0 && mesMovil === MESES_VISIBLES - 1}
                onClick={() => (mesMovil < MESES_VISIBLES - 1 ? setMesMovil(mesMovil + 1) : setCorrimiento((n) => Math.max(0, n - 1)))}>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <ul className="divide-y divide-[var(--line-petrol)] border border-[var(--line-petrol)] bg-[var(--petrol-deep)]">
              {conAbono.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <a href={`/admin/clientes/${c.id}`} className="font-medium text-[var(--ice)]">{c.name}</a>
                    <div className="font-mono text-xs text-[var(--on-petrol-dim)]">
                      {c.servicio_estado === 'baja' ? 'Dado de baja' : c.abono_mensual ? `${formatARS(c.abono_mensual)}/mes` : 'Sin monto'}
                    </div>
                  </div>
                  <VistaCelda c={celda(c, mesActivo, porCliente.get(c.id) ?? [], hoy)} baja={c.servicio_estado === 'baja'} />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
