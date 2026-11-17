// Bloque «Hoy» del tablero: a quién cobrar, quién está en aguante, quién está para dar de baja
// y qué consultas siguen abiertas. Cada cobro trae el WhatsApp ya escrito; lo manda el dueño.
import type { Client } from '../../types/admin';
import type { EstadoCobro } from '../../lib/cobros';
import { diasEntre, fechaCorta } from '../../lib/cobros';
import { formatARS } from '../../lib/pricing';
import { linkWhatsAppCliente, mensajeCobro } from '../../lib/mensajes-cobro';
import { EstadoCobroBadge } from './cobros-ui';

interface Props {
  clients: Client[];
  estado: (c: Client) => EstadoCobro;
  hoy: string;
  cargando: boolean;
  error: string;
}

interface Fila { client: Client; estado: EstadoCobro }

function monto(c: Client, e: EstadoCobro): string {
  if (e.tipo === 'en_aguante' || e.tipo === 'para_baja') return formatARS(e.adeudado);
  return c.abono_mensual ? formatARS(c.abono_mensual) : '';
}

function detalle(e: EstadoCobro): string {
  if (e.tipo === 'para_baja') return `venció el ${fechaCorta(e.vencido)} · ${e.diasAtraso} días`;
  if (e.tipo === 'en_aguante') return `venció el ${fechaCorta(e.vencido)}`;
  if (e.tipo === 'vence_pronto') return `vence el ${fechaCorta(e.proximo)}`;
  return '';
}

function FilaCobro({ client, estado }: Fila) {
  const texto = mensajeCobro(client, estado);
  const meses = (estado.tipo === 'en_aguante' || estado.tipo === 'para_baja') && estado.mesesAdeudados > 1
    ? ` · ${estado.mesesAdeudados} meses` : '';
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
      <div className="min-w-0 flex-1 basis-48">
        <a href={`/admin/clientes/${client.id}`} className="font-medium text-[var(--ice)] hover:underline underline-offset-4">
          {client.name}
        </a>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <EstadoCobroBadge estado={estado} />
          <span className="font-mono text-xs text-[var(--on-petrol-dim)]">{detalle(estado)}{meses}</span>
        </div>
      </div>
      <span className="font-mono text-sm text-[var(--ice)] tabular-nums">{monto(client, estado)}</span>
      {texto && client.phone && (
        <a
          href={linkWhatsAppCliente(client.phone, texto)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost inline-flex items-center gap-2 text-sm"
          data-wa-origen="admin-hoy"
        >
          Recordar por WhatsApp
        </a>
      )}
    </li>
  );
}

function Grupo({ titulo, filas, vacio }: { titulo: string; filas: Fila[]; vacio?: boolean }) {
  if (filas.length === 0 && !vacio) return null;
  return (
    <section aria-label={titulo} className="py-4 first:pt-0">
      <h3 className="flex items-baseline gap-2 text-sm font-semibold text-[var(--ice)]">
        {titulo}
        <span className="font-mono text-xs font-normal text-[var(--on-petrol-dim)]">{filas.length}</span>
      </h3>
      <ul className="divide-y divide-[var(--line-petrol)]">
        {filas.map((f) => <FilaCobro key={f.client.id} {...f} />)}
      </ul>
    </section>
  );
}

export default function HoyCobros({ clients, estado, hoy, cargando, error }: Props) {
  const filas = clients.map((client) => ({ client, estado: estado(client) }));
  const porTipo = (tipo: EstadoCobro['tipo']) => filas.filter((f) => f.estado.tipo === tipo);
  const baja = porTipo('para_baja').sort((a, b) => b.estado.tipo === 'para_baja' && a.estado.tipo === 'para_baja' ? b.estado.diasAtraso - a.estado.diasAtraso : 0);
  const aguante = porTipo('en_aguante').sort((a, b) => b.estado.tipo === 'en_aguante' && a.estado.tipo === 'en_aguante' ? b.estado.dia - a.estado.dia : 0);
  const pronto = porTipo('vence_pronto').sort((a, b) => a.estado.tipo === 'vence_pronto' && b.estado.tipo === 'vence_pronto' ? a.estado.dias - b.estado.dias : 0);
  const consultas = clients
    .filter((c) => c.status === 'lead' || c.status === 'propuesta')
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  const nadaDeCobro = baja.length + aguante.length + pronto.length === 0;

  return (
    <section aria-labelledby="hoy-titulo" className="mb-8 border border-[var(--line-petrol)] bg-[var(--petrol-deep)] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="hoy-titulo" className="text-lg font-semibold text-[var(--ice)]">Hoy</h2>
        <a href="/admin/cobros" className="font-mono text-xs text-[var(--on-petrol-soft)] underline underline-offset-4 hover:text-[var(--ice)]">
          Ver cobros mes a mes →
        </a>
      </div>

      {error && (
        <p role="alert" className="mb-4 border border-[#FFB4A8] p-3 text-sm text-[#FFB4A8]">
          No pude cargar los pagos: {error}. Los estados de cobro pueden no estar al día.
        </p>
      )}

      {cargando ? (
        <p className="text-sm text-[var(--on-petrol-dim)]" role="status">Calculando vencimientos…</p>
      ) : (
        <div className="divide-y divide-[var(--line-petrol)]">
          <Grupo titulo="Para dar de baja" filas={baja} />
          <Grupo titulo="En aguante" filas={aguante} />
          <Grupo titulo="Vencen en los próximos 3 días" filas={pronto} />
          {nadaDeCobro && !error && (
            <p className="py-4 first:pt-0 text-sm text-[var(--on-petrol-soft)]">
              <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--lime)]" />
              Cobros al día: nadie vence en los próximos 3 días.
            </p>
          )}
          <section aria-label="Consultas abiertas" className="py-4 last:pb-0">
            <h3 className="flex items-baseline gap-2 text-sm font-semibold text-[var(--ice)]">
              Consultas abiertas
              <span className="font-mono text-xs font-normal text-[var(--on-petrol-dim)]">{consultas.length}</span>
            </h3>
            {consultas.length === 0 ? (
              <p className="pt-2 text-sm text-[var(--on-petrol-dim)]">No hay consultas ni propuestas pendientes.</p>
            ) : (
              <ul className="divide-y divide-[var(--line-petrol)]">
                {consultas.map((c) => {
                  const dias = diasEntre(c.created_at.slice(0, 10), hoy);
                  return (
                    <li key={c.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                      <a href={`/admin/clientes/${c.id}`} className="font-medium text-[var(--ice)] hover:underline underline-offset-4">
                        {c.name}
                      </a>
                      <span className="font-mono text-xs text-[var(--on-petrol-dim)]">
                        {c.status === 'lead' ? 'Consulta' : 'Propuesta enviada'} · {dias === 0 ? 'hoy' : dias === 1 ? 'hace 1 día' : `hace ${dias} días`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
