
-- Function to get all messages for a group
CREATE OR REPLACE FUNCTION public.get_group_messages(p_group_id UUID)
RETURNS SETOF public.group_messages
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM public.group_messages WHERE group_id = p_group_id;
$$;

-- Function to insert a new message
CREATE OR REPLACE FUNCTION public.insert_group_message(
  p_content TEXT,
  p_user_id UUID,
  p_group_id UUID
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  v_message_id UUID;
BEGIN
  INSERT INTO public.group_messages (content, user_id, group_id)
  VALUES (p_content, p_user_id, p_group_id)
  RETURNING id INTO v_message_id;
  
  RETURN v_message_id;
END;
$$;

-- Function to update a message
CREATE OR REPLACE FUNCTION public.update_group_message(
  p_message_id UUID,
  p_content TEXT,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.group_messages
  SET 
    content = p_content,
    updated_at = now()
  WHERE 
    id = p_message_id
    AND user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Function to delete a message
CREATE OR REPLACE FUNCTION public.delete_group_message(
  p_message_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  -- Check if user is an admin or moderator
  SELECT EXISTS (
    SELECT 1 FROM study_group_members sgm
    JOIN group_messages gm ON sgm.group_id = gm.group_id
    WHERE gm.id = p_message_id
      AND sgm.user_id = p_user_id
      AND sgm.role IN ('admin', 'moderator')
  ) INTO v_is_admin;
  
  -- Delete if owner or admin/moderator
  DELETE FROM public.group_messages
  WHERE 
    id = p_message_id
    AND (user_id = p_user_id OR v_is_admin = true);
  
  RETURN FOUND;
END;
$$;
