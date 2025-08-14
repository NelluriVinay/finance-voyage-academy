-- First, ensure the trigger function exists and is correct
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert profile for existing user (vinaynellurivinay@gmail.com)
INSERT INTO public.profiles (user_id, email, full_name)
SELECT 
  '141fd09b-1ce6-455e-8560-bd38519f5c41'::uuid,
  'vinaynellurivinay@gmail.com',
  'Vinay Nelluri'
ON CONFLICT (user_id) DO NOTHING;

-- Add admin role for the user
INSERT INTO public.user_roles (user_id, role)
SELECT 
  '141fd09b-1ce6-455e-8560-bd38519f5c41'::uuid,
  'admin'::app_role
ON CONFLICT DO NOTHING;