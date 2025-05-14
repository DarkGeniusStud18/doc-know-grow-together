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
      calendar_events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          id: string
          is_recurring: boolean
          location: string | null
          recurrence_rule: string | null
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          is_recurring?: boolean
          location?: string | null
          recurrence_rule?: string | null
          start_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          is_recurring?: boolean
          location?: string | null
          recurrence_rule?: string | null
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clinical_cases: {
        Row: {
          author_id: string
          content: string
          created_at: string
          description: string
          id: string
          is_anonymized: boolean
          specialty: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          description: string
          id?: string
          is_anonymized?: boolean
          specialty: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          description?: string
          id?: string
          is_anonymized?: boolean
          specialty?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_responses: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_expert_response: boolean
          topic_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_expert_response?: boolean
          topic_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_expert_response?: boolean
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_responses_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      community_topics: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          id: string
          processed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          id?: string
          processed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          id?: string
          processed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          id: string
          kyc_status: string
          profile_image: string | null
          role: string
          specialty: string | null
          university: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          email?: string | null
          id: string
          kyc_status?: string
          profile_image?: string | null
          role: string
          specialty?: string | null
          university?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          kyc_status?: string
          profile_image?: string | null
          role?: string
          specialty?: string | null
          university?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          author: string | null
          category: string
          content_type: string
          created_at: string
          description: string
          featured: boolean
          id: string
          is_premium: boolean
          language: string
          requires_verification: boolean
          thumbnail: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          author?: string | null
          category: string
          content_type: string
          created_at?: string
          description: string
          featured?: boolean
          id?: string
          is_premium?: boolean
          language?: string
          requires_verification?: boolean
          thumbnail?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          author?: string | null
          category?: string
          content_type?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          is_premium?: boolean
          language?: string
          requires_verification?: boolean
          thumbnail?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      study_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string
          description: string
          id: string
          is_private: boolean
          max_participants: number | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_private?: boolean
          max_participants?: number | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_private?: boolean
          max_participants?: number | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_group_message: {
        Args: { p_message_id: string; p_user_id: string }
        Returns: boolean
      }
      get_group_messages: {
        Args: { p_group_id: string }
        Returns: {
          content: string
          created_at: string
          group_id: string
          id: string
          updated_at: string
          user_id: string
        }[]
      }
      insert_group_message: {
        Args: { p_content: string; p_user_id: string; p_group_id: string }
        Returns: string
      }
      update_group_message: {
        Args: { p_message_id: string; p_content: string; p_user_id: string }
        Returns: boolean
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
