
-- Ajouter les clés étrangères manquantes pour améliorer l'intégrité des données

-- Relations pour presentation_slides
ALTER TABLE public.presentation_slides 
ADD CONSTRAINT fk_presentation_slides_presentation 
FOREIGN KEY (presentation_id) REFERENCES public.presentations(id) ON DELETE CASCADE;

-- Relations pour playlist_tracks
ALTER TABLE public.playlist_tracks 
ADD CONSTRAINT fk_playlist_tracks_playlist 
FOREIGN KEY (playlist_id) REFERENCES public.playlists(id) ON DELETE CASCADE;

ALTER TABLE public.playlist_tracks 
ADD CONSTRAINT fk_playlist_tracks_track 
FOREIGN KEY (track_id) REFERENCES public.music_tracks(id) ON DELETE CASCADE;

-- Relations pour study_session_notes
ALTER TABLE public.study_session_notes 
ADD CONSTRAINT fk_study_session_notes_session 
FOREIGN KEY (session_id) REFERENCES public.study_sessions(id) ON DELETE CASCADE;

-- Relations pour community_responses
ALTER TABLE public.community_responses 
ADD CONSTRAINT fk_community_responses_topic 
FOREIGN KEY (topic_id) REFERENCES public.community_topics(id) ON DELETE CASCADE;

-- Relations pour community_discussions
ALTER TABLE public.community_discussions 
ADD CONSTRAINT fk_community_discussions_topic 
FOREIGN KEY (topic_id) REFERENCES public.community_topics(id) ON DELETE CASCADE;

-- Relations pour discussion_chat_messages
ALTER TABLE public.discussion_chat_messages 
ADD CONSTRAINT fk_discussion_chat_messages_topic 
FOREIGN KEY (topic_id) REFERENCES public.community_topics(id) ON DELETE CASCADE;

-- Relations pour group_messages
ALTER TABLE public.group_messages 
ADD CONSTRAINT fk_group_messages_group 
FOREIGN KEY (group_id) REFERENCES public.study_groups(id) ON DELETE CASCADE;

-- Relations pour study_group_members
ALTER TABLE public.study_group_members 
ADD CONSTRAINT fk_study_group_members_group 
FOREIGN KEY (group_id) REFERENCES public.study_groups(id) ON DELETE CASCADE;

-- Relations pour group_resources
ALTER TABLE public.group_resources 
ADD CONSTRAINT fk_group_resources_group 
FOREIGN KEY (group_id) REFERENCES public.study_groups(id) ON DELETE CASCADE;

ALTER TABLE public.group_resources 
ADD CONSTRAINT fk_group_resources_resource 
FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;

-- Relations pour quiz_attempts
ALTER TABLE public.quiz_attempts 
ADD CONSTRAINT fk_quiz_attempts_question 
FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id) ON DELETE CASCADE;

-- Relations pour resource_files
ALTER TABLE public.resource_files 
ADD CONSTRAINT fk_resource_files_resource 
FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;

-- Relations pour resource_edits
ALTER TABLE public.resource_edits 
ADD CONSTRAINT fk_resource_edits_resource 
FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;

ALTER TABLE public.resource_edits 
ADD CONSTRAINT fk_resource_edits_article 
FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;

-- Relations pour edit_notifications
ALTER TABLE public.edit_notifications 
ADD CONSTRAINT fk_edit_notifications_edit 
FOREIGN KEY (edit_id) REFERENCES public.resource_edits(id) ON DELETE CASCADE;

-- Relations pour tasks avec task_categories (optionnel)
ALTER TABLE public.tasks 
ADD COLUMN category_id UUID REFERENCES public.task_categories(id) ON DELETE SET NULL;

-- Contraintes de validation pour améliorer la qualité des données
ALTER TABLE public.study_sessions 
ADD CONSTRAINT check_duration_positive 
CHECK (duration_minutes > 0);

ALTER TABLE public.pomodoro_sessions 
ADD CONSTRAINT check_pomodoro_duration_positive 
CHECK (duration_minutes > 0);

ALTER TABLE public.study_goals 
ADD CONSTRAINT check_target_positive 
CHECK (target_value > 0);

ALTER TABLE public.study_goals 
ADD CONSTRAINT check_current_not_negative 
CHECK (current_value >= 0);

ALTER TABLE public.exam_sessions 
ADD CONSTRAINT check_score_valid 
CHECK (score >= 0 AND score <= max_score);

ALTER TABLE public.quiz_attempts 
ADD CONSTRAINT check_time_taken_positive 
CHECK (time_taken_seconds >= 0);

-- Index pour améliorer les performances des requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_community_topics_category ON public.community_topics(category);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_date ON public.performance_metrics(user_id, recorded_date);
CREATE INDEX IF NOT EXISTS idx_flashcards_user_category ON public.flashcards(user_id, category);

-- Contraintes d'unicité pour éviter les doublons
ALTER TABLE public.user_preferences 
ADD CONSTRAINT unique_user_preferences 
UNIQUE (user_id);

ALTER TABLE public.user_display_preferences 
ADD CONSTRAINT unique_user_display_preferences 
UNIQUE (user_id);

ALTER TABLE public.user_music_preferences 
ADD CONSTRAINT unique_user_music_preferences 
UNIQUE (user_id);

ALTER TABLE public.pomodoro_settings 
ADD CONSTRAINT unique_pomodoro_settings 
UNIQUE (user_id);

-- Contrainte pour éviter les doublons dans les playlists
ALTER TABLE public.playlist_tracks 
ADD CONSTRAINT unique_playlist_track_position 
UNIQUE (playlist_id, position);

-- Contrainte pour éviter les doublons dans les groupes
ALTER TABLE public.study_group_members 
ADD CONSTRAINT unique_group_member 
UNIQUE (group_id, user_id);
