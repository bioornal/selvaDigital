export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          project_name: string | null;
          project_type: string;
          status: string;
          total_amount: number | null;
          deposit_amount: number | null;
          design_amount: number | null;
          final_amount: number | null;
          weeks: number | null;
          domain: string | null;
          alias: string | null;
          bank: string | null;
          cbu: string | null;
          access_code: string | null;
          created_at: string;
          updated_at: string;
          current_phase: number;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      project_phases: {
        Row: {
          id: string;
          client_id: string;
          phase_number: number;
          phase_name: string;
          status: string;
          sent_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['project_phases']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['project_phases']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          client_id: string;
          template_id: string;
          content: string;
          variables: Record<string, string>;
          sent_at: string | null;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      client_brand_info: {
        Row: {
          id: string;
          client_id: string;
          brand_name: string;
          tagline: string | null;
          brand_colors: string | null;
          description: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          social_links: {
            instagram?: string;
            facebook?: string;
            linkedin?: string;
            twitter?: string;
          };
          reference_sites: string[];
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['client_brand_info']['Row'], 'id' | 'updated_at'> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['client_brand_info']['Insert']>;
      };
      uploaded_files: {
        Row: {
          id: string;
          client_id: string;
          file_name: string;
          file_path: string;
          file_url: string;
          file_size: number;
          file_type: string;
          category: 'logo' | 'hero_banner' | 'product_gallery' | 'general_asset';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['uploaded_files']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['uploaded_files']['Insert']>;
      };
    };
  };
}
