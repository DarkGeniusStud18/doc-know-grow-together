
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject?: string;
  duration_minutes: number;
  completed: boolean;
  started_at: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  subjects: any[];
  progress: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Presentation {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PresentationSlide {
  id: string;
  user_id: string;
  presentation_id: string;
  title: string;
  content?: string;
  slide_order: number;
  slide_type: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface StudySessionNote {
  id: string;
  session_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  study_reminders: boolean;
  weekly_reports: boolean;
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}
