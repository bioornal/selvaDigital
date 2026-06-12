export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  project_name?: string | null;
  project_type: string;
  status: 'lead' | 'propuesta' | 'seña' | 'diseño' | 'desarrollo' | 'demo' | 'deploy' | 'finalizado' | 'pausado';
  total_amount?: number | null;
  deposit_amount?: number | null;
  design_amount?: number | null;
  final_amount?: number | null;
  weeks?: number | null;
  domain?: string | null;
  alias?: string | null;
  bank?: string | null;
  cbu?: string | null;
  access_code?: string | null;
  created_at: string;
  updated_at: string;
  current_phase: number;
}

export interface ProjectPhase {
  id: string;
  client_id: string;
  phase_number: number;
  phase_name: string;
  status: 'pendiente' | 'en_progreso' | 'completado' | 'enviado';
  sent_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  client_id: string;
  template_id: string;
  content: string;
  variables: Record<string, string>;
  sent_at?: string | null;
  status: 'borrador' | 'enviado';
  created_at: string;
}

export interface ClientBrandInfo {
  id: string;
  client_id: string;
  brand_name: string;
  tagline?: string | null;
  brand_colors?: string | null;
  description?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  social_links: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  reference_sites: string[];
  updated_at: string;
}

export interface UploadedFile {
  id: string;
  client_id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  file_type: string;
  category: 'logo' | 'hero_banner' | 'product_gallery' | 'general_asset';
  created_at: string;
}

export type ProjectStatus = Client['status'];

export const statusLabels: Record<ProjectStatus, string> = {
  lead: 'Lead',
  propuesta: 'Propuesta enviada',
  seña: 'Seña pagada',
  diseño: 'En diseño',
  desarrollo: 'En desarrollo',
  demo: 'Demo listo',
  deploy: 'Deployado',
  finalizado: 'Finalizado',
  pausado: 'Pausado',
};

export const statusColors: Record<ProjectStatus, string> = {
  lead: 'bg-gray-500',
  propuesta: 'bg-blue-500',
  seña: 'bg-yellow-500',
  diseño: 'bg-purple-500',
  desarrollo: 'bg-indigo-500',
  demo: 'bg-pink-500',
  deploy: 'bg-green-500',
  finalizado: 'bg-emerald-600',
  pausado: 'bg-orange-500',
};
