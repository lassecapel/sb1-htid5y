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
      languages: {
        Row: {
          code: string
          name: string
        }
        Insert: {
          code: string
          name: string
        }
        Update: {
          code?: string
          name?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      words: {
        Row: {
          id: string
          category: string
          complexity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          complexity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          complexity?: number
          created_at?: string
          updated_at?: string
        }
      }
      translations: {
        Row: {
          id: string
          word_id: string
          language_code: string
          value: string
          pronunciation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word_id: string
          language_code: string
          value: string
          pronunciation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          word_id?: string
          language_code?: string
          value?: string
          pronunciation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      word_lists: {
        Row: {
          id: string
          title: string
          description: string | null
          from_language: string
          to_language: string
          user_id: string
          fork_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          from_language: string
          to_language: string
          user_id: string
          fork_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          from_language?: string
          to_language?: string
          user_id?: string
          fork_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      word_list_entries: {
        Row: {
          word_list_id: string
          word_id: string
          position: number
          created_at: string
        }
        Insert: {
          word_list_id: string
          word_id: string
          position: number
          created_at?: string
        }
        Update: {
          word_list_id?: string
          word_id?: string
          position?: number
          created_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          user_id: string
          word_list_id: string
          type: Database['public']['Enums']['practice_type']
          started_at: string
          completed_at: string
          total_time: number
          correct_count: number
          total_count: number
          score: number
          state: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word_list_id: string
          type: Database['public']['Enums']['practice_type']
          started_at: string
          completed_at: string
          total_time: number
          correct_count: number
          total_count: number
          score: number
          state: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word_list_id?: string
          type?: Database['public']['Enums']['practice_type']
          started_at?: string
          completed_at?: string
          total_time?: number
          correct_count?: number
          total_count?: number
          score?: number
          state?: Json
          created_at?: string
        }
      }
      test_answers: {
        Row: {
          id: string
          test_result_id: string
          word_id: string
          given_answer: string
          correct_answer: string
          is_correct: boolean
          match_score: number
          time_spent: number
          attempts: number
          created_at: string
        }
        Insert: {
          id?: string
          test_result_id: string
          word_id: string
          given_answer: string
          correct_answer: string
          is_correct: boolean
          match_score: number
          time_spent: number
          attempts?: number
          created_at?: string
        }
        Update: {
          id?: string
          test_result_id?: string
          word_id?: string
          given_answer?: string
          correct_answer?: string
          is_correct?: boolean
          match_score?: number
          time_spent?: number
          attempts?: number
          created_at?: string
        }
      }
    }
    Enums: {
      practice_type: 'flashcards' | 'writing' | 'quiz' | 'listening'
    }
    Functions: {
      increment_fork_count: {
        Args: {
          list_id: string
        }
        Returns: void
      }
    }
  }
}