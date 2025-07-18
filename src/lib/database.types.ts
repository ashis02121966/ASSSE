export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string
          name: string
          code: string
          permissions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          profile_image: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          profile_image?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          profile_image?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_role_assignments: {
        Row: {
          id: string
          user_id: string
          role_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          created_at?: string
        }
      }
      frames: {
        Row: {
          id: string
          file_name: string
          dsl_number: string | null
          sector: string
          enterprises_count: number
          status: string
          upload_date: string
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          file_name: string
          dsl_number?: string | null
          sector: string
          enterprises_count?: number
          status?: string
          upload_date?: string
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          dsl_number?: string | null
          sector?: string
          enterprises_count?: number
          status?: string
          upload_date?: string
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      frame_allocations: {
        Row: {
          id: string
          frame_id: string
          user_id: string
          allocated_by: string | null
          allocated_at: string
        }
        Insert: {
          id?: string
          frame_id: string
          user_id: string
          allocated_by?: string | null
          allocated_at?: string
        }
        Update: {
          id?: string
          frame_id?: string
          user_id?: string
          allocated_by?: string | null
          allocated_at?: string
        }
      }
      survey_schedules: {
        Row: {
          id: string
          name: string
          description: string
          sector: string
          year: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          sector?: string
          year?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          sector?: string
          year?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      survey_blocks: {
        Row: {
          id: string
          schedule_id: string
          name: string
          description: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          schedule_id: string
          name: string
          description?: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          schedule_id?: string
          name?: string
          description?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      survey_fields: {
        Row: {
          id: string
          block_id: string
          label: string
          field_type: string
          is_required: boolean
          validation_rules: Json
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          block_id: string
          label: string
          field_type: string
          is_required?: boolean
          validation_rules?: Json
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          block_id?: string
          label?: string
          field_type?: string
          is_required?: boolean
          validation_rules?: Json
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      surveys: {
        Row: {
          id: string
          frame_id: string
          enterprise_id: string
          schedule_id: string | null
          status: string
          compiler_id: string | null
          scrutinizer_id: string | null
          last_modified: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          frame_id: string
          enterprise_id: string
          schedule_id?: string | null
          status?: string
          compiler_id?: string | null
          scrutinizer_id?: string | null
          last_modified?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          frame_id?: string
          enterprise_id?: string
          schedule_id?: string | null
          status?: string
          compiler_id?: string | null
          scrutinizer_id?: string | null
          last_modified?: string
          created_at?: string
          updated_at?: string
        }
      }
      survey_responses: {
        Row: {
          id: string
          survey_id: string
          field_id: string
          value: string
          updated_at: string
        }
        Insert: {
          id?: string
          survey_id: string
          field_id: string
          value?: string
          updated_at?: string
        }
        Update: {
          id?: string
          survey_id?: string
          field_id?: string
          value?: string
          updated_at?: string
        }
      }
      scrutiny_comments: {
        Row: {
          id: string
          survey_id: string
          block_id: string | null
          field_id: string | null
          comment: string
          scrutinizer_id: string | null
          is_resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          survey_id: string
          block_id?: string | null
          field_id?: string | null
          comment: string
          scrutinizer_id?: string | null
          is_resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          survey_id?: string
          block_id?: string | null
          field_id?: string | null
          comment?: string
          scrutinizer_id?: string | null
          is_resolved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notices: {
        Row: {
          id: string
          frame_id: string
          enterprise_name: string
          enterprise_address: string
          template_type: string
          signatory_id: string | null
          status: string
          generated_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          frame_id: string
          enterprise_name: string
          enterprise_address: string
          template_type?: string
          signatory_id?: string | null
          status?: string
          generated_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          frame_id?: string
          enterprise_name?: string
          enterprise_address?: string
          template_type?: string
          signatory_id?: string | null
          status?: string
          generated_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
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
  }
}