import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { sendAnalyticsEvent } from '../utils/analytics';
import { CONTACT_PHONE, CONTACT_EMAIL, WHATSAPP_URL } from '../lib/constants';

const accent = '#2BB673';
const surface = '#121316';
const surface2 = '#1A1C20';
const white = '#FAFAFA';
const textSoft = 'rgba(250,250,250,0.72)';
const textDim = 'rgba(250,250,250,0.46)';
const textFaint = 'rgba(250,250,250,0.28)';
const line = 'rgba(250,250,250,0.08)';
const lineStr = 'rgba(250,250,250,0.18)';

const endpoints = [
  { icon: '✉', label: 'Email',    value: CONTACT_EMAIL },
  { icon: '☎', label: 'Teléfono', value: CONTACT_PHONE },
  { icon: '⌖', label: 'Ubicación',value: 'Córdoba, Argentina · UTC−3' },
  { icon: '⏱', label: 'Respuesta',value: '< 24 hs en horario laboral' },
];

const projectTypes = [
  { value: '', label: 'Seleccioná un tipo de proyecto' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'sitio', label: 'Sitio Web' },
  { value: 'ecommerce', label: 'Tienda Online / E-commerce' },
  { value: 'amedida', label: 'Sitio a Medida' },
  { value: 'sistema', label: 'Sistema a Medida' },
  { value: 'chatbot', label: 'Chatbot con IA' },
  { value: 'app', label: 'App a Medida' },
  { value: 'mantenimiento', label: 'Mantenimiento de sitio existente' },
  { value: 'otro', label: 'Otro / No estoy seguro' }
];

const presupuestos = ['< $500', '$500–$1.200', '$1.200–$1.500', '+$1.500'];

