
-- Clean up duplicate RLS policies and indexes - Final optimization
-- Part 1: Remove duplicate and overlapping RLS policies

-- Remove redundant policies for group_messages
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.group_messages;
DROP POLICY IF EXISTS "Group messages are viewable by all" ON public.group_messages;

-- Remove redundant policies for group_resources  
DROP POLICY IF EXISTS "Group members can add resources" ON public.group_resources;
DROP POLICY IF EXISTS "Group resources are viewable by all" ON public.group_resources;
DROP POLICY IF EXISTS "group_resources_select_policy" ON public.group_resources;

-- Remove redundant policies for music_tracks
DROP POLICY IF EXISTS "Music tracks are viewable by everyone" ON public.music_tracks;
DROP POLICY IF EXISTS "Music tracks viewable by all authenticated users" ON public.music_tracks;

-- Remove redundant policies for playlist_tracks
DROP POLICY IF EXISTS "Playlist owners can manage tracks" ON public.playlist_tracks;
DROP POLICY IF EXISTS "Playlist tracks are viewable by all" ON public.playlist_tracks;

-- Remove redundant policies for profiles
DROP POLICY IF EXISTS "Public profiles viewable by all" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;

-- Remove redundant policies for resource_edits
DROP POLICY IF EXISTS "Resource edits are viewable by all" ON public.resource_edits;

-- Remove redundant policies for resource_files
DROP POLICY IF EXISTS "Users can create resource files" ON public.resource_files;
DROP POLICY IF EXISTS "Resource files are viewable by all" ON public.resource_files;
DROP POLICY IF EXISTS "Users can view all resource files" ON public.resource_files;

-- Remove redundant policies for resources
DROP POLICY IF EXISTS "Authenticated users can create resources" ON public.resources;
DROP POLICY IF EXISTS "All authenticated users can view resources" ON public.resources;
DROP POLICY IF EXISTS "Anyone can view public resources" ON public.resources;
DROP POLICY IF EXISTS "Anyone can view resources" ON public.resources;
DROP POLICY IF EXISTS "Resources are viewable by all" ON public.resources;
DROP POLICY IF EXISTS "Resources viewable by all authenticated users" ON public.resources;
DROP POLICY IF EXISTS "resources_select_policy" ON public.resources;

-- Remove redundant policies for study_group_members
DROP POLICY IF EXISTS "Users can leave groups or admins can remove members" ON public.study_group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.study_group_members;
DROP POLICY IF EXISTS "Group members are viewable by all" ON public.study_group_members;
DROP POLICY IF EXISTS "Users can view group memberships" ON public.study_group_members;
DROP POLICY IF EXISTS "Users can leave study groups" ON public.study_group_members;
DROP POLICY IF EXISTS "Users can join study groups" ON public.study_group_members;
DROP POLICY IF EXISTS "Users can view members of groups they belong to" ON public.study_group_members;
DROP POLICY IF EXISTS "study_group_members_select_policy" ON public.study_group_members;

-- Remove redundant policies for study_groups
DROP POLICY IF EXISTS "Group creators can delete their groups" ON public.study_groups;
DROP POLICY IF EXISTS "Users can create their own groups" ON public.study_groups;
DROP POLICY IF EXISTS "Public study groups are viewable by everyone" ON public.study_groups;
DROP POLICY IF EXISTS "Study groups are viewable by all" ON public.study_groups;
DROP POLICY IF EXISTS "Users can view public groups and their own groups" ON public.study_groups;
DROP POLICY IF EXISTS "Group creators can update their groups" ON public.study_groups;
DROP POLICY IF EXISTS "Users can delete their own study groups" ON public.study_groups;
DROP POLICY IF EXISTS "Users can create study groups" ON public.study_groups;
DROP POLICY IF EXISTS "Users can view public study groups" ON public.study_groups;
DROP POLICY IF EXISTS "Users can update their own study groups" ON public.study_groups;
DROP POLICY IF EXISTS "study_groups_select_policy" ON public.study_groups;

