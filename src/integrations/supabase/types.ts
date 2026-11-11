export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      hackathon_fits: {
        Row: {
          created_at: string
          gaps: string[]
          hackathon_id: string
          matched_skills: string[]
          score: number
          summary: string | null
          user_id: string
          verdict: string | null
        }
        Insert: {
          created_at?: string
          gaps?: string[]
          hackathon_id: string
          matched_skills?: string[]
          score: number
          summary?: string | null
          user_id: string
          verdict?: string | null
        }
        Update: {
          created_at?: string
          gaps?: string[]
          hackathon_id?: string
          matched_skills?: string[]
          score?: number
          summary?: string | null
          user_id?: string
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_fits_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathons: {
        Row: {
          dates_label: string | null
          description: string | null
          ends_at: string | null
          external_id: string
          id: string
          image_url: string | null
          location: string | null
          mode: string | null
          organizer: string | null
          participants: number | null
          prize: string | null
          reg_ends_at: string | null
          source: string
          starts_at: string | null
          tags: string[]
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          dates_label?: string | null
          description?: string | null
          ends_at?: string | null
          external_id: string
          id?: string
          image_url?: string | null
          location?: string | null
          mode?: string | null
          organizer?: string | null
          participants?: number | null
          prize?: string | null
          reg_ends_at?: string | null
          source: string
          starts_at?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          dates_label?: string | null
          description?: string | null
          ends_at?: string | null
          external_id?: string
          id?: string
          image_url?: string | null
          location?: string | null
          mode?: string | null
          organizer?: string | null
          participants?: number | null
          prize?: string | null
          reg_ends_at?: string | null
          source?: string
          starts_at?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_blueprint: Json | null
          ai_evaluated_at: string | null
          avatar_url: string | null
          bio: string | null
          branch: string | null
          completed: boolean
          created_at: string
          current_year: number | null
          email: string
          experience: string | null
          full_name: string | null
          gender: string | null
          github_url: string | null
          graduating_year: number | null
          headline: string | null
          id: string
          interests: string[]
          linkedin_url: string | null
          persona: string | null
          portfolio_url: string | null
          roll_no: string | null
          skills: string[]
          university: string | null
          updated_at: string
        }
        Insert: {
          ai_blueprint?: Json | null
          ai_evaluated_at?: string | null
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          completed?: boolean
          created_at?: string
          current_year?: number | null
          email: string
          experience?: string | null
          full_name?: string | null
          gender?: string | null
          github_url?: string | null
          graduating_year?: number | null
          headline?: string | null
          id: string
          interests?: string[]
          linkedin_url?: string | null
          persona?: string | null
          portfolio_url?: string | null
          roll_no?: string | null
          skills?: string[]
          university?: string | null
          updated_at?: string
        }
        Update: {
          ai_blueprint?: Json | null
          ai_evaluated_at?: string | null
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          completed?: boolean
          created_at?: string
          current_year?: number | null
          email?: string
          experience?: string | null
          full_name?: string | null
          gender?: string | null
          github_url?: string | null
          graduating_year?: number | null
          headline?: string | null
          id?: string
          interests?: string[]
          linkedin_url?: string | null
          persona?: string | null
          portfolio_url?: string | null
          roll_no?: string | null
          skills?: string[]
          university?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_interests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          post_id: string
          shared_contact: Json | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          post_id: string
          shared_contact?: Json | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          post_id?: string
          shared_contact?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_interests_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "team_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_posts: {
        Row: {
          commitment: string | null
          created_at: string
          description: string
          hackathon_id: string | null
          id: string
          owner_id: string
          roles_needed: string[]
          skills_needed: string[]
          spots: number
          status: string
          title: string
        }
        Insert: {
          commitment?: string | null
          created_at?: string
          description: string
          hackathon_id?: string | null
          id?: string
          owner_id: string
          roles_needed?: string[]
          skills_needed?: string[]
          spots?: number
          status?: string
          title: string
        }
        Update: {
          commitment?: string | null
          created_at?: string
          description?: string
          hackathon_id?: string | null
          id?: string
          owner_id?: string
          roles_needed?: string[]
          skills_needed?: string[]
          spots?: number
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_posts_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_posts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_post_owner: { Args: { _post: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
