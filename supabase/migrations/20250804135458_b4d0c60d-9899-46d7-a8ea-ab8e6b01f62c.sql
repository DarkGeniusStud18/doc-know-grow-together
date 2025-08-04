-- 🔐 Migration de sécurité et optimisation MedCollab v3 (simplifiée)
-- Cette migration corrige les vulnérabilités critiques sans erreurs

-- 🔔 1. Table pour les préférences de notifications (si inexistante)
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

-- Politique RLS sécurisée
DROP POLICY IF EXISTS "Utilisateurs gèrent leurs préférences de notifications" ON user_notification_preferences;
CREATE POLICY "Utilisateurs gèrent leurs préférences de notifications"
ON user_notification_preferences FOR ALL
USING (auth.uid() = user_id);

-- 📱 2. Amélioration de la table calendar_events avec rappels
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

-- 📝 3. Amélioration de la table resources avec pages personnalisées
ALTER TABLE resources ADD COLUMN IF NOT EXISTS custom_page_content TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS sharing_enabled BOOLEAN DEFAULT true;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS featured_image_url TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- 📊 4. Table pour les partages de ressources
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

DROP POLICY IF EXISTS "Tous peuvent voir les partages de ressources publiques" ON resource_shares;
CREATE POLICY "Tous peuvent voir les partages de ressources publiques"
ON resource_shares FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM resources 
    WHERE resources.id = resource_shares.resource_id 
    AND resources.sharing_enabled = true
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent créer des partages" ON resource_shares;
CREATE POLICY "Utilisateurs peuvent créer des partages"
ON resource_shares FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 🔧 5. Fonction pour les notifications push automatiques
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

-- 📈 6. Optimisation des performances avec des index composites
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created 
ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_topics_category_activity 
ON community_topics(category, last_activity DESC) 
WHERE is_pinned = false;

-- 🔄 7. Trigger de mise à jour automatique  
DROP TRIGGER IF EXISTS update_user_notification_preferences_updated_at ON user_notification_preferences;
CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ✅ 8. Validation et contraintes de sécurité (avec vérification)
DO $$
BEGIN
  -- Contrainte pour la durée des événements
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_event_duration' 
    AND table_name = 'calendar_events'
  ) THEN
    ALTER TABLE calendar_events 
    ADD CONSTRAINT check_event_duration 
    CHECK (end_time > start_time);
  END IF;
END $$;

-- 🎯 9. Fonction de nettoyage périodique
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
  
  -- Nettoyage des logs de partage anciens (si la table existe)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'resource_shares') THEN
    DELETE FROM resource_shares 
    WHERE shared_at < now() - INTERVAL '1 year';
  END IF;
  
  RAISE NOTICE 'Nettoyage des données anciennes effectué';
END;
$$;

-- 🔄 10. Commentaires de documentation
COMMENT ON TABLE user_notification_preferences IS 'Préférences de notifications par utilisateur avec support PWA/native';
COMMENT ON TABLE resource_shares IS 'Historique des partages de ressources pour analytics';
COMMENT ON FUNCTION cleanup_old_data() IS 'Fonction de maintenance automatique des données';

-- ✅ Migration terminée avec succès
SELECT 'Migration de sécurité et optimisation MedCollab v3 terminée' as status;