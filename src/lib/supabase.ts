import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
export type { Client, ClientBrandInfo, UploadedFile } from '../types/admin';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Node 20 (Vercel) no tiene WebSocket nativo y supabase-js inicializa
// el cliente realtime al crear el client. Polyfill solo en SSR para
// evitar crashes; en browser ya existe globalThis.WebSocket.
let wsTransport: unknown = undefined;
if (import.meta.env.SSR) {
  const ws = await import('ws');
  // @ts-expect-error - tipos de ws no matchean exactamente la interface esperada
  wsTransport = ws.WebSocket || ws.default;
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  // @ts-expect-error - transport está permitido en runtime aunque tipos sean estrictos
  realtime: wsTransport ? { transport: wsTransport } : undefined,
});

export let activeAccessCode = '';

export const setClientCodeHeader = (code: string) => {
  if (!supabase) return;
  const cleanedCode = code.trim().toUpperCase();
  activeAccessCode = cleanedCode;
  
  if (cleanedCode) {
    // @ts-expect-error - rest property is protected in SupabaseClient
    if (supabase.rest) {
      if (typeof supabase.rest.headers.set === 'function') {
        supabase.rest.headers.set('x-client-code', cleanedCode);
      } else {
        // @ts-ignore
        supabase.rest.headers['x-client-code'] = cleanedCode;
      }
    }
    // @ts-expect-error - storage property is protected in SupabaseClient
    if (supabase.storage) {
      if (supabase.storage.headers) {
        if (typeof supabase.storage.headers.set === 'function') {
          // @ts-ignore
          supabase.storage.headers.set('x-client-code', cleanedCode);
        } else {
          // @ts-ignore
          supabase.storage.headers['x-client-code'] = cleanedCode;
        }
      }
    }
  } else {
    // @ts-expect-error - rest property is protected in SupabaseClient
    if (supabase.rest) {
      if (typeof supabase.rest.headers.delete === 'function') {
        supabase.rest.headers.delete('x-client-code');
      } else {
        // @ts-ignore
        delete supabase.rest.headers['x-client-code'];
      }
    }
    // @ts-expect-error - storage property is protected in SupabaseClient
    if (supabase.storage) {
      if (supabase.storage.headers) {
        if (typeof supabase.storage.headers.delete === 'function') {
          // @ts-ignore
          supabase.storage.headers.delete('x-client-code');
        } else {
          // @ts-ignore
          delete supabase.storage.headers['x-client-code'];
        }
      }
    }
  }
};

export const supabaseDb = {
  // --- Clients ---
  async getClientByCode(accessCode: string): Promise<Client | null> {
    const code = accessCode.trim().toUpperCase();
    setClientCodeHeader(code);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('access_code', code)
      .maybeSingle();

    if (error) throw error;
    return data as unknown as Client;
  },

  async updateClientStatus(clientId: string, status: Client['status']): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .update({ status })
      .eq('id', clientId);

    if (error) throw error;
  },

  // --- Business / Brand Info ---
  async getClientBrandInfo(clientId: string): Promise<ClientBrandInfo | null> {
    const { data, error } = await supabase
      .from('client_brand_info')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();

    if (error) throw error;
    return data as unknown as ClientBrandInfo;
  },

  async saveClientBrandInfo(
    clientId: string, 
    info: Omit<ClientBrandInfo, 'id' | 'client_id' | 'updated_at'>
  ): Promise<ClientBrandInfo> {
    const existing = await this.getClientBrandInfo(clientId);
    
    if (existing) {
      const { data, error } = await supabase
        .from('client_brand_info')
        .update({
          brand_name: info.brand_name,
          tagline: info.tagline || null,
          description: info.description || null,
          contact_email: info.contact_email || null,
          contact_phone: info.contact_phone || null,
          social_links: info.social_links,
          reference_sites: info.reference_sites,
          brand_colors: info.brand_colors || null,
          updated_at: new Date().toISOString()
        })
        .eq('client_id', clientId)
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as ClientBrandInfo;
    } else {
      const { data, error } = await supabase
        .from('client_brand_info')
        .insert([{
          client_id: clientId,
          brand_name: info.brand_name,
          tagline: info.tagline || null,
          description: info.description || null,
          contact_email: info.contact_email || null,
          contact_phone: info.contact_phone || null,
          social_links: info.social_links,
          reference_sites: info.reference_sites,
          brand_colors: info.brand_colors || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as ClientBrandInfo;
    }
  },

  async saveBrandColors(clientId: string, colors: string): Promise<void> {
    const existing = await this.getClientBrandInfo(clientId);
    if (existing) {
      const { error } = await supabase
        .from('client_brand_info')
        .update({ brand_colors: colors, updated_at: new Date().toISOString() })
        .eq('client_id', clientId);
      if (error) throw error;
    } else {
      const client = await this.getClientByCode(activeAccessCode);
      const { error } = await supabase
        .from('client_brand_info')
        .insert([{
          client_id: clientId,
          brand_name: client?.name || 'Mi Marca',
          brand_colors: colors
        }]);
      if (error) throw error;
    }
  },

  // --- Uploaded Files ---
  async getUploadedFiles(clientId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as UploadedFile[];
  },

  async uploadFile(
    clientId: string,
    file: File,
    category: UploadedFile['category']
  ): Promise<UploadedFile> {
    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = `${clientId}/${category}/${cleanFileName}`;

    // 1. Upload to storage bucket
    const { error: uploadError } = await supabase
      .storage
      .from('client-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('client-assets')
      .getPublicUrl(filePath);

    // 3. Save to database
    const { data, error: dbError } = await supabase
      .from('uploaded_files')
      .insert([{
        client_id: clientId,
        file_name: file.name,
        file_path: filePath,
        file_url: publicUrl,
        file_size: file.size,
        file_type: file.type,
        category
      }])
      .select()
      .single();

    if (dbError) throw dbError;
    return data as unknown as UploadedFile;
  },

  async deleteFile(fileId: string): Promise<void> {
    // 1. Get file metadata
    const { data: file, error: fetchError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Delete from storage bucket
    const { error: deleteStorageError } = await supabase
      .storage
      .from('client-assets')
      .remove([file.file_path]);

    if (deleteStorageError) throw deleteStorageError;

    // 3. Delete from database
    const { error: dbError } = await supabase
      .from('uploaded_files')
      .delete()
      .eq('id', fileId);

    if (dbError) throw dbError;
  }
};
