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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_icon: string
          coins_reward: number
          created_at: string
          description: string
          id: string
          requirement_type: string
          requirement_value: number
          title: string
        }
        Insert: {
          badge_icon: string
          coins_reward?: number
          created_at?: string
          description: string
          id?: string
          requirement_type: string
          requirement_value: number
          title: string
        }
        Update: {
          badge_icon?: string
          coins_reward?: number
          created_at?: string
          description?: string
          id?: string
          requirement_type?: string
          requirement_value?: number
          title?: string
        }
        Relationships: []
      }
      daily_missions: {
        Row: {
          coins_reward: number
          created_at: string
          description: string
          icon: string
          id: string
          mission_type: string
          target_value: number
          title: string
          xp_reward: number
        }
        Insert: {
          coins_reward?: number
          created_at?: string
          description: string
          icon: string
          id?: string
          mission_type: string
          target_value: number
          title: string
          xp_reward?: number
        }
        Update: {
          coins_reward?: number
          created_at?: string
          description?: string
          icon?: string
          id?: string
          mission_type?: string
          target_value?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      lessons: {
        Row: {
          category: string
          coins_reward: number
          content: Json
          created_at: string
          description: string
          difficulty: string
          id: string
          order_index: number
          title: string
        }
        Insert: {
          category: string
          coins_reward?: number
          content: Json
          created_at?: string
          description: string
          difficulty?: string
          id?: string
          order_index: number
          title: string
        }
        Update: {
          category?: string
          coins_reward?: number
          content?: Json
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          current_streak: number
          display_name: string
          experience_points: number
          favorite_color: string | null
          id: string
          last_activity_date: string | null
          level: number
          longest_streak: number
          selected_avatar: string | null
          total_coins: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_streak?: number
          display_name: string
          experience_points?: number
          favorite_color?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          selected_avatar?: string | null
          total_coins?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_streak?: number
          display_name?: string
          experience_points?: number
          favorite_color?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          selected_avatar?: string | null
          total_coins?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rewards_store: {
        Row: {
          category: string
          cost_coins: number
          created_at: string
          description: string
          id: string
          image_url: string | null
          stock: number | null
          title: string
        }
        Insert: {
          category: string
          cost_coins: number
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          stock?: number | null
          title: string
        }
        Update: {
          category?: string
          cost_coins?: number
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          stock?: number | null
          title?: string
        }
        Relationships: []
      }
      stats_history: {
        Row: {
          coins_earned: number
          date: string
          id: string
          lessons_completed: number
          missions_completed: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          coins_earned?: number
          date?: string
          id?: string
          lessons_completed?: number
          missions_completed?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          coins_earned?: number
          date?: string
          id?: string
          lessons_completed?: number
          missions_completed?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_missions: {
        Row: {
          completed: boolean
          completed_at: string | null
          date: string
          id: string
          mission_id: string
          progress: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          date?: string
          id?: string
          mission_id: string
          progress?: number
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          date?: string
          id?: string
          mission_id?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "daily_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          score: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          score?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_purchases: {
        Row: {
          id: string
          purchased_at: string
          redeemed: boolean
          reward_id: string
          user_id: string
        }
        Insert: {
          id?: string
          purchased_at?: string
          redeemed?: boolean
          reward_id: string
          user_id: string
        }
        Update: {
          id?: string
          purchased_at?: string
          redeemed?: boolean
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards_store"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
