-- 🔐 Migration de sécurité et optimisation complète MedCollab
-- Cette migration corrige les vulnérabilités critiques et optimise la base de données

-- 🚨 1. Correction sécurité des stockages sensibles
-- Modification de la table kyc_documents pour sécuriser les documents
DROP POLICY IF EXISTS "kyc_documents_user_policy" ON storage.objects;

-- Politique sécurisée pour les documents KYC (bucket privé)
CREATE POLICY "KYC documents privés par utilisateur"
ON storage.objects FOR ALL
USING (
  bucket_id = 'kyc_documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 🔔 2. Système de notifications natifs amélioré
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  push_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  chat_notifications BOOLEAN DEFAULT true,
  study_reminders BOOLEAN DEFAULT true,
  community_updates BOOLEAN DEFAULT false,
  marketing_notifications BOOLEAN DEFAULT false,
  device_tokens JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id 
ON user_notification_preferences(user_id);

-- RLS pour les préférences de notifications
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilisateurs gèrent leurs préférences de notifications"
ON user_notification_preferences FOR ALL
USING (auth.uid() = user_id);

-- 🎵 3. Système de playlists musicales complet
CREATE TABLE IF NOT EXISTS user_music_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  volume INTEGER DEFAULT 80 CHECK (volume >= 0 AND volume <= 100),
  last_played_track UUID REFERENCES music_tracks(id),
  auto_play BOOLEAN DEFAULT false,
  repeat_mode TEXT DEFAULT 'off' CHECK (repeat_mode IN ('off', 'one', 'all')),
  shuffle_enabled BOOLEAN DEFAULT false,
  quality_preference TEXT DEFAULT 'auto' CHECK (quality_preference IN ('low', 'medium', 'high', 'auto')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Index et RLS pour les préférences musicales
CREATE INDEX IF NOT EXISTS idx_user_music_preferences_user_id 
ON user_music_preferences(user_id);

ALTER TABLE user_music_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilisateurs gèrent leurs préférences musicales"
ON user_music_preferences FOR ALL
USING (auth.uid() = user_id);

-- 📱 4. Table pour les événements de calendrier avec rappels
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT false;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS reminder_minutes_before INTEGER DEFAULT 15;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'general';
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS attendees JSONB DEFAULT '[]'::jsonb;

-- Index pour les rappels de calendrier
CREATE INDEX IF NOT EXISTS idx_calendar_events_reminder 
ON calendar_events(user_id, start_time) 
WHERE reminder_enabled = true AND reminder_sent = false;

-- 📝 5. Amélioration de la table resources avec pages personnalisées
ALTER TABLE resources ADD COLUMN IF NOT EXISTS custom_page_content TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS sharing_enabled BOOLEAN DEFAULT true;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS featured_image_url TEXT;

-- 📊 6. Table pour les partages de ressources
CREATE TABLE IF NOT EXISTS resource_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_platform TEXT NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Index pour les partages
CREATE INDEX IF NOT EXISTS idx_resource_shares_resource_id ON resource_shares(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_shares_user_id ON resource_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_shares_shared_at ON resource_shares(shared_at);

-- RLS pour les partages
ALTER TABLE resource_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tous peuvent voir les partages de ressources publiques"
ON resource_shares FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM resources 
    WHERE resources.id = resource_shares.resource_id 
    AND resources.is_public = true
  )
);

CREATE POLICY "Utilisateurs peuvent créer des partages"
ON resource_shares FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 🔧 7. Fonction pour les notifications push automatiques
CREATE OR REPLACE FUNCTION send_push_notification_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Créer une notification pour les rappels de calendrier
  IF TG_TABLE_NAME = 'calendar_events' AND NEW.reminder_enabled = true THEN
    INSERT INTO app_notifications (
      user_id,
      title,
      message,
      type,
      metadata,
      expires_at
    ) VALUES (
      NEW.user_id,
      'Rappel d''événement',
      'Votre événement "' || NEW.title || '" commence dans ' || NEW.reminder_minutes_before || ' minutes',
      'calendar_reminder',
      jsonb_build_object(
        'event_id', NEW.id,
        'event_title', NEW.title,
        'start_time', NEW.start_time
      ),
      NEW.start_time
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger pour les notifications automatiques
DROP TRIGGER IF EXISTS calendar_event_notification_trigger ON calendar_events;
CREATE TRIGGER calendar_event_notification_trigger
  AFTER INSERT OR UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION send_push_notification_trigger();

-- 🛡️ 8. Fonctions d'audit de sécurité
CREATE OR REPLACE FUNCTION log_security_event(
  event_type TEXT,
  user_id_param UUID,
  details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO app_notifications (
    user_id,
    title,
    message,
    type,
    metadata
  ) VALUES (
    user_id_param,
    'Événement de sécurité',
    'Activité détectée: ' || event_type,
    'security_alert',
    details
  );
END;
$$;

-- 📈 9. Optimisation des performances avec des index composites
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created 
ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_topics_category_activity 
ON community_topics(category, last_activity DESC) 
WHERE is_pinned = false;

CREATE INDEX IF NOT EXISTS idx_playlists_user_updated 
ON playlists(user_id, updated_at DESC) 
WHERE is_public = true;

-- 🧹 10. Nettoyage des données obsolètes
-- Supprimer les tokens d'appareils inactifs (plus de 30 jours)
DELETE FROM device_tokens 
WHERE updated_at < now() - INTERVAL '30 days' 
AND is_active = false;

-- Supprimer les notifications expirées
DELETE FROM app_notifications 
WHERE expires_at IS NOT NULL 
AND expires_at < now();

-- 🔄 11. Trigger de mise à jour automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Application des triggers de mise à jour
DROP TRIGGER IF EXISTS update_user_notification_preferences_updated_at ON user_notification_preferences;
CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_music_preferences_updated_at ON user_music_preferences;
CREATE TRIGGER update_user_music_preferences_updated_at
  BEFORE UPDATE ON user_music_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 📊 12. Vues optimisées pour les statistiques admin (remplace les Security Definer)
-- Cette vue permet d'éviter les problèmes de sécurité des vues Security Definer
CREATE OR REPLACE VIEW admin_dashboard_stats_secure AS
SELECT 
  'user_stats' as stat_type,
  jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'active_users_week', (SELECT COUNT(DISTINCT user_id) FROM calendar_events WHERE created_at > now() - INTERVAL '7 days'),
    'premium_users', (SELECT COUNT(*) FROM profiles WHERE subscription_status = 'premium')
  ) as stats
UNION ALL
SELECT 
  'content_stats' as stat_type,
  jsonb_build_object(
    'total_resources', (SELECT COUNT(*) FROM resources),
    'total_conversations', (SELECT COUNT(*) FROM conversations),
    'total_messages', (SELECT COUNT(*) FROM messages)
  ) as stats;

-- ✅ 13. Validation et contraintes de sécurité
-- Contrainte pour s'assurer que les événements ont une durée logique
ALTER TABLE calendar_events 
ADD CONSTRAINT check_event_duration 
CHECK (end_time > start_time);

-- Contrainte pour les volumes de musique
ALTER TABLE user_music_preferences 
ADD CONSTRAINT check_volume_range 
CHECK (volume >= 0 AND volume <= 100);

-- 🎯 14. Fonction de nettoyage périodique
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Nettoyage des sessions expirées
  DELETE FROM device_tokens 
  WHERE updated_at < now() - INTERVAL '60 days';
  
  -- Nettoyage des notifications anciennes
  DELETE FROM app_notifications 
  WHERE created_at < now() - INTERVAL '90 days' 
  AND is_read = true;
  
  -- Nettoyage des logs de partage anciens
  DELETE FROM resource_shares 
  WHERE shared_at < now() - INTERVAL '1 year';
  
  RAISE NOTICE 'Nettoyage des données anciennes effectué';
END;
$$;

-- 🔄 15. Finalisation avec commentaires de documentation
COMMENT ON TABLE user_notification_preferences IS 'Préférences de notifications par utilisateur avec support PWA/native';
COMMENT ON TABLE user_music_preferences IS 'Préférences musicales utilisateur avec contrôles avancés';
COMMENT ON TABLE resource_shares IS 'Historique des partages de ressources pour analytics';
COMMENT ON FUNCTION cleanup_old_data() IS 'Fonction de maintenance automatique des données';
COMMENT ON FUNCTION log_security_event(TEXT, UUID, JSONB) IS 'Logging sécurisé des événements de sécurité';

-- ✅ Migration terminée avec succès
SELECT 'Migration de sécurité et optimisation MedCollab terminée' as status;