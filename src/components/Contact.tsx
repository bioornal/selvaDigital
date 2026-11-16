import { useState } from 'react';
import { CheckCircle, AlertCircle, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { sendAnalyticsEvent } from '../utils/analytics';
import { CONTACT_PHONE, CONTACT_EMAIL, whatsappLink } from '../lib/constants';
import WaIcon from './ui/WaIcon';

const needOptions = ['Sitio web', 'Tienda online', 'Asistente con IA para mi web', 'Un sistema para mi negocio', 'No estoy seguro'];
const endpoints = [
  { icon: Mail, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: Phone, label: 'Teléfono', value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s/g, '')}` },
  { icon: MapPin, label: 'Ubicación', value: 'Córdoba, Argentina · UTC−3' },
];

const projectTypes = [
  { value: '', label: 'Seleccioná un tipo de proyecto' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'sitio', label: 'Sitio Web' },
  { value: 'ecommerce', label: 'Tienda Online / E-commerce' },
  { value: 'amedida', label: 'Sitio a Medida' },
  { value: 'sistema', label: 'Sistema a Medida' },
  { value: 'chatbot', label: 'Asistente con IA para mi web' },
  { value: 'app', label: 'App a Medida' },
  { value: 'mantenimiento', label: 'Mantenimiento de sitio existente' },
  { value: 'otro', label: 'Otro / No estoy seguro' }
];

const presupuestos = ['< $400.000', '$400.000–$800.000', '$800.000–$1.500.000', '+$1.500.000'];

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
  const [needs, setNeeds] = useState<string[]>([]);

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
      setFormMessage('¡Mensaje enviado! Te voy a responder al email que dejaste.');
      resetForm();

    } catch (error) {
      sendAnalyticsEvent('form_error', 'Contact', 'Contact Form Error');
      setFormMessage(error instanceof Error ? error.message : 'Hubo un error al enviar el mensaje.');
      setFormStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = needs.length
    ? `¡Hola Christian! Necesito: ${needs.join(', ')}. ¿Me pasás un presupuesto?`
    : '¡Hola Christian! Quiero consultarte por un proyecto. ¿Me pasás un presupuesto?';

  return (
    <section id="contacto" className="section on-deep contact-section" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div className="contact-primary">
          <h2 id="contact-title" className="h2">Contame qué necesitás.</h2>
          <p className="lede">Elegí qué necesitás y mandame tu consulta por WhatsApp.</p>
          <fieldset className="needs-builder">
            <legend>¿Qué necesitás?</legend>
            <div className="contact-chips">
              {needOptions.map(item => (
                <button key={item} type="button" className="contact-chip" aria-pressed={needs.includes(item)}
                  onClick={() => setNeeds(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item])}>{item}</button>
              ))}
            </div>
          </fieldset>
          <a className="btn btn-primary contact-wa" href={whatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer"
            onClick={() => sendAnalyticsEvent('whatsapp_click', 'Contact', 'WhatsApp Message Builder')}>
            <WaIcon size={21} />Mandar por WhatsApp
          </a>
          <p className="contact-direct">Te respondo yo, en menos de 24 h en horario laboral.</p>
          <ul className="contact-details mono">
            {endpoints.map(({ icon: Icon, label, value, href }) => (
              <li key={label}><Icon size={16} aria-hidden="true" /><div><span className="detail-label">{label}</span>{href ? <a href={href}>{value}</a> : <span>{value}</span>}</div></li>
            ))}
          </ul>
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, touched, isSubmitting, isValid, dirty, setFieldValue, values }) => {
            const fieldA11y = (name: keyof FormValues) => ({
              'aria-invalid': Boolean(touched[name] && errors[name]),
              'aria-describedby': touched[name] && errors[name] ? `contact-${name}-error` : undefined,
            });
            const errorFor = (name: keyof FormValues) => touched[name] && errors[name]
              ? <span id={`contact-${name}-error`} className="contact-error">{errors[name]}</span> : null;
            return (
              <Form className="contact-form" noValidate aria-label="Contacto por email">
                <h3 className="mono form-heading">¿Preferís email?</h3>
                {formStatus !== 'idle' && (
                  <div className={`contact-feedback ${formStatus}`} role={formStatus === 'error' ? 'alert' : 'status'}>
                    {formStatus === 'success' ? <CheckCircle size={20} aria-hidden="true" /> : <AlertCircle size={20} aria-hidden="true" />}
                    <span>{formMessage}</span>
                  </div>
                )}
                <div className="contact-field-pair">
                  <div>
                    <label className="mono" htmlFor="contact-nombre">Nombre completo *</label>
                    <Field id="contact-nombre" name="nombre" type="text" autoComplete="name" placeholder="Ej: Juan Pérez" required className="contact-input" {...fieldA11y('nombre')} />
                    {errorFor('nombre')}
                  </div>
                  <div>
                    <label className="mono" htmlFor="contact-email">Email *</label>
                    <Field id="contact-email" name="email" type="email" autoComplete="email" placeholder="tu@email.com" required className="contact-input" {...fieldA11y('email')} />
                    {errorFor('email')}
                  </div>
                </div>
                <div>
                  <label className="mono" htmlFor="contact-tipoProyecto">Tipo de proyecto *</label>
                  <div className="contact-select">
                    <Field as="select" id="contact-tipoProyecto" name="tipoProyecto" required className="contact-input" {...fieldA11y('tipoProyecto')}>
                      {projectTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                    </Field>
                    <ChevronDown size={18} aria-hidden="true" />
                  </div>
                  {errorFor('tipoProyecto')}
                </div>
                <fieldset>
                  <legend className="mono">Presupuesto estimado (ARS)</legend>
                  <div className="contact-chips budget-chips">
                    {presupuestos.map(price => <button type="button" key={price} className="contact-chip mono" aria-pressed={values.presupuesto === price}
                      onClick={() => setFieldValue('presupuesto', values.presupuesto === price ? '' : price)}>{price}</button>)}
                  </div>
                </fieldset>
                <div>
                  <label className="mono" htmlFor="contact-mensaje">Mensaje *</label>
                  <Field as="textarea" id="contact-mensaje" name="mensaje" rows={5} required placeholder="Contame sobre tu proyecto, objetivos y cualquier duda que tengas." className="contact-input" {...fieldA11y('mensaje')} />
                  {errorFor('mensaje')}
                </div>
                <button type="submit" disabled={isSubmitting || !(isValid && dirty)} className="btn btn-ghost contact-submit" aria-busy={isSubmitting}>{isSubmitting ? 'Enviando…' : 'Enviar mensaje'}</button>
                <p className="mono contact-consent">Al enviar, aceptás que te contacte por email o WhatsApp.</p>
              </Form>
            );
          }}
        </Formik>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .contact-section .contact-grid { display: grid; gap: 56px; }
        .contact-section .contact-primary, .contact-section .contact-form { min-width: 0; }
        .contact-section h2 { margin: 0 0 24px; }
        .contact-section .lede { color: var(--on-petrol-soft); }
        .contact-section .needs-builder { margin-top: 36px; }
        .contact-section fieldset { border: 0; padding: 0; min-width: 0; }
        .contact-section legend { margin-bottom: 14px; }
        .contact-section .needs-builder legend { font-size: var(--fs-title); font-weight: 700; }
        .contact-section .contact-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .contact-section .contact-chip { border: 1px solid var(--line-petrol-strong); border-radius: 0; padding: 12px 14px; background: var(--petrol); color: var(--ice); font-size: var(--fs-small); }
        .contact-section .contact-chip:hover { border-color: var(--ice); }
        .contact-section .contact-chip[aria-pressed="true"] { background: var(--ice); color: var(--petrol); border-color: var(--ice); }
        .contact-section .contact-wa { margin-top: 24px; width: 100%; min-height: 60px; }
        .contact-section .contact-direct { display: flex; align-items: center; gap: 10px; margin: 16px 0 0; color: var(--on-petrol-soft); font-size: var(--fs-small); line-height: 1.5; }
        .contact-section .contact-details { list-style: none; margin: 36px 0 0; padding: 0; text-transform: none; letter-spacing: .02em; }
        .contact-section .contact-details li { display: flex; align-items: flex-start; gap: 14px; padding: 16px 0; border-top: 1px solid var(--line-petrol); }
        .contact-section .contact-details svg { flex-shrink: 0; margin-top: 3px; }
        .contact-section .contact-details a, .contact-section .contact-details span { overflow-wrap: anywhere; }
        .contact-section .detail-label { display: block; color: var(--on-petrol-dim); margin-bottom: 5px; text-transform: uppercase; }
        .contact-section .contact-details a:hover { text-decoration: underline; }
        .contact-section .contact-form { display: flex; flex-direction: column; gap: 24px; border-top: 1px solid var(--line-petrol-strong); padding-top: 24px; }
        .contact-section .form-heading { margin: 0; }
        .contact-section label { display: block; margin-bottom: 10px; }
        .contact-section .contact-field-pair { display: grid; gap: 20px; }
        .contact-section .contact-input { display: block; width: 100%; min-width: 0; padding: 14px; border: 1px solid var(--line-petrol-strong); border-radius: 0; background: var(--petrol); color: var(--ice); font: inherit; font-size: var(--fs-control); }
        .contact-section .contact-input::placeholder { color: var(--on-petrol-dim); opacity: 1; }
        .contact-section .contact-input:focus { border-color: var(--ice); }
        .contact-section textarea { resize: vertical; }
        .contact-section .contact-select { position: relative; }
        .contact-section select { appearance: none; padding-right: 44px; color-scheme: dark; }
        .contact-section option { background: var(--petrol); color: var(--ice); }
        .contact-section .contact-select svg { position: absolute; right: 14px; top: 18px; pointer-events: none; }
        .contact-section .budget-chips .contact-chip { font-size: var(--fs-label); padding: 12px; }
        .contact-section .contact-error { display: block; margin-top: 8px; font-size: var(--fs-small); color: #FFB4A8; }
        .contact-section .contact-feedback { display: flex; gap: 10px; padding: 16px; border: 1px solid var(--lime); color: var(--ice); }
        .contact-section .contact-feedback svg { flex-shrink: 0; margin-top: 2px; }
        .contact-section .contact-feedback.error { border-color: #FFB4A8; color: #FFB4A8; }
        .contact-section .contact-submit { width: 100%; }
        .contact-section .contact-consent { color: var(--on-petrol-dim); margin: 0; }
        @media (min-width: 640px) { .contact-section .contact-field-pair { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) {
          /* A separate lower zone keeps the sheet clear of both columns, including validation messages. */
          .contact-section { position: relative; isolation: isolate; padding-bottom: 340px; }
          .contact-section .contact-grid { grid-template-columns: 1.1fr 1fr; gap: clamp(48px, 7vw, 100px); }
          .contact-section .contact-form { border-top: 0; border-left: 1px solid var(--line-petrol-strong); padding-top: 0; padding-left: 40px; }
          .contact-section h2 { font-size: var(--fs-h2-compact); }
        }
      ` }} />
    </section>
  );
};
export default Contact;