const validationSchema = Yup.object({
  nombre: Yup.string()
    .matches(/^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/, 'Por favor ingresá nombre y apellido')
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(100, 'El nombre no debe exceder los 100 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string().email('Por favor ingresá un email válido').required('El email es requerido'),
  tipoProyecto: Yup.string().required('Seleccioná un tipo de proyecto'),
  mensaje: Yup.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(500, 'El mensaje no debe exceder los 500 caracteres').required('El mensaje es requerido')
});

interface FormValues {
  nombre: string;
  email: string;
  tipoProyecto: string;
  presupuesto: string;
  mensaje: string;
}

const Contact = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const [tipo, setTipo] = useState('');

  const initialValues: FormValues = { nombre: '', email: '', tipoProyecto: '', presupuesto: '', mensaje: '' };

  const handleSubmit = async (values: FormValues, { resetForm, setSubmitting }: any) => {
    setFormStatus('idle');
    setFormMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al enviar el mensaje');
      }
      sendAnalyticsEvent('form_submission', 'Contact', 'Contact Form Success');
      setFormStatus('success');
      setFormMessage('¡Mensaje enviado con éxito! Te respondemos en menos de 24 horas.');
      resetForm();
      setTipo('');
    } catch (error) {
      sendAnalyticsEvent('form_error', 'Contact', 'Contact Form Error');
      setFormMessage(error instanceof Error ? error.message : 'Hubo un error al enviar el mensaje.');
      setFormStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative" style={{ background: '#0A0B0D', padding: 'clamp(64px, 8vw, 120px) 0', borderTop: `1px solid ${line}` }}>
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2.5 mb-[18px] justify-center">
            <span className="w-3.5 h-px" style={{ background: accent }} />
            <span className="text-[11px] tracking-[2.5px] uppercase" style={{ color: accent, fontFamily: "'JetBrains Mono', monospace" }}>
              10 ─── Contacto
            </span>
          </div>
          <h2 className="section-h2 font-geist font-semibold text-white leading-[1.02] tracking-tight mb-[18px]"
            style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', letterSpacing: '-0.025em' }}>
            Hablemos del próximo<br /><span style={{ color: accent }}>proyecto.</span>
          </h2>
          <p className="section-sub text-base md:text-[17px] leading-relaxed max-w-[640px] mx-auto" style={{ color: textSoft, fontFamily: "'Inter', system-ui, sans-serif" }}>
            Respondo presupuestos en menos de 24 horas. Si tu proyecto entra en la próxima ventana, arrancamos en menos de 2 semanas.
          </p>
        </div>

        <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-6">
          {/* Left: contact info */}
          <div className="flex flex-col gap-3.5">
            <div className="p-5 md:p-6" style={{ background: surface, border: `1px solid ${line}`, borderRadius: '12px' }}>
              <div className="text-[10.5px] tracking-[2px] mb-4" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>// ENDPOINTS</div>
              {endpoints.map((r, i) => (
                <div key={i} className="flex items-center gap-3.5 py-3.5"
                  style={{ borderBottom: i < 3 ? `1px solid ${line}` : 'none' }}>
                  <span className="w-[38px] h-[38px] flex items-center justify-center text-base"
                    style={{
                      background: 'rgba(43,182,115,0.12)',
                      border: `1px solid rgba(43,182,115,0.3)`,
                      color: accent,
                      borderRadius: '9px'
                    }}>{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] tracking-[1.5px]" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>{r.label.toUpperCase()}</div>
                    <div className="text-sm font-medium text-white mt-0.5 truncate" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>{r.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3.5 p-5 md:p-6 transition-all hover:brightness-110"
              style={{ background: 'rgba(43,182,115,0.1)', border: `1px solid rgba(43,182,115,0.35)`, borderRadius: '12px' }}>
              <div>
                <div className="text-[15px] font-semibold text-white tracking-tight" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>Preferís WhatsApp?</div>
                <div className="text-[12.5px] mt-0.5" style={{ color: textSoft, fontFamily: "'Inter', system-ui, sans-serif" }}>Respondo todos los días, en general en menos de 1 hora</div>
              </div>
              <span className="px-3.5 py-2.5 text-xs font-semibold flex-shrink-0" style={{ background: accent, color: '#06140C', borderRadius: '8px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                Escribir →
              </span>
            </a>
          </div>

          {/* Right: form */}
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched, isSubmitting, isValid, dirty, setFieldValue, values }) => (
              <Form className="flex flex-col gap-4 p-6 md:p-7" style={{ background: surface, border: `1px solid ${line}`, borderRadius: '12px' }}>
                <div className="text-[10.5px] tracking-[2px] mb-0" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>// SUBMIT_REQUEST</div>

                {formStatus === 'success' && (
                  <div className="flex items-start gap-2 p-3 text-sm" style={{ background: 'rgba(43,182,115,0.1)', border: `1px solid rgba(43,182,115,0.3)`, color: accent, borderRadius: '8px' }}>
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{formMessage}</span>
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="flex items-start gap-2 p-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px' }}>
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{formMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10.5px] tracking-[1.5px] mb-2" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>NOMBRE COMPLETO *</label>
                    <Field name="nombre" type="text" placeholder="Ej: Juan Pérez"
                      className="w-full px-3.5 py-3 text-sm text-white placeholder:text-[rgba(250,250,250,0.25)] outline-none focus:border-[rgba(43,182,115,0.5)] transition-colors"
                      style={{ background: surface2, border: `1px solid ${line}`, borderRadius: '9px', fontFamily: "'Inter', system-ui, sans-serif" }} />
                    {errors.nombre && touched.nombre && <span className="text-red-400 text-xs mt-1 block">{errors.nombre}</span>}
                  </div>
                  <div>
                    <label className="block text-[10.5px] tracking-[1.5px] mb-2" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>EMAIL *</label>
                    <Field name="email" type="email" placeholder="tu@email.com"
                      className="w-full px-3.5 py-3 text-sm text-white placeholder:text-[rgba(250,250,250,0.25)] outline-none focus:border-[rgba(43,182,115,0.5)] transition-colors"
                      style={{ background: surface2, border: `1px solid ${line}`, borderRadius: '9px', fontFamily: "'Inter', system-ui, sans-serif" }} />
                    {errors.email && touched.email && <span className="text-red-400 text-xs mt-1 block">{errors.email}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] tracking-[1.5px] mb-2" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>TIPO DE PROYECTO *</label>
                  <Field as="select" name="tipoProyecto"
                    onChange={(e: any) => { setFieldValue('tipoProyecto', e.target.value); setTipo(e.target.value); }}
                    className="w-full px-3.5 py-3 text-sm text-white outline-none focus:border-[rgba(43,182,115,0.5)] transition-colors appearance-none"
                    style={{ background: surface2, border: `1px solid ${line}`, borderRadius: '9px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {projectTypes.map(t => <option key={t.value} value={t.value} style={{ background: surface2 }}>{t.label}</option>)}
                  </Field>
                  {errors.tipoProyecto && touched.tipoProyecto && <span className="text-red-400 text-xs mt-1 block">{errors.tipoProyecto}</span>}
                </div>

                <div>
                  <label className="block text-[10.5px] tracking-[1.5px] mb-2" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>PRESUPUESTO ESTIMADO (USD)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {presupuestos.map(p => {
                      const selected = values.presupuesto === p;
                      return (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setFieldValue('presupuesto', selected ? '' : p)}
                          aria-pressed={selected}
                          className="py-2.5 text-xs font-medium transition-all"
                          style={{
                            background: selected ? 'rgba(43,182,115,0.15)' : surface2,
                            color: selected ? accent : textSoft,
                            border: `1px solid ${selected ? 'rgba(43,182,115,0.55)' : line}`,
                            borderRadius: '8px',
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontWeight: selected ? 600 : 500,
                            boxShadow: selected ? '0 0 12px -2px rgba(43,182,115,0.25)' : 'none'
                          }}>
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] tracking-[1.5px] mb-2" style={{ color: textDim, fontFamily: "'JetBrains Mono', monospace" }}>MENSAJE *</label>
                  <Field as="textarea" name="mensaje" rows={4} placeholder="Contame sobre tu proyecto, objetivos y cualquier duda que tengas."
                    className="w-full px-3.5 py-3 text-sm text-white placeholder:text-[rgba(250,250,250,0.25)] outline-none focus:border-[rgba(43,182,115,0.5)] transition-colors resize-y"
                    style={{ background: surface2, border: `1px solid ${line}`, borderRadius: '9px', fontFamily: "'Inter', system-ui, sans-serif" }} />
                  {errors.mensaje && touched.mensaje && <span className="text-red-400 text-xs mt-1 block">{errors.mensaje}</span>}
                </div>

                <button type="submit" disabled={isSubmitting || !(isValid && dirty)}
                  className="w-full py-4 text-sm font-semibold flex items-center justify-center gap-2.5 transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: accent, color: '#06140C', borderRadius: '10px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  {isSubmitting ? 'Enviando...' : 'Enviar mensaje →'}
                </button>

                <p className="text-[10px] tracking-[1px] text-center" style={{ color: textFaint, fontFamily: "'JetBrains Mono', monospace" }}>
                  AL ENVIAR, ACEPTÁS QUE TE CONTACTEMOS POR EMAIL O WHATSAPP.
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default Contact;
