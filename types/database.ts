// Gerado manualmente por enquanto. Quando o schema crescer, substituir por:
// npx supabase gen types typescript --project-id <id> > types/database.ts

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3";
  };
  public: {
    Tables: {
      medicos: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          crm: string;
          crm_uf: string;
          especialidade: string | null;
          telefone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nome: string;
          crm: string;
          crm_uf: string;
          especialidade?: string | null;
          telefone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nome?: string;
          crm?: string;
          crm_uf?: string;
          especialidade?: string | null;
          telefone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      unidades: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          tipo: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nome: string;
          tipo: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nome?: string;
          tipo?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      pacientes: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          cpf: string;
          data_nascimento: string;
          sexo: string;
          telefone: string | null;
          email: string | null;
          endereco: string | null;
          cidade: string | null;
          estado: string | null;
          convenio: string | null;
          alergias: string[];
          comorbidades: string[];
          observacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nome: string;
          cpf: string;
          data_nascimento: string;
          sexo: string;
          telefone?: string | null;
          email?: string | null;
          endereco?: string | null;
          cidade?: string | null;
          estado?: string | null;
          convenio?: string | null;
          alergias?: string[];
          comorbidades?: string[];
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nome?: string;
          cpf?: string;
          data_nascimento?: string;
          sexo?: string;
          telefone?: string | null;
          email?: string | null;
          endereco?: string | null;
          cidade?: string | null;
          estado?: string | null;
          convenio?: string | null;
          alergias?: string[];
          comorbidades?: string[];
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      consultas: {
        Row: {
          id: string;
          user_id: string;
          paciente_id: string;
          unidade_id: string;
          status: string;
          motivo_consulta: string | null;
          data_hora: string;
          duracao_minutos: number | null;
          transcricao: string | null;
          soap: {
            subjetivo: string;
            objetivo: string;
            avaliacao: string;
            plano: string;
            pontosParaConfirmar?: string[];
          } | null;
          resumo: string | null;
          observacoes: string | null;
          audio_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          paciente_id: string;
          unidade_id: string;
          status?: string;
          motivo_consulta?: string | null;
          data_hora: string;
          duracao_minutos?: number | null;
          transcricao?: string | null;
          soap?: {
            subjetivo: string;
            objetivo: string;
            avaliacao: string;
            plano: string;
            pontosParaConfirmar?: string[];
          } | null;
          resumo?: string | null;
          observacoes?: string | null;
          audio_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          paciente_id?: string;
          unidade_id?: string;
          status?: string;
          motivo_consulta?: string | null;
          data_hora?: string;
          duracao_minutos?: number | null;
          transcricao?: string | null;
          soap?: {
            subjetivo: string;
            objetivo: string;
            avaliacao: string;
            plano: string;
            pontosParaConfirmar?: string[];
          } | null;
          resumo?: string | null;
          observacoes?: string | null;
          audio_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      exames: {
        Row: {
          id: string;
          user_id: string;
          paciente_id: string;
          consulta_id: string | null;
          tipo_exame: string | null;
          origem: string;
          status: string;
          arquivo_url: string;
          data_exame: string | null;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          paciente_id: string;
          consulta_id?: string | null;
          tipo_exame?: string | null;
          origem: string;
          status?: string;
          arquivo_url: string;
          data_exame?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          paciente_id?: string;
          consulta_id?: string | null;
          tipo_exame?: string | null;
          origem?: string;
          status?: string;
          arquivo_url?: string;
          data_exame?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
