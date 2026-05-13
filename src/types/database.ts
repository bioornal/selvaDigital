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
    };
  };
}
