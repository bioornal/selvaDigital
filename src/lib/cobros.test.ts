import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sumarMeses, vencimientos, diasEntre, hoyAR, estadoCobro, primerPeriodoImpago,
  finPermanencia, tocaAjusteIPC, etiquetaEstado, type ClienteCobro, type PagoCobro,
} from './cobros.ts';

const base: ClienteCobro = {
  modalidad: 'abono',
  abono_inicio: '2026-08-15',
  abono_mensual: 80000,
  permanencia_meses: 3,
  abono_ajustado_at: null,
  servicio_estado: 'activo',
};
const abono = (periodo: string): PagoCobro => ({ tipo: 'abono', periodo, monto: 80000 });

test('sumarMeses ajusta a fin de mes sin arrastrar', () => {
  assert.equal(sumarMeses('2026-01-31', 1), '2026-02-28');
  assert.equal(sumarMeses('2028-01-31', 1), '2028-02-29');
  assert.equal(sumarMeses('2026-01-31', 2), '2026-03-31');
  assert.equal(sumarMeses('2026-11-16', 2), '2027-01-16');
});

test('vencimientos desde el mes siguiente hasta la fecha tope', () => {
  assert.deepEqual(vencimientos('2026-01-31', '2026-05-01'), ['2026-02-28', '2026-03-31', '2026-04-30']);
  assert.deepEqual(vencimientos('2026-08-15', '2026-09-14'), []);
});

test('diasEntre y hoyAR', () => {
  assert.equal(diasEntre('2026-02-28', '2026-03-10'), 10);
  assert.equal(diasEntre('2026-03-10', '2026-02-28'), -10);
  assert.equal(hoyAR(new Date('2026-11-17T01:30:00Z')), '2026-11-16');
  assert.equal(hoyAR(new Date('2026-11-17T03:30:00Z')), '2026-11-17');
});

test('no aplica fuera del abono o dado de baja', () => {
  assert.deepEqual(estadoCobro({ ...base, modalidad: 'unico' }, [], '2026-10-01'), { tipo: 'no_aplica' });
  assert.deepEqual(estadoCobro({ ...base, servicio_estado: 'baja' }, [], '2026-10-01'), { tipo: 'no_aplica' });
  assert.deepEqual(estadoCobro({ ...base, abono_inicio: null }, [], '2026-10-01'), { tipo: 'no_aplica' });
});

test('al día y vence pronto', () => {
  assert.deepEqual(estadoCobro(base, [], '2026-09-01'), { tipo: 'al_dia', proximo: '2026-09-15', dias: 14 });
  assert.deepEqual(estadoCobro(base, [], '2026-09-13'), { tipo: 'vence_pronto', proximo: '2026-09-15', dias: 2 });
  assert.deepEqual(estadoCobro(base, [], '2026-09-15'), { tipo: 'vence_pronto', proximo: '2026-09-15', dias: 0 });
});

test('aguante del día 1 al 10 y baja desde el 11', () => {
  assert.deepEqual(estadoCobro(base, [], '2026-09-16'),
    { tipo: 'en_aguante', vencido: '2026-09-15', dia: 1, mesesAdeudados: 1, adeudado: 80000 });
  assert.deepEqual(estadoCobro(base, [], '2026-09-25'),
    { tipo: 'en_aguante', vencido: '2026-09-15', dia: 10, mesesAdeudados: 1, adeudado: 80000 });
  assert.deepEqual(estadoCobro(base, [], '2026-09-26'),
    { tipo: 'para_baja', vencido: '2026-09-15', diasAtraso: 11, mesesAdeudados: 1, adeudado: 80000 });
  assert.deepEqual(estadoCobro(base, [], '2026-10-20'),
    { tipo: 'para_baja', vencido: '2026-09-15', diasAtraso: 35, mesesAdeudados: 2, adeudado: 160000 });
});

test('pagos adelantados y pagos que no son abono', () => {
  assert.deepEqual(estadoCobro(base, [abono('2026-09-15'), abono('2026-10-15')], '2026-09-20'),
    { tipo: 'al_dia', proximo: '2026-11-15', dias: 56 });
  const alta: PagoCobro = { tipo: 'alta', periodo: '2026-09-15', monto: 110000 };
  assert.equal(estadoCobro(base, [alta], '2026-09-16').tipo, 'en_aguante');
});

test('primer período impago', () => {
  assert.equal(primerPeriodoImpago(base, [abono('2026-09-15')]), '2026-10-15');
  assert.equal(primerPeriodoImpago(base, []), '2026-09-15');
  assert.equal(primerPeriodoImpago({ ...base, abono_inicio: null }, []), null);
});

test('permanencia y ajuste por IPC', () => {
  assert.equal(finPermanencia(base), '2026-11-15');
  assert.equal(finPermanencia({ ...base, permanencia_meses: null }), null);
  assert.equal(tocaAjusteIPC(base, '2026-11-14'), false);
  assert.equal(tocaAjusteIPC(base, '2026-11-15'), true);
  assert.equal(tocaAjusteIPC({ ...base, abono_ajustado_at: '2026-11-15' }, '2026-12-01'), false);
  assert.equal(tocaAjusteIPC({ ...base, modalidad: 'unico' }, '2027-01-01'), false);
});

test('etiquetas en español', () => {
  assert.equal(etiquetaEstado({ tipo: 'en_aguante', vencido: '2026-09-15', dia: 4, mesesAdeudados: 1, adeudado: 1 }), 'En aguante · día 4 de 10');
  assert.equal(etiquetaEstado({ tipo: 'vence_pronto', proximo: 'x', dias: 0 }), 'Vence hoy');
  assert.equal(etiquetaEstado({ tipo: 'vence_pronto', proximo: 'x', dias: 1 }), 'Vence mañana');
  assert.equal(etiquetaEstado({ tipo: 'vence_pronto', proximo: 'x', dias: 2 }), 'Vence en 2 días');
  assert.equal(etiquetaEstado({ tipo: 'para_baja', vencido: 'x', diasAtraso: 11, mesesAdeudados: 1, adeudado: 1 }), 'Para dar de baja');
  assert.equal(etiquetaEstado({ tipo: 'al_dia', proximo: 'x', dias: 9 }), 'Al día');
  assert.equal(etiquetaEstado({ tipo: 'no_aplica' }), '—');
});
