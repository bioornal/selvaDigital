import { useState, useEffect } from 'react';
import type { Client, ProjectPhase } from '../../types/admin';
import { statusLabels, statusColors } from '../../types/admin';
import { messageTemplates, renderTemplate } from '../../lib/templates';
import { adminFetch } from '../../lib/admin-fetch';
import { ArrowLeft, Send, MessageSquare, CheckCircle, Clock, AlertCircle, Copy, Pencil } from 'lucide-react';

interface ClientDetailProps {
  clientId: string;
}

export default function ClientDetail({ clientId }: ClientDetailProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadClient();
    loadPhases();
  }, [clientId]);

  async function loadClient() {
    try {
      const res = await adminFetch(`/api/admin/clients/${clientId}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data as Client);
      }
    } catch (e) {
      // silent
    }
  }

  async function loadPhases() {
    try {
      const res = await adminFetch(`/api/admin/clients/${clientId}/phases`);
      if (res.ok) {
        const data = await res.json();
        setPhases(data as ProjectPhase[]);
      }
    } catch (e) {
      // silent
    }
    setLoading(false);
  }

  useEffect(() => {
    if (client && selectedTemplate) {
      const template = messageTemplates.find((t) => t.id === selectedTemplate);
      if (template) {
        const vars: Record<string, string> = {};
        template.variables.forEach((v) => {
          if (v === 'NOMBRE') vars[v] = client.name;
          else if (v === 'TIPO_PROYECTO') vars[v] = client.project_type;
          else if (v === 'MONTO_TOTAL') vars[v] = client.total_amount?.toString() || '';
          else if (v === 'MONTO_SEÑA') vars[v] = client.deposit_amount?.toString() || '';
          else if (v === 'MONTO_DISENO') vars[v] = client.design_amount?.toString() || '';
          else if (v === 'MONTO_FINAL') vars[v] = client.final_amount?.toString() || '';
          else if (v === 'SEMANAS') vars[v] = client.weeks?.toString() || '';
          else vars[v] = '';
        });
        setVariables(vars);
        setPreview(renderTemplate(template, vars));
      }
    }
  }, [selectedTemplate, client]);

  function handleVariableChange(key: string, value: string) {
    const newVars = { ...variables, [key]: value };
    setVariables(newVars);
    const template = messageTemplates.find((t) => t.id === selectedTemplate);
    if (template) {
      setPreview(renderTemplate(template, newVars));
    }
  }

  async function handleSend() {
    if (!client || !selectedTemplate) return;
    setSending(true);

    try {
      const res = await adminFetch('/api/admin/send-message', {
        method: 'POST',
        body: JSON.stringify({
          client_id: client.id,
          template_id: selectedTemplate,
          variables,
        }),
      });

      if (!res.ok) throw new Error('Error guardando mensaje');

      setSelectedTemplate('');
      setPreview('');
      loadClient();
      loadPhases();
    } catch (e) {
      // silent
    }

    setSending(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openWhatsApp() {
    if (!client) return;
    const text = encodeURIComponent(preview);
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cliente no encontrado</p>
        <a href="/admin" className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block">
          ← Volver al dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <a href="/admin" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mb-2 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Volver
          </a>
          <h1 className="text-2xl font-bold text-white">{client.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium text-white ${statusColors[client.status]}`}>
              {statusLabels[client.status]}
            </span>
            <span className="text-xs text-gray-500">Fase actual: {client.current_phase}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/admin/clientes/${client.id}/editar`}
            className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-none transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </a>
          <a
            href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-none transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="bg-[#12121a] border border-gray-800 p-5 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800 pb-2">
            Información
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500 block text-xs">Teléfono</span>
              <span className="text-white font-mono">{client.phone}</span>
            </div>
            {client.email && (
              <div>
                <span className="text-gray-500 block text-xs">Email</span>
                <span className="text-white">{client.email}</span>
              </div>
            )}
            {client.project_name && (
              <div>
                <span className="text-gray-500 block text-xs">Proyecto</span>
                <span className="text-white">{client.project_name}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 block text-xs">Tipo</span>
              <span className="text-white">{client.project_type}</span>
            </div>
            {client.total_amount && (
              <div>
                <span className="text-gray-500 block text-xs">Monto total</span>
                <span className="text-white">${client.total_amount.toLocaleString('es-AR')} ARS</span>
              </div>
            )}
            {client.weeks && (
              <div>
                <span className="text-gray-500 block text-xs">Plazo</span>
                <span className="text-white">{client.weeks} semanas</span>
              </div>
            )}
          </div>
        </div>

        {/* Fases */}
        <div className="lg:col-span-2 bg-[#12121a] border border-gray-800 p-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800 pb-2 mb-4">
            Fases del proyecto
          </h3>
          <div className="space-y-3">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className={`flex items-center gap-3 p-3 border ${
                  phase.status === 'completado' || phase.status === 'enviado'
                    ? 'border-green-800/50 bg-green-900/10'
                    : phase.phase_number === client.current_phase
                    ? 'border-blue-800/50 bg-blue-900/10'
                    : 'border-gray-800'
                }`}
              >
                <div className="flex-shrink-0">
                  {phase.status === 'completado' || phase.status === 'enviado' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : phase.phase_number === client.current_phase ? (
                    <Clock className="w-5 h-5 text-blue-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">{phase.phase_number}</span>
                    <span className="text-sm font-medium text-white">{phase.phase_name}</span>
                  </div>
                  {phase.sent_at && (
                    <span className="text-xs text-gray-500">
                      Enviado: {new Date(phase.sent_at).toLocaleDateString('es-AR')}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 uppercase tracking-wider ${
                    phase.status === 'enviado'
                      ? 'text-green-400 bg-green-900/20'
                      : phase.status === 'completado'
                      ? 'text-green-400 bg-green-900/20'
                      : phase.status === 'en_progreso'
                      ? 'text-blue-400 bg-blue-900/20'
                      : 'text-gray-500 bg-gray-800'
                  }`}
                >
                  {phase.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Composer */}
      <div className="bg-[#12121a] border border-gray-800 p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800 pb-2 mb-4">
          Enviar mensaje
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                Plantilla
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-gray-700 rounded-none px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Seleccionar plantilla...</option>
                {messageTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTemplate && (
              <div className="text-xs text-gray-500 bg-[#0a0a0f] p-3 border border-gray-800">
                {messageTemplates.find((t) => t.id === selectedTemplate)?.description}
              </div>
            )}

            {selectedTemplate && Object.keys(variables).length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Variables</p>
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-500 mb-1">{key}</label>
                    <input
                      value={value}
                      onChange={(e) => handleVariableChange(key, e.target.value)}
                      className="w-full bg-[#0a0a0f] border border-gray-700 rounded-none px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Vista previa</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
              <textarea
                value={preview}
                readOnly
                rows={12}
                className="w-full bg-[#0a0a0f] border border-gray-700 rounded-none px-4 py-3 text-sm text-gray-300 font-mono leading-relaxed focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSend}
                disabled={!preview || sending}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-6 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Guardando...' : 'Guardar mensaje'}
              </button>
              <button
                onClick={openWhatsApp}
                disabled={!preview}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-6 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-4 h-4" />
                Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
