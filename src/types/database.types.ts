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
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          status: string
          created_at: string
          display_name: string | null
          avatar_url: string | null
          phone: string | null
        }
        Insert: {
          id: string
          email: string
          role?: string
          status?: string
          created_at?: string
          display_name?: string | null
          avatar_url?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: string
          status?: string
          created_at?: string
          display_name?: string | null
          avatar_url?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          description: string | null
          whatsapp: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          description?: string | null
          whatsapp?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          description?: string | null
          whatsapp?: string | null
          address?: string | null
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          store_id: string
          name: string
          order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          order?: number | null
          created_at?: string
        }
        Relationships: []
      }
      menus: {
        Row: {
          id: string
          store_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          image_url: string | null
          extra_images: string[] | null
          is_active: boolean
          order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          extra_images?: string[] | null
          is_active?: boolean
          order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          extra_images?: string[] | null
          is_active?: boolean
          order?: number | null
          created_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          started_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          started_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          started_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          id: string
          store_id: string
          logo_url: string | null
          banner_url: string | null
          primary_color: string | null
          theme: string | null
          opening_hours: string | null
          whatsapp_button_text: string | null
          show_price: boolean | null
          font: string | null
          menu_layout: string | null
          phone: string | null
          instagram: string | null
          facebook: string | null
          tiktok: string | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          logo_url?: string | null
          banner_url?: string | null
          primary_color?: string | null
          theme?: string | null
          opening_hours?: string | null
          whatsapp_button_text?: string | null
          show_price?: boolean | null
          font?: string | null
          menu_layout?: string | null
          phone?: string | null
          instagram?: string | null
          facebook?: string | null
          tiktok?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          logo_url?: string | null
          banner_url?: string | null
          primary_color?: string | null
          theme?: string | null
          opening_hours?: string | null
          whatsapp_button_text?: string | null
          show_price?: boolean | null
          font?: string | null
          menu_layout?: string | null
          phone?: string | null
          instagram?: string | null
          facebook?: string | null
          tiktok?: string | null
          created_at?: string
        }
        Relationships: []
      }
      analytics: {
        Row: {
          id: string
          store_id: string
          event_type: string
          metadata: Json | null
          ip: string | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          event_type: string
          metadata?: Json | null
          ip?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          event_type?: string
          metadata?: Json | null
          ip?: string | null
          created_at?: string
        }
        Relationships: []
      }
      store_locations: {
        Row: {
          id: string
          store_id: string
          name: string
          address: string
          opening_hours: string | null
          whatsapp: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          address: string
          opening_hours?: string | null
          whatsapp?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          address?: string
          opening_hours?: string | null
          whatsapp?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_locations_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          }
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

type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Row']

export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update']