-- Remove redundant policies for study_session_notes
DROP POLICY IF EXISTS "Users can manage notes for their own study sessions" ON public.study_session_notes;

-- Remove redundant policies for switch_credentials
DROP POLICY IF EXISTS "Switch credentials readable by all authenticated users" ON public.switch_credentials;
DROP POLICY IF EXISTS "switch_credentials_select_policy" ON public.switch_credentials;

-- Part 2: Create clean, consolidated RLS policies

-- Consolidated policies for group_messages
CREATE POLICY "group_messages_policy" ON public.group_messages 
FOR ALL USING (auth.uid() = user_id);

-- Consolidated policies for group_resources
CREATE POLICY "group_resources_policy" ON public.group_resources 
FOR ALL USING (auth.uid() = added_by);

-- Consolidated policies for music_tracks (public read-only)
CREATE POLICY "music_tracks_policy" ON public.music_tracks 
FOR SELECT USING (true);

-- Consolidated policies for playlist_tracks
CREATE POLICY "playlist_tracks_policy" ON public.playlist_tracks 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.playlists 
    WHERE id = playlist_tracks.playlist_id 
    AND (user_id = auth.uid() OR is_public = true)
  )
);

-- Consolidated policies for profiles
CREATE POLICY "profiles_policy" ON public.profiles 
FOR ALL USING (auth.uid() = id);

-- Consolidated policies for resource_edits
CREATE POLICY "resource_edits_policy" ON public.resource_edits 
FOR ALL USING (auth.uid() = editor_id OR auth.uid() = original_author_id);

-- Consolidated policies for resource_files
CREATE POLICY "resource_files_policy" ON public.resource_files 
FOR ALL USING (auth.uid() = user_id);

-- Consolidated policies for resources
CREATE POLICY "resources_policy" ON public.resources 
FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "resources_public_read" ON public.resources 
FOR SELECT USING (true);

-- Consolidated policies for study_group_members
CREATE POLICY "study_group_members_policy" ON public.study_group_members 
FOR ALL USING (auth.uid() = user_id);

-- Consolidated policies for study_groups
CREATE POLICY "study_groups_policy" ON public.study_groups 
FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "study_groups_public_read" ON public.study_groups 
FOR SELECT USING (is_public = true);

-- Keep the optimized study_session_notes policy as it's already consolidated

-- Consolidated policies for switch_credentials (admin only)
CREATE POLICY "switch_credentials_policy" ON public.switch_credentials 
FOR ALL USING (get_current_user_role() = 'admin');

-- Part 3: Remove duplicate indexes

-- Community topics indexes
DROP INDEX IF EXISTS idx_community_topics_category;

-- Performance metrics indexes  
DROP INDEX IF EXISTS idx_performance_metrics_date;

-- Pomodoro settings indexes
DROP INDEX IF EXISTS pomodoro_settings_user_id_key;

-- Study group members indexes
DROP INDEX IF EXISTS study_group_members_group_id_user_id_key;

-- Study sessions indexes
DROP INDEX IF EXISTS idx_study_sessions_user_id_date;

-- Tasks indexes
DROP INDEX IF EXISTS idx_tasks_user_id_status;

-- User display preferences indexes
DROP INDEX IF EXISTS user_display_preferences_user_id_key;

-- User music preferences indexes
DROP INDEX IF EXISTS user_music_preferences_user_id_key;

-- Update statistics for performance optimization
ANALYZE public.group_messages;
ANALYZE public.group_resources;
ANALYZE public.music_tracks;
ANALYZE public.playlist_tracks;
ANALYZE public.profiles;
ANALYZE public.resource_edits;
ANALYZE public.resource_files;
ANALYZE public.resources;
ANALYZE public.study_group_members;
ANALYZE public.study_groups;
ANALYZE public.study_session_notes;
ANALYZE public.switch_credentials;
