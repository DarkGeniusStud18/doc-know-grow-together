
-- Create community discussions table
CREATE TABLE public.community_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES community_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add popularity tracking to community topics
ALTER TABLE public.community_topics ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.community_topics ADD COLUMN IF NOT EXISTS response_count INTEGER DEFAULT 0;
ALTER TABLE public.community_topics ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create exam sessions table
CREATE TABLE public.exam_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_type TEXT NOT NULL,
  questions_count INTEGER NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  subjects TEXT[] DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create file storage table for resources
CREATE TABLE public.resource_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.community_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_files ENABLE ROW LEVEL SECURITY;

-- RLS policies for community discussions
CREATE POLICY "Users can view all discussions" ON public.community_discussions FOR SELECT USING (true);
CREATE POLICY "Users can create discussions" ON public.community_discussions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own discussions" ON public.community_discussions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own discussions" ON public.community_discussions FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for exam sessions
CREATE POLICY "Users can view their own exam sessions" ON public.exam_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own exam sessions" ON public.exam_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for resource files
CREATE POLICY "Users can view all resource files" ON public.resource_files FOR SELECT USING (true);
CREATE POLICY "Users can create resource files" ON public.resource_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resource files" ON public.resource_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resource files" ON public.resource_files FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for resource files
INSERT INTO storage.buckets (id, name, public) VALUES ('resource-files', 'resource-files', true);

-- Storage policies for resource files
CREATE POLICY "Anyone can view resource files" ON storage.objects FOR SELECT USING (bucket_id = 'resource-files');
CREATE POLICY "Authenticated users can upload resource files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resource-files' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own files" ON storage.objects FOR UPDATE USING (bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create music tracks with default data
INSERT INTO public.music_tracks (title, artist, file_url, category, duration, cover_image) VALUES
('Lofi Study Beat #1', 'Study Sounds', '/audio/lofi-beat-1.mp3', 'lofi', 180, '/images/lofi-cover-1.jpg'),
('Concentration Flow', 'Focus Music', '/audio/concentration-flow.mp3', 'concentration', 240, '/images/focus-cover-1.jpg'),
('Deep Work Ambient', 'Productivity Sounds', '/audio/deep-work-ambient.mp3', 'ambient', 300, '/images/ambient-cover-1.jpg'),
('Study Session Lofi', 'Calm Beats', '/audio/study-lofi.mp3', 'lofi', 220, '/images/lofi-cover-2.jpg'),
('Focus Enhancement', 'Brain Waves', '/audio/focus-enhancement.mp3', 'concentration', 280, '/images/focus-cover-2.jpg')
ON CONFLICT DO NOTHING;

-- Add trigger to update community topics response count
CREATE OR REPLACE FUNCTION update_topic_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_topics 
    SET response_count = response_count + 1, last_activity = now()
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_topics 
    SET response_count = response_count - 1, last_activity = now()
    WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_topic_activity
  AFTER INSERT OR DELETE ON community_discussions
  FOR EACH ROW EXECUTE FUNCTION update_topic_activity();
