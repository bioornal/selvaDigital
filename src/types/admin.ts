import type { Modalidad, ServicioEstado } from '../lib/cobros';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  project_name?: string | null;
  project_type: string;
  status: 'lead' | 'propuesta' | 'seña' | 'diseño' | 'desarrollo' | 'demo' | 'deploy' | 'finalizado' | 'pausado';
  currency?: 'USD' | 'ARS' | null;
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
  modalidad: Modalidad | null;
  plan_id: string | null;
  abono_alta: number | null;
  abono_mensual: number | null;
  abono_inicio: string | null;
  permanencia_meses: number | null;
  abono_ajustado_at: string | null;
  entregado_at: string | null;
  condiciones_aceptadas_at: string | null;
  servicio_estado: ServicioEstado;
  baja_at: string | null;
}

export interface Payment {
  id: string;
  client_id: string;
  tipo: 'alta' | 'abono' | 'anticipo' | 'saldo' | 'etapa' | 'otro';
  periodo: string | null;
  monto: number;
  pagado_at: string;
  medio: 'transferencia' | 'efectivo' | 'mercadopago' | 'otro';
  nota: string | null;
  created_at: string;
}

export const TIPOS_PAGO: Record<Payment['tipo'], string> = {
  alta: 'Alta', abono: 'Abono', anticipo: 'Anticipo',
  saldo: 'Saldo', etapa: 'Etapa', otro: 'Otro',
};

export const MEDIOS_PAGO: Record<Payment['medio'], string> = {
  transferencia: 'Transferencia', efectivo: 'Efectivo',
  mercadopago: 'Mercado Pago', otro: 'Otro',
};

// Tipado de las tablas usadas por estas API, incluidas las de la migración nueva.
// Evita modificar database.ts mientras se integra el resto del panel en paralelo.
export interface AdminDatabase {
  public: {
    Tables: {
      clients: {
        Row: Client;
        Insert: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at'>;
        Update: Partial<Omit<Payment, 'id' | 'created_at'>>;
        Relationships: [];
      };
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string };
        Update: { user_id?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
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
