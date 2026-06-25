export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          source: string
          stage: string
          value: number
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          source?: string
          stage?: string
          value?: number
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          source?: string
          stage?: string
          value?: number
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: string
          contact_id: string | null
          type: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          contact_id?: string | null
          type?: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          contact_id?: string | null
          type?: string
          text?: string
          created_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          contact_id: string | null
          title: string
          due_date: string | null
          done: boolean
          created_at: string
        }
        Insert: {
          id?: string
          contact_id?: string | null
          title: string
          due_date?: string | null
          done?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          contact_id?: string | null
          title?: string
          due_date?: string | null
          done?: boolean
          created_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          id: string
          source: string | null
          raw_payload: Record<string, unknown> | null
          extracted_data: Record<string, unknown> | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          source?: string | null
          raw_payload?: Record<string, unknown> | null
          extracted_data?: Record<string, unknown> | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          source?: string | null
          raw_payload?: Record<string, unknown> | null
          extracted_data?: Record<string, unknown> | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
