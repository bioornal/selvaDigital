// Piezas compartidas del tablero de cobros: carga de pagos, estado por cliente y etiqueta visual.
import { useEffect, useMemo, useState } from 'react';
import type { Client, Payment } from '../../types/admin';
import { adminFetch } from '../../lib/admin-fetch';
import { estadoCobro, etiquetaEstado, hoyAR, sumarMeses, type EstadoCobro } from '../../lib/cobros';

/** Pagos de todos los clientes con abono, desde el inicio más viejo hasta un año adelante (pagos adelantados). */
export function usePagos(clients: Client[], desdeMinimo?: string) {
  const [pagos, setPagos] = useState<Payment[]>([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const hoy = hoyAR();

  const desde = useMemo(() => {
    const inicios = clients.filter((c) => c.abono_inicio).map((c) => c.abono_inicio!.slice(0, 10));
    if (desdeMinimo) inicios.push(desdeMinimo);
    return inicios.sort()[0] ?? null;
  }, [clients, desdeMinimo]);

  useEffect(() => {
    if (!desde) { setPagos([]); return; }
    let vigente = true;
    setCargando(true);
    setError('');
    adminFetch(`/api/admin/payments?desde=${desde}&hasta=${sumarMeses(hoy, 12)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
        if (vigente) setPagos(Array.isArray(data) ? data : []);
      })
      .catch((e: Error) => vigente && setError(e.message || 'No pude cargar los pagos'))
      .finally(() => vigente && setCargando(false));
    return () => { vigente = false; };
  }, [desde, hoy]);

  const porCliente = useMemo(() => {
    const mapa = new Map<string, Payment[]>();
    for (const p of pagos) {
      const lista = mapa.get(p.client_id) ?? [];
      lista.push(p);
      mapa.set(p.client_id, lista);
    }
    return mapa;
  }, [pagos]);

  const estado = (c: Client): EstadoCobro => estadoCobro(c, porCliente.get(c.id) ?? [], hoy);

  return { pagos, porCliente, estado, error, cargando, hoy };
}

const TONO: Record<EstadoCobro['tipo'], string> = {
  no_aplica: 'var(--on-petrol-dim)',
  al_dia: 'var(--lime)',
  vence_pronto: 'var(--ice)',
  en_aguante: '#F5C76B',
  para_baja: '#FFB4A8',
};

/** Punto + texto: el color nunca va solo. */
export function EstadoCobroBadge({ estado }: { estado: EstadoCobro }) {
  if (estado.tipo === 'no_aplica') return <span className="text-xs text-[var(--on-petrol-dim)]">—</span>;
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs" style={{ color: TONO[estado.tipo] }}>
      <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full" style={{ background: TONO[estado.tipo] }} />
      {etiquetaEstado(estado)}
    </span>
  );
}

export const debe = (e: EstadoCobro) => e.tipo === 'en_aguante' || e.tipo === 'para_baja';
