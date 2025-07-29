-- 🔧 Fix Security Issues from Migration
-- Fix function search path and password protection

-- Fix search_path for security definer functions
CREATE OR REPLACE FUNCTION handle_social_auth_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile for social auth users
  INSERT INTO public.profiles (
    id, 
    display_name, 
    email, 
    role, 
    kyc_status,
    avatar_url,
    provider,
    provider_id
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name', 
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.app_role,
    'not_submitted'::public.kyc_status,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.app_metadata->>'provider', 'email'),
    NEW.raw_user_meta_data->>'provider_id'
  )
  ON CONFLICT (id) DO UPDATE SET
    avatar_url = EXCLUDED.avatar_url,
    provider = EXCLUDED.provider,
    provider_id = EXCLUDED.provider_id,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', '';