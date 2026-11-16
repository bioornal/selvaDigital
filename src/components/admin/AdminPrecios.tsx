import { useEffect, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { adminFetch } from '../../lib/admin-fetch';
import {
  PLANES_WEB, EXTRA_IA, SOFTWARE, formatARS,
  preciosActuales, combinarPrecios, type PreciosEditables, type PreciosPlan,
} from '../../lib/pricing';

// En el navegador pricing.ts no está modificado: estos son los valores escritos en el código.
const PRECIOS_CODIGO = preciosActuales();

type Publicacion = 'iniciada' | 'sin-configurar' | 'error';

const MENSAJE_PUBLICACION: Record<Publicacion, string> = {
  iniciada: 'Guardado. La web se está republicando: los precios nuevos aparecen en 1 a 2 minutos.',
  'sin-configurar': 'Guardado en la base, pero la web no se republicó sola porque falta VERCEL_DEPLOY_HOOK_URL. Los precios nuevos aparecen en el próximo deploy.',
  error: 'Guardado, pero Vercel no aceptó la republicación. Volvé a guardar o hacé un redeploy desde Vercel.',
};

const labelClass = 'block text-xs font-medium text-[var(--on-petrol-dim)] mb-1 uppercase tracking-wider';
const boxClass = 'flex items-center bg-[var(--petrol)] border border-[var(--line-petrol)] focus-within:border-[var(--ice)] transition-colors';
const inputClass = 'w-full min-w-0 bg-transparent px-2 py-2 text-sm text-[var(--ice)] tabular-nums outline-none';

function Antes({ actual, antes, formato = formatARS }: { actual: number; antes: number; formato?: (n: number) => string }) {
  if (actual === antes) return null;
  return <p className="mt-1 text-xs text-[var(--lime)]">Antes: {formato(antes)}</p>;
}

function CampoImporte({ id, label, value, antes, onChange, sufijo }: {
  id: string; label: string; value: number; antes: number; onChange: (n: number) => void; sufijo?: string;
}) {
  // Mientras se escribe se muestran sólo dígitos; al salir, con separador de miles.
  const [texto, setTexto] = useState<string | null>(null);
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <div className={boxClass}>
        <span className="pl-3 text-sm text-[var(--on-petrol-soft)]" aria-hidden="true">$</span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={texto ?? value.toLocaleString('es-AR')}
          onFocus={(e) => { setTexto(String(value)); requestAnimationFrame(() => e.target.select()); }}
          onBlur={() => setTexto(null)}
          onChange={(e) => {
            const digitos = e.target.value.replace(/\D/g, '').slice(0, 10);
            setTexto(digitos);
            onChange(digitos === '' ? 0 : Number(digitos));
          }}
          className={inputClass}
        />
        {sufijo && <span className="pr-3 text-xs text-[var(--on-petrol-soft)] whitespace-nowrap">{sufijo}</span>}
      </div>
      <Antes actual={value} antes={antes} />
    </div>
  );
}

function CampoMeses({ id, label, value, antes, onChange }: {
  id: string; label: string; value: number; antes: number; onChange: (n: number) => void;
}) {
  const meses = (n: number) => `${n} ${n === 1 ? 'mes' : 'meses'}`;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <div className={boxClass}>
        <input
          id={id}
          type="number"
          min={1}
          max={36}
          step={1}
          value={value || ''}
          onChange={(e) => onChange(Math.max(0, Math.min(36, Math.trunc(Number(e.target.value) || 0))))}
          className={`${inputClass} pl-3`}
        />
        <span className="pr-3 text-xs text-[var(--on-petrol-soft)]">meses</span>
      </div>
      {value < 1 && <p className="mt-1 text-xs text-[#FFB4A8]">Tiene que ser al menos 1 mes.</p>}
      <Antes actual={value} antes={antes} formato={meses} />
    </div>
  );
}

function Seccion({ titulo, detalle, children }: { titulo: string; detalle?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="border-b border-[var(--line-petrol)] pb-2">
        <h2 className="text-sm font-semibold text-[var(--ice)] uppercase tracking-wider">{titulo}</h2>
        {detalle && <p className="mt-1 text-sm text-[var(--on-petrol-dim)]">{detalle}</p>}
      </div>
      {children}
    </section>
  );
}

