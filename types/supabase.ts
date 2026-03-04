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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      business_memberships: {
        Row: {
          business_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_memberships_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_page_settings: {
        Row: {
          business_id: string
          config: Json
          created_at: string
          page_type: string
          theme_key: string
          updated_at: string
        }
        Insert: {
          business_id: string
          config?: Json
          created_at?: string
          page_type?: string
          theme_key?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          config?: Json
          created_at?: string
          page_type?: string
          theme_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_page_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          business_type: string
          created_at: string
          created_by: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          business_type: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          business_type?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          buyer_company: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          created_at: string
          id: string
          message: string
          status: string
          supplier_id: string
        }
        Insert: {
          buyer_company?: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          created_at?: string
          id?: string
          message: string
          status?: string
          supplier_id: string
        }
        Update: {
          buyer_company?: string | null
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          created_at?: string
          id?: string
          message?: string
          status?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      shop_media: {
        Row: {
          alt_text: string | null
          created_at: string
          file_url: string
          id: string
          media_type: string
          shop_business_id: string
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_url: string
          id?: string
          media_type: string
          shop_business_id: string
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_url?: string
          id?: string
          media_type?: string
          shop_business_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_media_shop_business_id_fkey"
            columns: ["shop_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_product_needs: {
        Row: {
          created_at: string
          id: string
          need_type: string
          quantity_note: string | null
          shop_business_id: string
          supplier_product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          need_type?: string
          quantity_note?: string | null
          shop_business_id: string
          supplier_product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          need_type?: string
          quantity_note?: string | null
          shop_business_id?: string
          supplier_product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_product_needs_shop_business_id_fkey"
            columns: ["shop_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_product_needs_supplier_product_id_fkey"
            columns: ["supplier_product_id"]
            isOneToOne: false
            referencedRelation: "supplier_products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_products: {
        Row: {
          created_at: string
          currency: string
          id: string
          image_url: string | null
          is_price_public: boolean
          long_description: string | null
          price: number | null
          price_unit: string | null
          product_name: string
          shop_business_id: string
          short_description: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          image_url?: string | null
          is_price_public?: boolean
          long_description?: string | null
          price?: number | null
          price_unit?: string | null
          product_name: string
          shop_business_id: string
          short_description?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          image_url?: string | null
          is_price_public?: boolean
          long_description?: string | null
          price?: number | null
          price_unit?: string | null
          product_name?: string
          shop_business_id?: string
          short_description?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_products_shop_business_id_fkey"
            columns: ["shop_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_profiles: {
        Row: {
          address: string | null
          business_id: string
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          email: string | null
          full_description: string | null
          headline: string | null
          id: string
          industries: string[] | null
          is_published: boolean
          is_verified: boolean
          mission: string | null
          phone: string | null
          region: string | null
          shop_type: string | null
          short_description: string | null
          updated_at: string
          vision: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          business_id: string
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_description?: string | null
          headline?: string | null
          id?: string
          industries?: string[] | null
          is_published?: boolean
          is_verified?: boolean
          mission?: string | null
          phone?: string | null
          region?: string | null
          shop_type?: string | null
          short_description?: string | null
          updated_at?: string
          vision?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          business_id?: string
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_description?: string | null
          headline?: string | null
          id?: string
          industries?: string[] | null
          is_published?: boolean
          is_verified?: boolean
          mission?: string | null
          phone?: string | null
          region?: string | null
          shop_type?: string | null
          short_description?: string | null
          updated_at?: string
          vision?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_capabilities: {
        Row: {
          created_at: string
          id: string
          lead_time: string | null
          materials: string[] | null
          minimum_order: string | null
          processes: string[] | null
          production_capacity: string | null
          supplier_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_time?: string | null
          materials?: string[] | null
          minimum_order?: string | null
          processes?: string[] | null
          production_capacity?: string | null
          supplier_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_time?: string | null
          materials?: string[] | null
          minimum_order?: string | null
          processes?: string[] | null
          production_capacity?: string | null
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_capabilities_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_media: {
        Row: {
          alt_text: string | null
          created_at: string
          file_url: string
          id: string
          media_type: string
          sort_order: number
          supplier_id: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_url: string
          id?: string
          media_type: string
          sort_order?: number
          supplier_id: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_url?: string
          id?: string
          media_type?: string
          sort_order?: number
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_media_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_products: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          product_name: string
          short_description: string | null
          sort_order: number
          supplier_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          product_name: string
          short_description?: string | null
          sort_order?: number
          supplier_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          product_name?: string
          short_description?: string | null
          sort_order?: number
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_profiles: {
        Row: {
          address: string | null
          business_id: string
          certifications: string[] | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          employees_count: number | null
          export_countries: string[] | null
          founded_year: number | null
          full_description: string | null
          headline: string | null
          id: string
          industries: string[] | null
          is_published: boolean
          is_verified: boolean
          main_category: string | null
          phone: string | null
          region: string | null
          short_description: string | null
          updated_at: string
          website_url: string | null
          years_in_business: number | null
        }
        Insert: {
          address?: string | null
          business_id: string
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          employees_count?: number | null
          export_countries?: string[] | null
          founded_year?: number | null
          full_description?: string | null
          headline?: string | null
          id?: string
          industries?: string[] | null
          is_published?: boolean
          is_verified?: boolean
          main_category?: string | null
          phone?: string | null
          region?: string | null
          short_description?: string | null
          updated_at?: string
          website_url?: string | null
          years_in_business?: number | null
        }
        Update: {
          address?: string | null
          business_id?: string
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          employees_count?: number | null
          export_countries?: string[] | null
          founded_year?: number | null
          full_description?: string | null
          headline?: string | null
          id?: string
          industries?: string[] | null
          is_published?: boolean
          is_verified?: boolean
          main_category?: string | null
          phone?: string | null
          region?: string | null
          short_description?: string | null
          updated_at?: string
          website_url?: string | null
          years_in_business?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_business: { Args: { p_business_id: string }; Returns: boolean }
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
