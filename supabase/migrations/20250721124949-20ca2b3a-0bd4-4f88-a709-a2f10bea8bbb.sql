-- Migration pour créer les vues d'administration avec des statistiques réelles des utilisateurs
-- Cette migration remplace les données simulées par des données réelles du système

-- Créer une vue pour les statistiques des utilisateurs
CREATE OR REPLACE VIEW admin_user_stats AS
SELECT 
  COUNT(DISTINCT p.id) as total_users,
  COUNT(DISTINCT CASE WHEN p.updated_at > NOW() - INTERVAL '30 days' THEN p.id END) as active_users_month,
  COUNT(DISTINCT CASE WHEN p.updated_at > NOW() - INTERVAL '7 days' THEN p.id END) as active_users_week,
  COUNT(DISTINCT CASE WHEN p.created_at > NOW() - INTERVAL '1 day' THEN p.id END) as new_users_today,
  COUNT(DISTINCT CASE WHEN p.subscription_status = 'premium' THEN p.id END) as premium_users
FROM profiles p;

-- Créer une vue pour les statistiques des groupes d'étude
CREATE OR REPLACE VIEW admin_study_groups_stats AS
SELECT 
  COUNT(DISTINCT sg.id) as total_groups,
  COUNT(DISTINCT CASE WHEN sg.created_at > NOW() - INTERVAL '7 days' THEN sg.id END) as groups_created_week,
  AVG(member_counts.member_count) as avg_members_per_group,
  COUNT(DISTINCT sgm.user_id) as total_group_members
FROM study_groups sg
LEFT JOIN (
  SELECT group_id, COUNT(*) as member_count 
  FROM study_group_members 
  GROUP BY group_id
) member_counts ON sg.id = member_counts.group_id
LEFT JOIN study_group_members sgm ON sg.id = sgm.group_id;

-- Créer une vue pour les statistiques des discussions communautaires
CREATE OR REPLACE VIEW admin_community_stats AS
SELECT 
  COUNT(DISTINCT ct.id) as total_topics,
  COUNT(DISTINCT cr.id) as total_responses,
  COUNT(DISTINCT dcm.id) as total_chat_messages,
  COUNT(DISTINCT CASE WHEN ct.created_at > NOW() - INTERVAL '7 days' THEN ct.id END) as topics_created_week,
  COUNT(DISTINCT CASE WHEN cr.created_at > NOW() - INTERVAL '7 days' THEN cr.id END) as responses_created_week
FROM community_topics ct
LEFT JOIN community_responses cr ON ct.id = cr.topic_id
LEFT JOIN discussion_chat_messages dcm ON ct.id = dcm.topic_id;

-- Créer une vue pour les statistiques des ressources
CREATE OR REPLACE VIEW admin_resources_stats AS
SELECT 
  COUNT(DISTINCT r.id) as total_resources,
  COUNT(DISTINCT CASE WHEN r.created_at > NOW() - INTERVAL '7 days' THEN r.id END) as resources_created_week,
  COUNT(DISTINCT a.id) as total_articles,
  COUNT(DISTINCT cc.id) as total_clinical_cases,
  COUNT(DISTINCT CASE WHEN r.is_premium = true THEN r.id END) as premium_resources
FROM resources r
LEFT JOIN articles a ON true
LEFT JOIN clinical_cases cc ON true;

-- Créer une vue pour les statistiques des présentations
CREATE OR REPLACE VIEW admin_presentations_stats AS
SELECT 
  COUNT(DISTINCT p.id) as total_presentations,
  COUNT(DISTINCT ps.id) as total_slides,
  COUNT(DISTINCT CASE WHEN p.created_at > NOW() - INTERVAL '7 days' THEN p.id END) as presentations_created_week,
  COUNT(DISTINCT CASE WHEN p.is_public = true THEN p.id END) as public_presentations
FROM presentations p
LEFT JOIN presentation_slides ps ON p.id = ps.presentation_id;

-- Créer une vue pour les statistiques des sessions d'étude
CREATE OR REPLACE VIEW admin_study_stats AS
SELECT 
  COUNT(DISTINCT ss.id) as total_study_sessions,
  SUM(ss.duration_minutes) as total_study_minutes,
  COUNT(DISTINCT ps.id) as total_pomodoro_sessions,
  COUNT(DISTINCT CASE WHEN ss.started_at > NOW() - INTERVAL '7 days' THEN ss.id END) as sessions_this_week,
  AVG(ss.duration_minutes) as avg_session_duration
FROM study_sessions ss
LEFT JOIN pomodoro_sessions ps ON true;

-- Créer une fonction pour obtenir toutes les statistiques admin
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE(
  total_users bigint,
  active_users_month bigint,
  active_users_week bigint,
  new_users_today bigint,
  premium_users bigint,
  total_groups bigint,
  groups_created_week bigint,
  avg_members_per_group numeric,
  total_topics bigint,
  total_responses bigint,
  topics_created_week bigint,
  total_resources bigint,
  resources_created_week bigint,
  total_presentations bigint,
  presentations_created_week bigint,
  total_study_sessions bigint,
  total_study_minutes bigint,
  sessions_this_week bigint
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    us.total_users,
    us.active_users_month,
    us.active_users_week,
    us.new_users_today,
    us.premium_users,
    gs.total_groups,
    gs.groups_created_week,
    gs.avg_members_per_group,
    cs.total_topics,
    cs.total_responses,
    cs.topics_created_week,
    rs.total_resources,
    rs.resources_created_week,
    ps.total_presentations,
    ps.presentations_created_week,
    st.total_study_sessions,
    st.total_study_minutes,
    st.sessions_this_week
  FROM admin_user_stats us
  CROSS JOIN admin_study_groups_stats gs
  CROSS JOIN admin_community_stats cs
  CROSS JOIN admin_resources_stats rs
  CROSS JOIN admin_presentations_stats ps
  CROSS JOIN admin_study_stats st;
$$;

-- Accorder les permissions nécessaires pour l'accès admin
GRANT SELECT ON admin_user_stats TO authenticated;
GRANT SELECT ON admin_study_groups_stats TO authenticated;
GRANT SELECT ON admin_community_stats TO authenticated;
GRANT SELECT ON admin_resources_stats TO authenticated;
GRANT SELECT ON admin_presentations_stats TO authenticated;
GRANT SELECT ON admin_study_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO authenticated;