function Privado({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[var(--on-petrol-soft)] uppercase tracking-wider">{children}</p>;
}

export default function AdminPrecios() {
  const [precios, setPrecios] = useState<PreciosEditables | null>(null);
  const [guardados, setGuardados] = useState<PreciosEditables | null>(null);
  const [actualizado, setActualizado] = useState<string | null>(null);
  const [publicacionAutomatica, setPublicacionAutomatica] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  const hayCambios = Boolean(precios && guardados && JSON.stringify(precios) !== JSON.stringify(guardados));
  const esCodigo = Boolean(precios && JSON.stringify(precios) === JSON.stringify(PRECIOS_CODIGO));

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/api/admin/precios');
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
        const actuales = combinarPrecios(PRECIOS_CODIGO, data.precios);
        setPrecios(actuales);
        setGuardados(actuales);
        setActualizado(data.actualizado);
        setPublicacionAutomatica(Boolean(data.publicacionAutomatica));
      } catch (e: any) {
        setError(e.message || 'No pude cargar los precios.');
      }
      setCargando(false);
    })();
  }, []);

  useEffect(() => {
    if (!hayCambios) return;
    const avisar = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', avisar);
    return () => window.removeEventListener('beforeunload', avisar);
  }, [hayCambios]);

  function cambiarPlan(id: string, campo: keyof PreciosPlan, valor: number) {
    setAviso('');
    setPrecios((p) => p && { ...p, planes: { ...p.planes, [id]: { ...p.planes[id], [campo]: valor } } });
  }

  function cambiarIa(campo: keyof PreciosEditables['extraIa'], valor: number) {
    setAviso('');
    setPrecios((p) => p && { ...p, extraIa: { ...p.extraIa, [campo]: valor } });
  }

  function cambiar(campo: 'softwareDesde' | 'mantenimientoMensual', valor: number) {
    setAviso('');
    setPrecios((p) => p && { ...p, [campo]: valor });
  }

  async function guardar() {
    if (!precios) return;
    setGuardando(true);
    setError('');
    setAviso('');
    try {
      const res = await adminFetch('/api/admin/precios', { method: 'PUT', body: JSON.stringify(precios) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setPrecios(data.precios);
      setGuardados(data.precios);
      setActualizado(data.actualizado);
      setAviso(MENSAJE_PUBLICACION[data.publicacion as Publicacion] ?? MENSAJE_PUBLICACION.iniciada);
    } catch (e: any) {
      setError(e.message || 'No pude guardar los precios.');
    }
    setGuardando(false);
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[var(--line-petrol-strong)] border-t-transparent rounded-full animate-spin" role="status" aria-label="Cargando" />
      </div>
    );
  }

  if (!precios || !guardados) {
    return (
      <div role="alert" className="p-3 bg-[var(--petrol-deep)] border border-[#FFB4A8] text-[#FFB4A8] text-sm">
        {error || 'No pude cargar los precios.'}
      </div>
    );
  }

  const ia = precios.extraIa;
  const iaAntes = guardados.extraIa;

  return (
    <div className="space-y-10 pb-28">
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-[var(--ice)]">Precios de la web</h1>
        <p className="text-sm text-[var(--on-petrol-dim)] max-w-2xl">
          Estos importes son los de las cards de Precios. También se usan en las preguntas frecuentes, en los mensajes de WhatsApp de cada plan y en lo que lee Google. Los textos de cada plan se cambian en el código.
        </p>
        <p className="text-xs text-[var(--on-petrol-soft)]">
          {actualizado
            ? `Última actualización: ${new Date(actualizado).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}`
            : 'Todavía no guardaste precios desde el panel: la web usa los valores del código.'}
        </p>
      </div>

      {!publicacionAutomatica && (
        <div className="p-3 bg-[var(--petrol-deep)] border border-[#F5C76B] text-[#F5C76B] text-sm">
          Falta configurar <code>VERCEL_DEPLOY_HOOK_URL</code> en Vercel. Podés guardar igual, pero la web no se va a republicar sola: los precios nuevos aparecen en el próximo deploy.
        </div>
      )}

      {error && (
        <div role="alert" className="p-3 bg-[var(--petrol-deep)] border border-[#FFB4A8] text-[#FFB4A8] text-sm">{error}</div>
      )}

      <Seccion titulo="Páginas web" detalle="Alta + abono mensual es lo que se publica. El pago único no aparece en la web: queda como referencia para cotizar por privado.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLANES_WEB.map((plan) => {
            const p = precios.planes[plan.id];
            const antes = guardados.planes[plan.id];
            return (
              <article key={plan.id} className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-4 space-y-4">
                <header className="flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[var(--ice)]">{plan.nombre}</h3>
                    {plan.sub && <p className="text-xs text-[var(--on-petrol-soft)]">{plan.sub}</p>}
                  </div>
                  {plan.destacado && <span className="text-[10px] uppercase tracking-wider bg-[var(--lime)] text-[var(--petrol)] px-2 py-0.5">Recomendado</span>}
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CampoImporte id={`${plan.id}-alta`} label="Alta (para empezar)" value={p.alta} antes={antes.alta} onChange={(n) => cambiarPlan(plan.id, 'alta', n)} />
                  <CampoImporte id={`${plan.id}-mensual`} label="Abono mensual" value={p.mensual} antes={antes.mensual} onChange={(n) => cambiarPlan(plan.id, 'mensual', n)} sufijo="/mes" />
                  <CampoMeses id={`${plan.id}-meses`} label="Permanencia mínima" value={p.permanenciaMeses} antes={antes.permanenciaMeses} onChange={(n) => cambiarPlan(plan.id, 'permanenciaMeses', n)} />
                </div>
                <p className="text-xs text-[var(--on-petrol-dim)] border-t border-[var(--line-petrol)] pt-3">
                  En la web: <span className="text-[var(--ice)]">{formatARS(p.alta)}</span> para empezar · después <span className="text-[var(--ice)]">{formatARS(p.mensual)}/mes</span> · mínimo {p.permanenciaMeses} meses
                </p>
                <div className="space-y-2 border-t border-[var(--line-petrol)] pt-3">
                  <Privado>Sólo por privado</Privado>
                  <CampoImporte id={`${plan.id}-unico`} label="Pago único (50/50)" value={p.unico} antes={antes.unico} onChange={(n) => cambiarPlan(plan.id, 'unico', n)} />
                </div>
              </article>
            );
          })}
        </div>
      </Seccion>

      <Seccion titulo={EXTRA_IA.nombre} detalle="Extra para cualquier web. En la tienda ya viene incluido en el abono.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-4 space-y-3">
            <Privado>Con abono · se publica</Privado>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CampoImporte id="ia-alta" label="Alta" value={ia.alta} antes={iaAntes.alta} onChange={(n) => cambiarIa('alta', n)} />
              <CampoImporte id="ia-mensual" label="Mensual" value={ia.mensual} antes={iaAntes.mensual} onChange={(n) => cambiarIa('mensual', n)} sufijo="/mes" />
            </div>
          </div>
          <div className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-4 space-y-3">
            <Privado>Con pago único · sólo por privado</Privado>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CampoImporte id="ia-instalacion" label="Instalación" value={ia.instalacionUnico} antes={iaAntes.instalacionUnico} onChange={(n) => cambiarIa('instalacionUnico', n)} />
              <CampoImporte id="ia-uso" label="Uso mensual" value={ia.mensualUnico} antes={iaAntes.mensualUnico} onChange={(n) => cambiarIa('mensualUnico', n)} sufijo="/mes" />
            </div>
          </div>
        </div>
      </Seccion>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-4">
        <Seccion titulo={SOFTWARE.nombre} detalle="Se muestra como «Proyectos desde…».">
          <div className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-4">
            <CampoImporte id="software-desde" label="Proyectos desde" value={precios.softwareDesde} antes={guardados.softwareDesde} onChange={(n) => cambiar('softwareDesde', n)} />
          </div>
        </Seccion>
        <Seccion titulo="Mantenimiento" detalle="Para clientes con pago único. No se publica.">
          <div className="bg-[var(--petrol-deep)] border border-[var(--line-petrol)] p-4">
            <CampoImporte id="mantenimiento" label="Mantenimiento mensual" value={precios.mantenimientoMensual} antes={guardados.mantenimientoMensual} onChange={(n) => cambiar('mantenimientoMensual', n)} sufijo="/mes" />
          </div>
        </Seccion>
      </div>

      <div>
        <button
          type="button"
          disabled={esCodigo}
          onClick={() => { setAviso(''); setPrecios(PRECIOS_CODIGO); }}
          className="btn btn-ghost inline-flex items-center gap-2 text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Volver a los valores del código
        </button>
      </div>

      {(hayCambios || aviso) && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line-petrol-strong)] bg-[var(--petrol-deep)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <p className="text-sm text-[var(--on-petrol-dim)]" role="status">
              {hayCambios ? 'Tenés cambios sin guardar. Al guardar se publican en la web.' : aviso}
            </p>
            {hayCambios && (
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => setPrecios(guardados)} disabled={guardando} className="btn btn-ghost text-sm">
                  Descartar
                </button>
                <button
                  type="button"
                  onClick={guardar}
                  disabled={guardando || Object.values(precios.planes).some((p) => p.permanenciaMeses < 1)}
                  className="btn btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  {guardando ? 'Guardando…' : 'Guardar y publicar'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
