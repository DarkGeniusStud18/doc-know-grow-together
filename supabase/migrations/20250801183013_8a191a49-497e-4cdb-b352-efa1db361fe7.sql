-- 🔔 Migration complète pour notifications et playlists musicales
-- Création des tables nécessaires pour le système de notifications et la gestion musicale

-- Table pour notifications push système
CREATE TABLE IF NOT EXISTS public.user_music_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  volume INTEGER DEFAULT 80 CHECK (volume >= 0 AND volume <= 100),
  last_played_track UUID REFERENCES public.music_tracks(id) ON DELETE SET NULL,
  auto_play BOOLEAN DEFAULT false,
  repeat_mode TEXT DEFAULT 'none' CHECK (repeat_mode IN ('none', 'track', 'playlist')),
  shuffle_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Activer RLS sur les préférences musicales
ALTER TABLE public.user_music_preferences ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour les préférences musicales
CREATE POLICY "Utilisateurs gèrent leurs préférences musicales" 
ON public.user_music_preferences 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Table pour les notifications système améliorée
CREATE TABLE IF NOT EXISTS public.app_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'music', 'chat', 'system')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Activer RLS sur les notifications
ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour les notifications
CREATE POLICY "Utilisateurs voient leurs notifications" 
ON public.app_notifications 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Index pour optimiser les requêtes de notifications
CREATE INDEX IF NOT EXISTS idx_app_notifications_user_unread 
ON public.app_notifications(user_id, is_read, created_at DESC);

-- Fonction pour marquer les notifications comme lues
CREATE OR REPLACE FUNCTION public.mark_notifications_as_read(notification_ids UUID[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.app_notifications 
  SET is_read = true 
  WHERE id = ANY(notification_ids) 
    AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Fonction pour nettoyer les notifications expirées
CREATE OR REPLACE FUNCTION public.cleanup_expired_notifications()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.app_notifications 
  WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
END;
$$;

-- Trigger pour mettre à jour updated_at sur user_music_preferences
CREATE OR REPLACE FUNCTION public.update_music_preferences_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_music_preferences_updated_at
    BEFORE UPDATE ON public.user_music_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_music_preferences_updated_at();

-- Activer realtime pour les notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_music_preferences;