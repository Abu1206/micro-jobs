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
      user_profiles: {
        Row: {
          user_id: string
          full_name: string | null
          headline: string | null
          university: string | null
          major: string | null
          avatar_url: string | null
          verified: boolean
          rating: number
          endorsements: number
          updated_at: string
          created_at: string
        }
        Insert: {
          user_id: string
          full_name?: string | null
          headline?: string | null
          university?: string | null
          major?: string | null
          avatar_url?: string | null
          verified?: boolean
          rating?: number
          endorsements?: number
          updated_at?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          full_name?: string | null
          headline?: string | null
          university?: string | null
          major?: string | null
          avatar_url?: string | null
          verified?: boolean
          rating?: number
          endorsements?: number
          updated_at?: string
          created_at?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          description: string
          location: string | null
          deadline: string | null
          tags: string[]
          media_urls: string[]
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: string
          description: string
          location?: string | null
          deadline?: string | null
          tags?: string[]
          media_urls?: string[]
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string
          description?: string
          location?: string | null
          deadline?: string | null
          tags?: string[]
          media_urls?: string[]
          created_at?: string
          status?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          id: string
          user_id: string
          opportunity_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          opportunity_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          opportunity_id?: string
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      saved_opportunities: {
        Row: {
          id: string
          user_id: string
          opportunity_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          opportunity_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          opportunity_id?: string
          created_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          participant_1_id: string
          participant_2_id: string
          opportunity_id: string | null
          last_message_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participant_1_id: string
          participant_2_id: string
          opportunity_id?: string | null
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participant_1_id?: string
          participant_2_id?: string
          opportunity_id?: string | null
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          media_urls: string[]
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          media_urls?: string[]
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          media_urls?: string[]
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
