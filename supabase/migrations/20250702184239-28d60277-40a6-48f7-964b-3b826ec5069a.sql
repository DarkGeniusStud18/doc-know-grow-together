
-- Créer une table pour les administrateurs avec credentials sécurisés
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pin_code text NOT NULL,
  password text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insérer les credentials par défaut
INSERT INTO public.admin_credentials (pin_code, password) 
VALUES ('1234', 'ByronStud18')
ON CONFLICT DO NOTHING;

-- Activer RLS sur la table admin
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Policy pour que seuls les admins authentifiés peuvent accéder
CREATE POLICY "Only authenticated admins can access credentials"
ON public.admin_credentials
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Créer une table pour les statistiques d'administration
CREATE TABLE IF NOT EXISTS public.admin_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_type text NOT NULL,
  stat_value integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS sur admin_stats
ALTER TABLE public.admin_stats ENABLE ROW LEVEL SECURITY;

-- Policy pour admin_stats
CREATE POLICY "Admin stats accessible to authenticated users"
ON public.admin_stats
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Créer une fonction pour obtenir les statistiques des utilisateurs
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_study_sessions', (SELECT COUNT(*) FROM study_sessions),
    'total_pomodoro_sessions', (SELECT COUNT(*) FROM pomodoro_sessions),
    'total_flashcards', (SELECT COUNT(*) FROM flashcards),
    'total_clinical_cases', (SELECT COUNT(*) FROM clinical_cases),
    'total_quiz_questions', (SELECT COUNT(*) FROM quiz_questions),
    'active_users_last_7_days', (
      SELECT COUNT(DISTINCT user_id) 
      FROM user_activities 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    ),
    'total_notes', (SELECT COUNT(*) FROM notes),
    'total_study_groups', (SELECT COUNT(*) FROM study_groups),
    'total_resources', (SELECT COUNT(*) FROM resources)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- S'assurer que la table study_groups existe
CREATE TABLE IF NOT EXISTS public.study_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  creator_id uuid REFERENCES auth.users(id) NOT NULL,
  is_private boolean NOT NULL DEFAULT false,
  max_members integer DEFAULT 50,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS sur study_groups
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;

-- Policies pour study_groups
CREATE POLICY "Study groups are viewable by all authenticated users"
ON public.study_groups
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create study groups"
ON public.study_groups
FOR INSERT
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their study groups"
ON public.study_groups
FOR UPDATE
USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their study groups"
ON public.study_groups
FOR DELETE
USING (auth.uid() = creator_id);
