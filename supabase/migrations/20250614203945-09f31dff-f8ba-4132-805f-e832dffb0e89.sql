
-- Update the switch credentials with new PIN and password
UPDATE public.switch_credentials 
SET 
  pin_code = '1234',
  password = 'ByronStud18',
  updated_at = NOW()
WHERE id = (SELECT id FROM public.switch_credentials LIMIT 1);

-- If no credentials exist, insert new ones
INSERT INTO public.switch_credentials (pin_code, password)
SELECT '1234', 'ByronStud18'
WHERE NOT EXISTS (SELECT 1 FROM public.switch_credentials);
