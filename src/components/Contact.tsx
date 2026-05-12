import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { sendAnalyticsEvent } from '../utils/analytics';
import { CONTACT_PHONE, CONTACT_EMAIL } from '../lib/constants';

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: CONTACT_EMAIL,
    link: `mailto:${CONTACT_EMAIL}`
  },
  {
    icon: Phone,
    title: "Teléfono",
    value: CONTACT_PHONE,
    link: "tel:+5493548550334"
  },
  {
    icon: MapPin,
    title: "Ubicación",
    value: "Córdoba, Argentina",
    link: "https://maps.google.com"
  }
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

const validationSchema = Yup.object({
  nombre: Yup.string()
    .matches(
      /^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/,
      'Por favor ingresá nombre y apellido'
    )
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(100, 'El nombre no debe exceder los 100 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string()
    .email('Por favor ingresá un email válido')
    .required('El email es requerido'),
  tipoProyecto: Yup.string()
    .required('Seleccioná un tipo de proyecto'),
  mensaje: Yup.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no debe exceder los 500 caracteres')
    .required('El mensaje es requerido')
});

interface FormValues {
  nombre: string;
  email: string;
  tipoProyecto: string;
  mensaje: string;
}

const Contact = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');

  const initialValues: FormValues = {
    nombre: '',
    email: '',
    tipoProyecto: '',
    mensaje: ''
  };

  const handleSubmit = async (values: FormValues, { resetForm, setSubmitting }: any) => {
    setFormStatus('idle');
    setFormMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    } catch (error) {
      sendAnalyticsEvent('form_error', 'Contact', 'Contact Form Error');
      setFormMessage(error instanceof Error ? error.message : 'Hubo un error al enviar el mensaje. Intentá de nuevo o contactanos directamente.');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-16 sm:py-32 bg-black relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
      </div>

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-14">
          <h2 className="text-3xl sm:text-5xl font-heading text-white mb-3 sm:mb-6">
            Contactanos
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto">
            Respondemos en menos de 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 max-w-6xl mx-auto">
          {/* Contact Info — HUD */}
          <div className="hud-container p-6 sm:p-8">
            <h3 className="text-xs font-mono text-violet-400 uppercase tracking-[0.2em] mb-6">System_Contact // Endpoints</h3>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <a 
                  key={index}
                  href={item.link}
                  className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all duration-300 group"
                >
                  <div className="p-3 bg-violet-500/10 border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                    <item.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-violet-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-mono">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form — HUD */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, isValid, dirty }) => (
              <Form className="hud-container p-6 sm:p-8 space-y-5">
                <h3 className="text-xs font-mono text-violet-400 uppercase tracking-[0.2em] mb-2">Submit_Request // Form</h3>

                {formStatus === 'success' && (
                  <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{formMessage}</span>
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{formMessage}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="nombre" className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                    Nombre Completo *
                  </label>
                  <Field
                    name="nombre"
                    type="text"
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.nombre && touched.nombre && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.nombre}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                    Email *
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    placeholder="tu@email.com"
                  />
                  {errors.email && touched.email && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.email}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="tipoProyecto" className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                    Tipo de proyecto *
                  </label>
                  <Field
                    as="select"
                    name="tipoProyecto"
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                  >
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value} className="bg-black text-white">{type.label}</option>
                    ))}
                  </Field>
                  {errors.tipoProyecto && touched.tipoProyecto && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.tipoProyecto}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                    Mensaje *
                  </label>
                  <Field
                    as="textarea"
                    name="mensaje"
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    placeholder="Contanos sobre tu proyecto, objetivos y cualquier duda que tengas."
                  />
                  {errors.mensaje && touched.mensaje && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.mensaje}</span>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || !(isValid && dirty)}
                  className="w-full bg-violet-600 text-white font-semibold py-3 px-6 rounded-none hover:bg-violet-500 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                </button>

                <p className="text-[10px] text-gray-600 text-center font-mono uppercase tracking-wider">
                  Al enviar, aceptás que te contactemos por email o a través de nuestros canales de atención.
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
