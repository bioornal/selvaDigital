import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoCobro } from './cobros';
import { mensajeCobro, plantillaParaEstado, variablesCliente, telefonoWhatsApp, linkWhatsAppCliente, type ClienteMensaje } from './mensajes-cobro';
import { messageTemplates } from './templates';

const cliente: ClienteMensaje = {
  name: 'María González',
  phone: '3757 412345',
  plan_id: 'landing',
  modalidad: 'abono',
  abono_alta: 110000,
  abono_mensual: 80000,
  abono_inicio: '2026-08-15',
  permanencia_meses: 3,
  abono_ajustado_at: null,
  servicio_estado: 'activo',
  total_amount: null,
  alias: 'selva.digital',
};

test('cada estado usa su plantilla', () => {
  assert.equal(plantillaParaEstado(estadoCobro(cliente, [], '2026-09-01')), null);
  assert.equal(plantillaParaEstado(estadoCobro(cliente, [], '2026-09-14')), 'recordatorio-vencimiento');
  assert.equal(plantillaParaEstado(estadoCobro(cliente, [], '2026-09-18')), 'aviso-aguante');
  assert.equal(plantillaParaEstado(estadoCobro(cliente, [], '2026-09-30')), 'aviso-baja');
});

test('recordatorio con nombre, monto, fecha y alias', () => {
  const texto = mensajeCobro(cliente, estadoCobro(cliente, [], '2026-09-14'))!;
  assert.match(texto, /¡Hola María!/);
  assert.match(texto, /vence mañana \(15\/09\): \$80\.000/);
  assert.match(texto, /selva\.digital/);
});

test('aviso de aguante con fecha límite', () => {
  const texto = mensajeCobro(cliente, estadoCobro(cliente, [], '2026-09-18'))!;
  assert.match(texto, /venció el 15\/09/);
  assert.match(texto, /hasta el 25\/09/);
  assert.doesNotMatch(texto, /meses\)/);
});

test('aviso de baja con meses adeudados y link a condiciones', () => {
  const texto = mensajeCobro(cliente, estadoCobro(cliente, [], '2026-10-20'))!;
  assert.match(texto, /\$160\.000 \(2 meses\)/);
  assert.match(texto, /pasaron los 10 días/);
  assert.match(texto, /https:\/\/selva-digital\.vercel\.app\/condiciones/);
});

test('variables de cierre', () => {
  const v = variablesCliente(cliente);
  assert.equal(v.PLAN, 'Landing Page');
  assert.equal(v.ALTA, '$110.000');
  assert.equal(v.DIA_VENCIMIENTO, 'el 15 de cada mes');
  assert.equal(variablesCliente({ ...cliente, abono_inicio: '2026-01-31' }).DIA_VENCIMIENTO,
    'el 31 de cada mes (o el último día, en los meses más cortos)');
  const unico = variablesCliente({ ...cliente, modalidad: 'unico', total_amount: 450001 });
  assert.equal(unico.ANTICIPO, '$225.001');
  assert.equal(unico.SALDO, '$225.000');
});

test('ninguna plantilla queda con variables sin declarar', () => {
  for (const t of messageTemplates) {
    const usadas = [...t.content.matchAll(/\{([A-Z_Ñ]+)\}/g)].map((m) => m[1]);
    for (const u of usadas) assert.ok(t.variables.includes(u), `${t.id} usa {${u}} sin declararla`);
  }
});

test('teléfonos argentinos para wa.me', () => {
  assert.equal(telefonoWhatsApp('3757 412345'), '5493757412345');
  assert.equal(telefonoWhatsApp('03757-412345'), '5493757412345');
  assert.equal(telefonoWhatsApp('+54 9 3757 412345'), '5493757412345');
  assert.equal(telefonoWhatsApp('54 3757 412345'), '5493757412345');
  assert.match(linkWhatsAppCliente('3757412345', 'hola qué tal'), /^https:\/\/wa\.me\/5493757412345\?text=hola%20qu%C3%A9%20tal$/);
});
