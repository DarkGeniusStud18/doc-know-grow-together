export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author_id: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          reading_time: number | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      calculator_results: {
        Row: {
          calculator_type: string
          created_at: string
          id: string
          input_values: Json
          notes: string | null
          result_unit: string | null
          result_value: number | null
          user_id: string
        }
        Insert: {
          calculator_type: string
          created_at?: string
          id?: string
          input_values: Json
          notes?: string | null
          result_unit?: string | null
          result_value?: number | null
          user_id: string
        }
        Update: {
          calculator_type?: string
          created_at?: string
          id?: string
          input_values?: Json
          notes?: string | null
          result_unit?: string | null
          result_value?: number | null
          user_id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          id: string
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
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_cases: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          id: string
          is_anonymized: boolean
          is_premium: boolean
          specialty: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          id?: string
          is_anonymized?: boolean
          is_premium?: boolean
          specialty?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          id?: string
          is_anonymized?: boolean
          is_premium?: boolean
          specialty?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_cases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_discussions: {
        Row: {
          content: string
          created_at: string
          id: string
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_discussions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_community_discussions_topic"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      community_responses: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          is_expert_response: boolean
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_expert_response?: boolean
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_expert_response?: boolean
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_responses_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_community_responses_topic"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      community_topics: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string
          id: string
          is_pinned: boolean
          last_activity: string | null
          response_count: number | null
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean
          last_activity?: string | null
          response_count?: number | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean
          last_activity?: string | null
          response_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_topics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_invitations: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          message: string | null
          recipient_id: string | null
          sender_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_invitations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string | null
          id: string
          is_muted: boolean | null
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_public: boolean | null
          last_message_at: string | null
          max_members: number | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_message_at?: string | null
          max_members?: number | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_message_at?: string | null
          max_members?: number | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          instructor_id: string | null
          is_premium: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          instructor_id?: string | null
          is_premium?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          instructor_id?: string | null
          is_premium?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          topic_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          topic_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          topic_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_chat_messages_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_discussion_chat_messages_topic"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      edit_notifications: {
        Row: {
          created_at: string
          edit_id: string
          id: string
          is_read: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          edit_id: string
          id?: string
          is_read?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          edit_id?: string
          id?: string
          is_read?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edit_notifications_edit_id_fkey"
            columns: ["edit_id"]
            isOneToOne: false
            referencedRelation: "resource_edits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_edit_notifications_edit"
            columns: ["edit_id"]
            isOneToOne: false
            referencedRelation: "resource_edits"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_results: {
        Row: {
          created_at: string
          exam_name: string
          id: string
          max_score: number
          passed: boolean
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_name: string
          id?: string
          max_score: number
          passed: boolean
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          exam_name?: string
          id?: string
          max_score?: number
          passed?: boolean
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_sessions: {
        Row: {
          completed_at: string
          created_at: string
          duration_minutes: number
          exam_type: string
          id: string
          max_score: number
          questions_count: number
          score: number
          subjects: string[] | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          duration_minutes: number
          exam_type: string
          id?: string
          max_score: number
          questions_count: number
          score: number
          subjects?: string[] | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          duration_minutes?: number
          exam_type?: string
          id?: string
          max_score?: number
          questions_count?: number
          score?: number
          subjects?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          question: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          question: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          question?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "fk_group_messages_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_resources: {
        Row: {
          added_by: string
          created_at: string
          group_id: string
          id: string
          resource_id: string
          updated_at: string
        }
        Insert: {
          added_by: string
          created_at?: string
          group_id: string
          id?: string
          resource_id: string
          updated_at?: string
        }
        Update: {
          added_by?: string
          created_at?: string
          group_id?: string
          id?: string
          resource_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_group_resources_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_group_resources_resource"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_resources_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_resources_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          id: string
          processed_at: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          document_url?: string
          id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string | null
          edited_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          message_type: string | null
          reply_to: string | null
          sender_id: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          reply_to?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          reply_to?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      music_tracks: {
        Row: {
          artist: string
          category: string | null
          cover_image: string | null
          created_at: string
          duration: number | null
          file_url: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          artist: string
          category?: string | null
          cover_image?: string | null
          created_at?: string
          duration?: number | null
          file_url: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          artist?: string
          category?: string | null
          cover_image?: string | null
          created_at?: string
          duration?: number | null
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          category: string | null
          created_at: string
          id: string
          metric_type: string
          metric_unit: string | null
          metric_value: number
          recorded_date: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          metric_type: string
          metric_unit?: string | null
          metric_value: number
          recorded_date?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          metric_type?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_date?: string
          user_id?: string
        }
        Relationships: []
      }
      playlist_tracks: {
        Row: {
          created_at: string
          id: string
          playlist_id: string
          position: number
          track_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          playlist_id: string
          position: number
          track_id: string
        }
        Update: {
          created_at?: string
          id?: string
          playlist_id?: string
          position?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_playlist_tracks_playlist"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_playlist_tracks_track"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_tracks_new: {
        Row: {
          added_at: string | null
          id: string
          playlist_id: string | null
          position: number
          track_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          playlist_id?: string | null
          position: number
          track_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          playlist_id?: string | null
          position?: number
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_new_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "user_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_new_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pomodoro_sessions: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          duration_minutes: number
          id: string
          session_type: string
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_minutes: number
          id?: string
          session_type: string
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          session_type?: string
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pomodoro_settings: {
        Row: {
          auto_start_breaks: boolean
          auto_start_pomodoros: boolean
          created_at: string
          id: string
          long_break_duration: number
          sessions_until_long_break: number
          short_break_duration: number
          sound_enabled: boolean
          updated_at: string
          user_id: string
          work_duration: number
        }
        Insert: {
          auto_start_breaks?: boolean
          auto_start_pomodoros?: boolean
          created_at?: string
          id?: string
          long_break_duration?: number
          sessions_until_long_break?: number
          short_break_duration?: number
          sound_enabled?: boolean
          updated_at?: string
          user_id: string
          work_duration?: number
        }
        Update: {
          auto_start_breaks?: boolean
          auto_start_pomodoros?: boolean
          created_at?: string
          id?: string
          long_break_duration?: number
          sessions_until_long_break?: number
          short_break_duration?: number
          sound_enabled?: boolean
          updated_at?: string
          user_id?: string
          work_duration?: number
        }
        Relationships: []
      }
      presentation_slides: {
        Row: {
          content: string | null
          created_at: string
          id: string
          presentation_id: string
          slide_order: number
          slide_type: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          presentation_id: string
          slide_order: number
          slide_type?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          presentation_id?: string
          slide_order?: number
          slide_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_presentation_slides_presentation"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presentation_slides_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations"
            referencedColumns: ["id"]
          },
        ]
      }
      presentations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          profile_image: string | null
          provider: string | null
          provider_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          specialty: string | null
          subscription_expiry: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          university: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          email?: string | null
          id: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          profile_image?: string | null
          provider?: string | null
          provider_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          specialty?: string | null
          subscription_expiry?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          university?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          profile_image?: string | null
          provider?: string | null
          provider_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          specialty?: string | null
          subscription_expiry?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          university?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_notifications: {
        Row: {
          body: string
          conversation_id: string | null
          created_at: string | null
          id: string
          invitation_id: string | null
          is_pushed: boolean | null
          is_read: boolean | null
          message_id: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          body: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          is_pushed?: boolean | null
          is_read?: boolean | null
          message_id?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          is_pushed?: boolean | null
          is_read?: boolean | null
          message_id?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_notifications_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_notifications_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "conversation_invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_notifications_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempted_at: string
          id: string
          is_correct: boolean
          question_id: string
          time_taken_seconds: number | null
          user_answer: string
          user_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          time_taken_seconds?: number | null
          user_answer: string
          user_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          time_taken_seconds?: number | null
          user_answer?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_quiz_attempts_question"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          category: string | null
          correct_answer: string
          created_at: string
          difficulty: number | null
          explanation: string | null
          id: string
          options: Json | null
          question: string
          question_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          correct_answer: string
          created_at?: string
          difficulty?: number | null
          explanation?: string | null
          id?: string
          options?: Json | null
          question: string
          question_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          correct_answer?: string
          created_at?: string
          difficulty?: number | null
          explanation?: string | null
          id?: string
          options?: Json | null
          question?: string
          question_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      research_sources: {
        Row: {
          abstract: string | null
          authors: string[] | null
          citation_format: string | null
          created_at: string
          doi: string | null
          id: string
          is_favorite: boolean
          journal: string | null
          notes: string | null
          publication_year: number | null
          tags: string[] | null
          title: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          abstract?: string | null
          authors?: string[] | null
          citation_format?: string | null
          created_at?: string
          doi?: string | null
          id?: string
          is_favorite?: boolean
          journal?: string | null
          notes?: string | null
          publication_year?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          abstract?: string | null
          authors?: string[] | null
          citation_format?: string | null
          created_at?: string
          doi?: string | null
          id?: string
          is_favorite?: boolean
          journal?: string | null
          notes?: string | null
          publication_year?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resource_edits: {
        Row: {
          article_id: string | null
          changes: Json
          created_at: string
          edit_summary: string | null
          edit_type: string
          editor_id: string
          id: string
          original_author_id: string
          resource_id: string | null
        }
        Insert: {
          article_id?: string | null
          changes: Json
          created_at?: string
          edit_summary?: string | null
          edit_type: string
          editor_id: string
          id?: string
          original_author_id: string
          resource_id?: string | null
        }
        Update: {
          article_id?: string | null
          changes?: Json
          created_at?: string
          edit_summary?: string | null
          edit_type?: string
          editor_id?: string
          id?: string
          original_author_id?: string
          resource_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_resource_edits_article"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_resource_edits_resource"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_edits_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_edits_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_files: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          filename: string
          id: string
          mime_type: string | null
          resource_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          filename: string
          id?: string
          mime_type?: string | null
          resource_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          filename?: string
          id?: string
          mime_type?: string | null
          resource_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_resource_files_resource"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_files_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          author: string | null
          category: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          created_by: string | null
          description: string | null
          edit_count: number | null
          featured: boolean
          id: string
          is_premium: boolean
          language: string | null
          last_edited_at: string | null
          last_edited_by: string | null
          requires_verification: boolean
          thumbnail: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          edit_count?: number | null
          featured?: boolean
          id?: string
          is_premium?: boolean
          language?: string | null
          last_edited_at?: string | null
          last_edited_by?: string | null
          requires_verification?: boolean
          thumbnail?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          edit_count?: number | null
          featured?: boolean
          id?: string
          is_premium?: boolean
          language?: string | null
          last_edited_at?: string | null
          last_edited_by?: string | null
          requires_verification?: boolean
          thumbnail?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      study_goals: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          current_value: number
          deadline: string | null
          description: string | null
          goal_type: string
          id: string
          target_value: number
          title: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_value?: number
          deadline?: string | null
          description?: string | null
          goal_type: string
          id?: string
          target_value: number
          title: string
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_value?: number
          deadline?: string | null
          description?: string | null
          goal_type?: string
          id?: string
          target_value?: number
          title?: string
          unit?: string
          updated_at?: string
          user_id?: string
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
          role?: string
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
            foreignKeyName: "fk_study_group_members_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_private: boolean
          max_members: number | null
          name: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_private?: boolean
          max_members?: number | null
          name: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_private?: boolean
          max_members?: number | null
          name?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_groups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          progress: number | null
          start_date: string
          subjects: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          progress?: number | null
          start_date: string
          subjects?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          progress?: number | null
          start_date?: string
          subjects?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_session_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          session_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_study_session_notes_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_session_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          completed: boolean | null
          created_at: string
          duration_minutes: number
          ended_at: string | null
          id: string
          started_at: string
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          duration_minutes: number
          ended_at?: string | null
          id?: string
          started_at?: string
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          duration_minutes?: number
          ended_at?: string | null
          id?: string
          started_at?: string
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      switch_credentials: {
        Row: {
          created_at: string
          id: string
          password: string
          pin_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          password: string
          pin_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          password?: string
          pin_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_categories: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_display_preferences: {
        Row: {
          color_scheme: string
          created_at: string
          font_family: string
          font_size: string
          high_contrast: boolean
          id: string
          reduce_motion: boolean
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color_scheme?: string
          created_at?: string
          font_family?: string
          font_size?: string
          high_contrast?: boolean
          id?: string
          reduce_motion?: boolean
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color_scheme?: string
          created_at?: string
          font_family?: string
          font_size?: string
          high_contrast?: boolean
          id?: string
          reduce_motion?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_music_preferences: {
        Row: {
          created_at: string
          id: string
          last_played_track: string | null
          updated_at: string
          user_id: string
          volume: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_played_track?: string | null
          updated_at?: string
          user_id: string
          volume?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_played_track?: string | null
          updated_at?: string
          user_id?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_music_preferences_last_played_track_fkey"
            columns: ["last_played_track"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_music_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_playlists: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          language: string | null
          push_notifications: boolean | null
          study_reminders: boolean | null
          timezone: string | null
          updated_at: string
          user_id: string
          weekly_reports: boolean | null
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          push_notifications?: boolean | null
          study_reminders?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          weekly_reports?: boolean | null
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          push_notifications?: boolean | null
          study_reminders?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          weekly_reports?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_community_stats: {
        Row: {
          responses_created_week: number | null
          topics_created_week: number | null
          total_chat_messages: number | null
          total_responses: number | null
          total_topics: number | null
        }
        Relationships: []
      }
      admin_presentations_stats: {
        Row: {
          presentations_created_week: number | null
          public_presentations: number | null
          total_presentations: number | null
          total_slides: number | null
        }
        Relationships: []
      }
      admin_resources_stats: {
        Row: {
          premium_resources: number | null
          resources_created_week: number | null
          total_articles: number | null
          total_clinical_cases: number | null
          total_resources: number | null
        }
        Relationships: []
      }
      admin_study_groups_stats: {
        Row: {
          avg_members_per_group: number | null
          groups_created_week: number | null
          total_group_members: number | null
          total_groups: number | null
        }
        Relationships: []
      }
      admin_study_stats: {
        Row: {
          avg_session_duration: number | null
          sessions_this_week: number | null
          total_pomodoro_sessions: number | null
          total_study_minutes: number | null
          total_study_sessions: number | null
        }
        Relationships: []
      }
      admin_user_stats: {
        Row: {
          active_users_month: number | null
          active_users_week: number | null
          new_users_today: number | null
          premium_users: number | null
          total_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_topic_popularity_score: {
        Args: {
          response_count: number
          view_count: number
          created_at: string
          last_activity: string
        }
        Returns: number
      }
      delete_group_message: {
        Args: { p_message_id: string; p_user_id: string }
        Returns: boolean
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          active_users_month: number
          active_users_week: number
          new_users_today: number
          premium_users: number
          total_groups: number
          groups_created_week: number
          avg_members_per_group: number
          total_topics: number
          total_responses: number
          topics_created_week: number
          total_resources: number
          resources_created_week: number
          total_presentations: number
          presentations_created_week: number
          total_study_sessions: number
          total_study_minutes: number
          sessions_this_week: number
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      get_user_goal_progress: {
        Args: { p_user_id: string }
        Returns: {
          goal_id: string
          title: string
          goal_type: string
          progress_percentage: number
          is_overdue: boolean
        }[]
      }
      get_user_pomodoro_stats: {
        Args: { p_user_id: string; p_start_date?: string; p_end_date?: string }
        Returns: {
          total_sessions: number
          completed_sessions: number
          total_work_time: number
          completion_rate: number
        }[]
      }
      get_user_study_stats: {
        Args: { p_user_id: string; p_period?: string }
        Returns: {
          total_hours: number
          avg_session_duration: number
          most_studied_subject: string
          sessions_count: number
        }[]
      }
      get_user_task_stats: {
        Args: { p_user_id: string }
        Returns: {
          total_tasks: number
          completed_tasks: number
          pending_tasks: number
          overdue_tasks: number
        }[]
      }
      has_premium_access: {
        Args: { user_id: string }
        Returns: boolean
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
      app_role: "student" | "professional" | "healthcare_professional"
      content_type: "book" | "video" | "document" | "article"
      document_type: "id_card" | "passport" | "student_card" | "medical_license"
      kyc_status: "not_submitted" | "pending" | "verified" | "rejected"
      subscription_status: "free" | "premium"
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
    Enums: {
      app_role: ["student", "professional", "healthcare_professional"],
      content_type: ["book", "video", "document", "article"],
      document_type: ["id_card", "passport", "student_card", "medical_license"],
      kyc_status: ["not_submitted", "pending", "verified", "rejected"],
      subscription_status: ["free", "premium"],
    },
  },
} as const
