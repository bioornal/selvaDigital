import { Mail, Phone, MapPin } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "selvadigitaliguazu@gmail.com",
    link: "mailto:selvadigitaliguazu@gmail.com"
  },
  {
    icon: Phone,
    title: "Teléfono",
    value: "+54 9 3757 210123",
    link: "tel:+5493757210123"
  },
  {
    icon: MapPin,
    title: "Ubicación",
    value: "Puerto Iguazú, Misiones",
    link: "https://maps.google.com"
  }
];

// Schema de validación con Yup
const validationSchema = Yup.object({
  nombre: Yup.string()
    .matches(
      /^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/,
      'Por favor ingresa nombre y apellido'
    )
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(100, 'El nombre no debe exceder los 100 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string()
    .email('Por favor ingresa un email válido')
    .required('El email es requerido'),
  mensaje: Yup.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no debe exceder los 500 caracteres')
    .required('El mensaje es requerido')
});

interface FormValues {
  nombre: string;
  email: string;
  mensaje: string;
}

const Contact = () => {
  const initialValues: FormValues = {
    nombre: '',
    email: '',
    mensaje: ''
  };

  const handleSubmit = async (values: FormValues, { resetForm, setSubmitting }: any) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al enviar el mensaje');
      }

      alert('Mensaje enviado con éxito');
      resetForm();
    } catch (error) {
      console.error('Error en el envío:', error);
      alert(error instanceof Error ? error.message : 'Error al enviar el mensaje');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative">
      <div className="absolute inset-0">
        <div className="h-full w-full">
          <div className="h-1/2 bg-black"></div>
          <div className="h-1/2 bg-gray-100"></div>
        </div>
      </div>

      <div className="relative py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Contactanos
            </h2>
            <p className="text-gray-300 text-lg font-geist">
              Estamos listos para hacer realidad tu próximo proyecto
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Información de contacto */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg h-full">
              {contactInfo.map((item, index) => (
                <a 
                  key={index}
                  href={item.link}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300 group"
                >
                  <div className="p-3 rounded-lg bg-azure-radiance-500/10 group-hover:bg-azure-radiance-500/20 transition-colors duration-300">
                    <item.icon className="w-6 h-6 text-azure-radiance-500" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold group-hover:text-azure-radiance-500 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Formulario */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, isValid, dirty }) => (
                <Form className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg space-y-6 h-full">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <Field
                      name="nombre"
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-azure-radiance-400 focus:ring-1 focus:ring-azure-radiance-400 transition-colors duration-300"
                      placeholder="Ej: Juan Pérez"
                    />
                    {errors.nombre && touched.nombre && (
                      <span className="text-red-500 text-sm">{errors.nombre}</span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-azure-radiance-400 focus:ring-1 focus:ring-azure-radiance-400 transition-colors duration-300"
                      placeholder="tu@email.com"
                    />
                    {errors.email && touched.email && (
                      <span className="text-red-500 text-sm">{errors.email}</span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje
                    </label>
                    <Field
                      as="textarea"
                      name="mensaje"
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-azure-radiance-400 focus:ring-1 focus:ring-azure-radiance-400 transition-colors duration-300"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                    {errors.mensaje && touched.mensaje && (
                      <span className="text-red-500 text-sm">{errors.mensaje}</span>
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !(isValid && dirty)}
                    className="w-full bg-azure-radiance-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-azure-radiance-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;