-- Migration complète pour le système de messagerie unifié MedCollab
-- Cette migration crée toutes les tables nécessaires pour un système de chat moderne

-- 1. Table des conversations (remplace community_topics et group_messages partiellement)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('direct', 'group', 'community')),
  is_public BOOLEAN DEFAULT false,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  max_members INTEGER DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des participants aux conversations
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_muted BOOLEAN DEFAULT false,
  UNIQUE(conversation_id, user_id)
);

-- 3. Table des messages (unifie tous les types de messages)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'document', 'file')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des invitations (pour les conversations privées)
CREATE TABLE IF NOT EXISTS conversation_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  message TEXT,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, sender_id, recipient_id)
);

-- 5. Table des notifications push
CREATE TABLE IF NOT EXISTS push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'message' CHECK (type IN ('message', 'invitation', 'mention', 'system')),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  invitation_id UUID REFERENCES conversation_invitations(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  is_pushed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table des playlists pour la bibliothèque musicale
CREATE TABLE IF NOT EXISTS user_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Table des pistes dans les playlists
CREATE TABLE IF NOT EXISTS playlist_tracks_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES user_playlists(id) ON DELETE CASCADE,
  track_id UUID REFERENCES music_tracks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, track_id)
);

-- ACTIVATION ROW LEVEL SECURITY
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks_new ENABLE ROW LEVEL SECURITY;

-- POLITIQUES RLS POUR LES CONVERSATIONS
CREATE POLICY "Les utilisateurs peuvent voir les conversations publiques" ON conversations
  FOR SELECT USING (is_public = true);

CREATE POLICY "Les participants peuvent voir leurs conversations" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversations.id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs authentifiés peuvent créer des conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Les créateurs peuvent modifier leurs conversations" ON conversations
  FOR UPDATE USING (auth.uid() = creator_id);

-- POLITIQUES RLS POUR LES PARTICIPANTS
CREATE POLICY "Les participants peuvent voir les autres participants" ON conversation_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp2 
      WHERE cp2.conversation_id = conversation_participants.conversation_id 
      AND cp2.user_id = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs peuvent rejoindre des conversations" ON conversation_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent quitter leurs conversations" ON conversation_participants
  FOR DELETE USING (auth.uid() = user_id);

-- POLITIQUES RLS POUR LES MESSAGES
CREATE POLICY "Les participants peuvent voir les messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Les participants peuvent envoyer des messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Les expéditeurs peuvent modifier leurs messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "Les expéditeurs peuvent supprimer leurs messages" ON messages
  FOR DELETE USING (auth.uid() = sender_id);

-- POLITIQUES RLS POUR LES INVITATIONS
CREATE POLICY "Les utilisateurs peuvent voir leurs invitations" ON conversation_invitations
  FOR SELECT USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

CREATE POLICY "Les utilisateurs peuvent créer des invitations" ON conversation_invitations
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Les destinataires peuvent modifier leurs invitations" ON conversation_invitations
  FOR UPDATE USING (auth.uid() = recipient_id);

-- POLITIQUES RLS POUR LES NOTIFICATIONS
CREATE POLICY "Les utilisateurs voient leurs notifications" ON push_notifications
  FOR ALL USING (auth.uid() = user_id);

-- POLITIQUES RLS POUR LES PLAYLISTS
CREATE POLICY "Les utilisateurs voient leurs playlists et les publiques" ON user_playlists
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Les utilisateurs gèrent leurs playlists" ON user_playlists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Les propriétaires gèrent leurs pistes de playlist" ON playlist_tracks_new
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_playlists 
      WHERE id = playlist_tracks_new.playlist_id 
      AND user_id = auth.uid()
    )
  );

-- TRIGGERS POUR MISE À JOUR AUTOMATIQUE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON conversation_invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON user_playlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FONCTIONS POUR LES NOTIFICATIONS
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer des notifications pour tous les participants (sauf l'expéditeur)
  INSERT INTO push_notifications (user_id, title, body, type, conversation_id, message_id)
  SELECT 
    cp.user_id,
    CASE 
      WHEN c.type = 'direct' THEN (SELECT display_name FROM profiles WHERE id = NEW.sender_id)
      ELSE c.name
    END,
    CASE 
      WHEN NEW.message_type = 'text' THEN NEW.content
      ELSE 'Nouveau fichier partagé'
    END,
    'message',
    NEW.conversation_id,
    NEW.id
  FROM conversation_participants cp
  JOIN conversations c ON cp.conversation_id = c.id
  WHERE cp.conversation_id = NEW.conversation_id 
    AND cp.user_id != NEW.sender_id
    AND cp.is_muted = false;

  -- Mettre à jour la date du dernier message
  UPDATE conversations 
  SET last_message_at = NOW() 
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notify_new_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_message();

-- INDEX POUR OPTIMISER LES PERFORMANCES
CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_creator ON conversations(creator_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conv ON conversation_participants(conversation_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_invitations_recipient ON conversation_invitations(recipient_id);
CREATE INDEX idx_invitations_status ON conversation_invitations(status);
CREATE INDEX idx_notifications_user ON push_notifications(user_id);
CREATE INDEX idx_notifications_unread ON push_notifications(user_id, is_read) WHERE is_read = false;