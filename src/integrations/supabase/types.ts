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
      core_paper: {
        Row: {
          abstract_org: string | null
          ai_headline: string | null
          ai_image_prompt: string | null
          ai_key_takeaways: Json | null
          ai_summary_done: boolean | null
          category: Json | null
          created_at: string | null
          creator: Json | null
          html_available: boolean | null
          html_url: string | null
          id: string
          image_url: string | null
          oai: string | null
          rerun: boolean
          score: number | null
          title_org: string
          too_long: boolean
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
          html_available?: boolean | null
          html_url?: string | null
          id: string
          image_url?: string | null
          oai?: string | null
          rerun?: boolean
          score?: number | null
          title_org: string
          too_long?: boolean
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
          html_available?: boolean | null
          html_url?: string | null
          id?: string
          image_url?: string | null
          oai?: string | null
          rerun?: boolean
          score?: number | null
          title_org?: string
          too_long?: boolean
        }
        Relationships: []
      }
      europe_paper: {
        Row: {
          abstract_org: string | null
          ai_headline: string | null
          ai_image_prompt: string | null
          ai_key_takeaways: Json | null
          ai_matter: string | null
          ai_search_queries: string | null
          ai_summary_done: boolean | null
          category: Json | null
          claude_refined: boolean
          created_at: string | null
          creator: Json | null
          doi: string | null
          feed_worthy: boolean
          feed_worthy_reason: string | null
          full_text_sections: Json[] | null
          html_url: string | null
          id: number
          image_url: string | null
          is_open_access: boolean | null
          oai: string | null
          rerun: boolean
          score: number | null
          score_raw: string | null
          title_org: string | null
          too_long: boolean
        }
        Insert: {
          abstract_org?: string | null
          ai_headline?: string | null
          ai_image_prompt?: string | null
          ai_key_takeaways?: Json | null
          ai_matter?: string | null
          ai_search_queries?: string | null
          ai_summary_done?: boolean | null
          category?: Json | null
          claude_refined?: boolean
          created_at?: string | null
          creator?: Json | null
          doi?: string | null
          feed_worthy?: boolean
          feed_worthy_reason?: string | null
          full_text_sections?: Json[] | null
          html_url?: string | null
          id?: number
          image_url?: string | null
          is_open_access?: boolean | null
          oai?: string | null
          rerun?: boolean
          score?: number | null
          score_raw?: string | null
          title_org?: string | null
          too_long?: boolean
        }
        Update: {
          abstract_org?: string | null
          ai_headline?: string | null
          ai_image_prompt?: string | null
          ai_key_takeaways?: Json | null
          ai_matter?: string | null
          ai_search_queries?: string | null
          ai_summary_done?: boolean | null
          category?: Json | null
          claude_refined?: boolean
          created_at?: string | null
          creator?: Json | null
          doi?: string | null
          feed_worthy?: boolean
          feed_worthy_reason?: string | null
          full_text_sections?: Json[] | null
          html_url?: string | null
          id?: number
          image_url?: string | null
          is_open_access?: boolean | null
          oai?: string | null
          rerun?: boolean
          score?: number | null
          score_raw?: string | null
          title_org?: string | null
          too_long?: boolean
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
            referencedColumns: ["id"]
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
          html_available: boolean | null
          html_url: string | null
          id: string
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
          html_available?: boolean | null
          html_url?: string | null
          id: string
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
          html_available?: boolean | null
          html_url?: string | null
          id?: string
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
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_mind_blow: {
        Args: { p_paper_doi: string; p_user_id: string; p_reason?: string }
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
        Args: { p_limit?: number }
        Returns: {
          paper_doi: string
          count: number
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      remove_mind_blow: {
        Args: { p_paper_doi: string; p_user_id: string }
        Returns: boolean
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
