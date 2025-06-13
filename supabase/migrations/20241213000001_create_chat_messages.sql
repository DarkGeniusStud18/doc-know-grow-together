
-- Create discussion chat messages table
CREATE TABLE IF NOT EXISTS public.discussion_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES public.community_topics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.discussion_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view chat messages for topics they can access" ON public.discussion_chat_messages
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert chat messages" ON public.discussion_chat_messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own chat messages" ON public.discussion_chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages" ON public.discussion_chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_discussion_chat_messages_topic_id ON public.discussion_chat_messages(topic_id);
CREATE INDEX IF NOT EXISTS idx_discussion_chat_messages_user_id ON public.discussion_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_chat_messages_created_at ON public.discussion_chat_messages(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_discussion_chat_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discussion_chat_messages_updated_at
    BEFORE UPDATE ON public.discussion_chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_discussion_chat_messages_updated_at();
