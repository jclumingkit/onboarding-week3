export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_call_table: {
        Row: {
          id: string
          api_path: string | null
          called_at: string | null
          called_by: string | null
        }
        Insert: {
          id?: string
          api_path?: string | null
          called_at?: string | null
          called_by?: string | null
        }
        Update: {
          id?: string
          api_path?: string | null
          called_at?: string | null
          called_by?: string | null
        }
      }
      keyword_analysis_results: {
        Row: {
          id: string
          keyword: string | null
          keyword_count: number | null
          number_of_sets: number | null
          run_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          keyword?: string | null
          keyword_count?: number | null
          number_of_sets?: number | null
          run_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          keyword?: string | null
          keyword_count?: number | null
          number_of_sets?: number | null
          run_by?: string | null
          created_at?: string | null
        }
      }
      peer_reviews: {
        Row: {
          id: string
          name: string | null
          date: string | null
          required_rating: Json | null
          optional_rating: Json | null
          submitted_by: string | null
          fts: unknown | null
        }
        Insert: {
          id?: string
          name?: string | null
          date?: string | null
          required_rating?: Json | null
          optional_rating?: Json | null
          submitted_by?: string | null
          fts?: unknown | null
        }
        Update: {
          id?: string
          name?: string | null
          date?: string | null
          required_rating?: Json | null
          optional_rating?: Json | null
          submitted_by?: string | null
          fts?: unknown | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          username: string | null
          email: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          created_at?: string | null
        }
      }
      user_uploads: {
        Row: {
          id: string
          user_id: string | null
          image_bucket_path: string | null
          description: string | null
          compression: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          image_bucket_path?: string | null
          description?: string | null
          compression?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          image_bucket_path?: string | null
          description?: string | null
          compression?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_keyword_analysis: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      keyword_jsonb_ilike: {
        Args: { keyword: string }
        Returns: unknown
      }
      search_peer_reviews: {
        Args: { keyword: string }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
