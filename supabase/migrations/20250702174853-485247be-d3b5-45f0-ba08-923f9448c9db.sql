
-- Nettoyage complet et recréation des politiques RLS optimisées
-- Cette approche garantit qu'il n'y aura pas de conflits

-- Suppression de toutes les politiques existantes pour les tables concernées
DO $$
DECLARE
    pol_record RECORD;
BEGIN
    -- Supprimer toutes les politiques pour les tables principales
    FOR pol_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('notes', 'tasks', 'study_sessions', 'flashcards', 'study_goals', 
                         'pomodoro_sessions', 'calendar_events', 'performance_metrics',
                         'quiz_questions', 'quiz_attempts', 'research_sources', 'user_preferences',
                         'user_display_preferences', 'user_music_preferences', 'presentations',
                         'presentation_slides', 'study_plans', 'playlists', 'task_categories',
                         'pomodoro_settings', 'calculator_results', 'user_activities',
                         'exam_results', 'exam_sessions', 'kyc_documents')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol_record.policyname, pol_record.schemaname, pol_record.tablename);
    END LOOP;
END $$;

-- Création des nouvelles politiques RLS optimisées (une seule par table)
CREATE POLICY "notes_user_policy" ON public.notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "tasks_user_policy" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "study_sessions_user_policy" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "flashcards_user_policy" ON public.flashcards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "study_goals_user_policy" ON public.study_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "pomodoro_sessions_user_policy" ON public.pomodoro_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "calendar_events_user_policy" ON public.calendar_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "performance_metrics_user_policy" ON public.performance_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "quiz_questions_user_policy" ON public.quiz_questions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "quiz_attempts_user_policy" ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "research_sources_user_policy" ON public.research_sources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "user_preferences_user_policy" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "user_display_preferences_user_policy" ON public.user_display_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "user_music_preferences_user_policy" ON public.user_music_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "presentations_user_policy" ON public.presentations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "presentation_slides_user_policy" ON public.presentation_slides FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "study_plans_user_policy" ON public.study_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "playlists_user_policy" ON public.playlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "task_categories_user_policy" ON public.task_categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "pomodoro_settings_user_policy" ON public.pomodoro_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "calculator_results_user_policy" ON public.calculator_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "user_activities_user_policy" ON public.user_activities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "exam_results_user_policy" ON public.exam_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "exam_sessions_user_policy" ON public.exam_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "kyc_documents_user_policy" ON public.kyc_documents FOR ALL USING (auth.uid() = user_id);

-- Politique spéciale pour study_session_notes (basée sur la session de l'utilisateur)
DROP POLICY IF EXISTS "Users can view study session notes" ON public.study_session_notes;
DROP POLICY IF EXISTS "Users can create study session notes" ON public.study_session_notes;
DROP POLICY IF EXISTS "Users can update study session notes" ON public.study_session_notes;
DROP POLICY IF EXISTS "Users can delete study session notes" ON public.study_session_notes;
DROP POLICY IF EXISTS "study_session_notes_user_policy" ON public.study_session_notes;

CREATE POLICY "study_session_notes_user_policy" ON public.study_session_notes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.study_sessions 
    WHERE id = study_session_notes.session_id 
    AND user_id = auth.uid()
  )
);

-- Création des index optimisés manquants (si ils n'existent pas déjà)
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_community_topics_category_optimized ON public.community_topics(category);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_date ON public.performance_metrics(user_id, recorded_date);
CREATE INDEX IF NOT EXISTS idx_flashcards_user_category ON public.flashcards(user_id, category);
CREATE INDEX IF NOT EXISTS idx_discussion_chat_messages_topic_id ON public.discussion_chat_messages(topic_id);
CREATE INDEX IF NOT EXISTS idx_discussion_chat_messages_user_id ON public.discussion_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_chat_messages_created_at ON public.discussion_chat_messages(created_at);

-- Optimisation des contraintes d'unicité
ALTER TABLE public.user_preferences DROP CONSTRAINT IF EXISTS unique_user_preferences;
ALTER TABLE public.user_preferences ADD CONSTRAINT unique_user_preferences UNIQUE (user_id);

ALTER TABLE public.user_display_preferences DROP CONSTRAINT IF EXISTS unique_user_display_preferences;
ALTER TABLE public.user_display_preferences ADD CONSTRAINT unique_user_display_preferences UNIQUE (user_id);

ALTER TABLE public.user_music_preferences DROP CONSTRAINT IF EXISTS unique_user_music_preferences;
ALTER TABLE public.user_music_preferences ADD CONSTRAINT unique_user_music_preferences UNIQUE (user_id);

ALTER TABLE public.pomodoro_settings DROP CONSTRAINT IF EXISTS unique_pomodoro_settings;
ALTER TABLE public.pomodoro_settings ADD CONSTRAINT unique_pomodoro_settings UNIQUE (user_id);

-- Mise à jour des statistiques pour optimiser les performances
ANALYZE public.tasks;
ANALYZE public.study_sessions;
ANALYZE public.notes;
ANALYZE public.flashcards;
ANALYZE public.community_topics;
ANALYZE public.performance_metrics;
ANALYZE public.discussion_chat_messages;
