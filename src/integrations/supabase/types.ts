export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      arxiv_taxonomy: {
        Row: {
          category_code: string
          category_name: string
          created_at: string | null
          id: number
          parent_category: string | null
        }
        Insert: {
          category_code: string
          category_name: string
          created_at?: string | null
          id?: number
          parent_category?: string | null
        }
        Update: {
          category_code?: string
          category_name?: string
          created_at?: string | null
          id?: number
          parent_category?: string | null
        }
        Relationships: []
      }
      mind_blows: {
        Row: {
          count: number
          created_at: string
          id: string
          paper_doi: string
          updated_at: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          paper_doi: string
          updated_at?: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          paper_doi?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mind_blows_paper_doi_fkey"
            columns: ["paper_doi"]
            isOneToOne: true
            referencedRelation: "n8n_table"
            referencedColumns: ["doi"]
          },
        ]
      }
      n8n_table: {
        Row: {
          abstract_org: string | null
          ai_headline: string | null
          ai_image_prompt: string | null
          ai_key_takeaways: Json | null
          ai_summary_done: boolean | null
          category: Json | null
          created_at: string | null
          creator: Json | null
          doi: string
          html_available: boolean | null
          html_url: string | null
          image_url: string | null
          rerun: boolean | null
          score: number | null
          title_org: string
        }
        Insert: {
          abstract_org?: string | null
          ai_headline?: string | null
          ai_image_prompt?: string | null
          ai_key_takeaways?: Json | null
          ai_summary_done?: boolean | null
          category?: Json | null
          created_at?: string | null
          creator?: Json | null
          doi: string
          html_available?: boolean | null
          html_url?: string | null
          image_url?: string | null
          rerun?: boolean | null
          score?: number | null
          title_org: string
        }
        Update: {
          abstract_org?: string | null
          ai_headline?: string | null
          ai_image_prompt?: string | null
          ai_key_takeaways?: Json | null
          ai_summary_done?: boolean | null
          category?: Json | null
          created_at?: string | null
          creator?: Json | null
          doi?: string
          html_available?: boolean | null
          html_url?: string | null
          image_url?: string | null
          rerun?: boolean | null
          score?: number | null
          title_org?: string
        }
        Relationships: []
      }
      user_mind_blows: {
        Row: {
          created_at: string
          id: string
          paper_doi: string
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paper_doi: string
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          paper_doi?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mind_blows_paper_doi_fkey"
            columns: ["paper_doi"]
            isOneToOne: false
            referencedRelation: "n8n_table"
            referencedColumns: ["doi"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_mind_blow: {
        Args: {
          p_paper_doi: string
          p_user_id: string
          p_reason?: string
        }
        Returns: boolean
      }
      get_all_mind_blows: {
        Args: Record<PropertyKey, never>
        Returns: {
          paper_doi: string
          count: number
        }[]
      }
      get_top_mind_blown_papers: {
        Args: {
          p_limit?: number
        }
        Returns: {
          paper_doi: string
          count: number
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      remove_mind_blow: {
        Args: {
          p_paper_doi: string
          p_user_id: string
        }
        Returns: boolean
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
