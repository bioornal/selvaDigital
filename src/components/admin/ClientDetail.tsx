import { useState, useEffect } from 'react';
import type { Client, ProjectPhase, ClientBrandInfo, UploadedFile } from '../../types/admin';
import { statusLabels, statusColors } from '../../types/admin';
import { messageTemplates, renderTemplate } from '../../lib/templates';
import { adminFetch } from '../../lib/admin-fetch';
import { 
  ArrowLeft, Send, MessageSquare, CheckCircle, Clock, AlertCircle, 
  Copy, Pencil, Download, ExternalLink, FileArchive, Globe, Trash2 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import JSZip from 'jszip';

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

  // New states for client portal materials
  const [brandInfo, setBrandInfo] = useState<ClientBrandInfo | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadClient();
    loadPhases();
    loadBrandInfo();
    loadUploadedFiles();
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

  async function loadBrandInfo() {
    try {
      const { data, error } = await supabase
        .from('client_brand_info')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (!error && data) {
        setBrandInfo(data as unknown as ClientBrandInfo);
      }
    } catch (e) {
      // silent
    }
  }

  async function loadUploadedFiles() {
    try {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUploadedFiles(data as unknown as UploadedFile[]);
      }
    } catch (e) {
      // silent
    }
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
        let content = renderTemplate(template, vars);
        if (client.currency === 'ARS') {
          content = content.replace(/USD/g, 'ARS');
        }
        setPreview(content);
      }
    }
  }, [selectedTemplate, client]);

  function handleVariableChange(key: string, value: string) {
    const newVars = { ...variables, [key]: value };
    setVariables(newVars);
    const template = messageTemplates.find((t) => t.id === selectedTemplate);
    if (template) {
      let content = renderTemplate(template, newVars);
      if (client?.currency === 'ARS') {
        content = content.replace(/USD/g, 'ARS');
      }
      setPreview(content);
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

  // Helper functions for client portal materials
  async function handleGenerateAccessCode() {
    if (!client) return;
    const generated = 'SELVA-' + Math.floor(1000 + Math.random() * 9000).toString();
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({ access_code: generated })
        .eq('id', client.id)
        .select()
        .single();
      
      if (error) throw error;
      setClient(data as unknown as Client);
    } catch (e) {
      console.error(e);
      alert('Error al generar código de acceso.');
    }
  }

  function copyPortalLink() {
    if (!client?.access_code) return;
    const link = `${window.location.origin}/portal?code=${client.access_code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  async function handleDownloadSingle(file: UploadedFile) {
    try {
      const response = await fetch(file.file_url, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.file_name;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      window.open(file.file_url, '_blank', 'noopener,noreferrer');
    }
  }

  async function handleDownloadZip() {
    if (uploadedFiles.length === 0 || !client) return;
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      
      const manifest = {
        project: client.name,
        exportedAt: new Date().toISOString(),
        totalFiles: uploadedFiles.length,
        files: uploadedFiles.map((f) => ({
          name: f.file_name,
          category: f.category,
          size: f.file_size,
          type: f.file_type,
          uploadedAt: f.created_at,
          path: `${categoryFolder(f.category)}/${f.file_name}`
        }))
      };
      zip.file('manifest.json', JSON.stringify(manifest, null, 2));

      const folders: Record<string, any> = {
        logo: zip.folder('logos')!,
        hero_banner: zip.folder('hero-banners')!,
        product_gallery: zip.folder('galeria-productos')!,
        general_asset: zip.folder('otros-archivos')!
      };

      for (const file of uploadedFiles) {
        try {
          const res = await fetch(file.file_url, { mode: 'cors' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          const folder = folders[file.category] || folders.general_asset;
          folder.file(file.file_name, blob);
        } catch (e) {
          console.error(`Failed to add ${file.file_name}:`, e);
        }
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      const blobUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const safeProjectName = client.name.toLowerCase().replace(/\s+/g, '-');
      a.download = `${safeProjectName}-materiales-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Error generating ZIP:', err);
      alert('Error al generar el ZIP de descargas.');
    } finally {
      setDownloadingZip(false);
    }
  }

  function categoryFolder(cat: UploadedFile['category']): string {
    const map = {
      logo: 'logos',
      hero_banner: 'hero-banners',
      product_gallery: 'galeria-productos',
      general_asset: 'otros-archivos'
    };
    return map[cat] || 'otros';
  }

  function categoryLabel(cat: UploadedFile['category']): string {
    const map = {
      logo: 'Logotipos',
      hero_banner: 'Imagen Portada / Hero',
      product_gallery: 'Galería de Productos',
      general_asset: 'Otros Recursos / Documentos'
    };
    return map[cat] || 'Otros';
  }

  const parseColors = (inputString: string) => {
    if (!inputString) return [];
    const hexRegex = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g
    const matches = inputString.match(hexRegex);
    return matches || [];
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

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
                <span className="text-white">${client.total_amount.toLocaleString('es-AR')} {client.currency || 'USD'}</span>
              </div>
            )}
            {client.weeks && (
              <div>
                <span className="text-gray-500 block text-xs">Plazo</span>
                <span className="text-white">{client.weeks} semanas</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 block text-xs">Código de Acceso Portal</span>
              <div className="flex items-center gap-2 mt-1">
                {client.access_code ? (
                  <>
                    <span className="text-green-400 font-mono font-bold bg-green-950/20 border border-green-800/30 px-2 py-0.5 text-xs">{client.access_code}</span>
                    <button
                      onClick={copyPortalLink}
                      className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 bg-gray-800 hover:bg-gray-750 px-2 py-0.5"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedLink ? 'Copiado' : 'Link'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGenerateAccessCode}
                    className="text-xs bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/20 transition-colors px-2 py-1 uppercase tracking-wider font-semibold font-mono"
                  >
                    Generar Código
                  </button>
                )}
              </div>
            </div>
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

      {/* NEW: CLIENT PORTAL MATERIALS SECTION */}
      <div className="bg-[#12121a] border border-gray-800 p-5 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Materiales del Cliente (Portal de Carga)
          </h3>
          {uploadedFiles.length > 0 && (
            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold py-1.5 px-3 uppercase tracking-wider transition-all cursor-pointer"
            >
              <FileArchive className="w-3.5 h-3.5" />
              {downloadingZip ? 'Comprimiendo...' : 'Descargar Todo (.ZIP)'}
            </button>
          )}
        </div>

        {/* Brand Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Perfil de Marca
            </h4>
            {brandInfo ? (
              <div className="bg-[#0a0a0f] border border-gray-800 p-4 space-y-3.5 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs">Nombre de Marca</span>
                  <span className="text-white font-semibold">{brandInfo.brand_name}</span>
                </div>
                {brandInfo.tagline && (
                  <div>
                    <span className="text-gray-500 block text-xs">Slogan / Frase</span>
                    <span className="text-gray-300 italic">"{brandInfo.tagline}"</span>
                  </div>
                )}
                {brandInfo.description && (
                  <div>
                    <span className="text-gray-500 block text-xs">Descripción Comercial</span>
                    <p className="text-gray-300 leading-relaxed mt-1 text-xs">{brandInfo.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {brandInfo.contact_email && (
                    <div>
                      <span className="text-gray-500 block text-xs">Email Comercial</span>
                      <span className="text-gray-300 font-mono text-xs">{brandInfo.contact_email}</span>
                    </div>
                  )}
                  {brandInfo.contact_phone && (
                    <div>
                      <span className="text-gray-500 block text-xs">Teléfono Comercial</span>
                      <span className="text-gray-300 font-mono text-xs">{brandInfo.contact_phone}</span>
                    </div>
                  )}
                </div>
                {brandInfo.brand_colors && (
                  <div>
                    <span className="text-gray-500 block text-xs mb-1.5">Colores Especificados</span>
                    <p className="text-gray-300 text-xs mb-2">{brandInfo.brand_colors}</p>
                    <div className="flex flex-wrap gap-2">
                      {parseColors(brandInfo.brand_colors).map((color, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2 py-0.5 bg-[#12121a] border border-gray-800 rounded-full text-[10px]">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-700"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-mono text-gray-300">{color.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0a0a0f] border border-gray-800 p-6 text-center text-xs text-gray-500">
                El cliente aún no ha completado sus datos comerciales en el portal.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Sitios de Referencia y Redes
            </h4>
            <div className="bg-[#0a0a0f] border border-gray-800 p-4 space-y-4 text-sm min-h-[150px]">
              {brandInfo ? (
                <>
                  <div>
                    <span className="text-gray-500 block text-xs mb-1.5">Redes Sociales</span>
                    {Object.values(brandInfo.social_links).some(link => link) ? (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(brandInfo.social_links).map(([platform, link]) => link ? (
                          <a
                            key={platform}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1 capitalize"
                          >
                            <Globe className="w-3 h-3 shrink-0" />
                            {platform}
                          </a>
                        ) : null)}
                      </div>
                    ) : (
                      <span className="text-gray-600 italic text-xs">Sin enlaces cargados</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs mb-1.5">Sitios Web de Referencia</span>
                    {brandInfo.reference_sites.length > 0 ? (
                      <div className="space-y-1.5">
                        {brandInfo.reference_sites.map((site, idx) => (
                          <a
                            key={idx}
                            href={site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1.5 text-xs truncate"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0 text-gray-500" />
                            {site}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-600 italic text-xs">Sin referencias de sitios</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-xs text-gray-500">
                  Sin redes ni referencias.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Uploaded Files Section */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Archivos Subidos por el Cliente
          </h4>
          {uploadedFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['logo', 'hero_banner', 'product_gallery', 'general_asset'].map((cat) => {
                const catFiles = uploadedFiles.filter(f => f.category === cat);
                if (catFiles.length === 0) return null;
                return (
                  <div key={cat} className="bg-[#0a0a0f] border border-gray-800 p-4 space-y-3">
                    <h5 className="text-xs font-semibold text-blue-400 uppercase tracking-wider border-b border-gray-900 pb-1.5">
                      {categoryLabel(cat as UploadedFile['category'])} ({catFiles.length})
                    </h5>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {catFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between gap-3 p-2 bg-[#12121a] border border-gray-800/80 text-xs">
                          {file.file_type.startsWith('image/') ? (
                            <div className="w-8 h-8 bg-slate-900 border border-gray-800 overflow-hidden shrink-0">
                              <img src={file.file_url} alt={file.file_name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-[#0a0a0f] border border-gray-800 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-blue-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-300 font-semibold truncate leading-tight" title={file.file_name}>
                              {file.file_name}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{formatBytes(file.file_size)}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={file.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800"
                              title="Ver en pestaña nueva"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDownloadSingle(file)}
                              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
                              title="Descargar archivo"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#0a0a0f] border border-gray-800 p-6 text-center text-xs text-gray-500">
              El cliente aún no ha subido archivos.
            </div>
          )}
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
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-6 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Guardando...' : 'Guardar mensaje'}
              </button>
              <button
                onClick={openWhatsApp}
                disabled={!preview}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-6 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
