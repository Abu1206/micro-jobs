-- Create a function to sync new auth users to user_profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    full_name,
    headline,
    university,
    major,
    profile_photo_url,
    skills,
    github_url,
    behance_url,
    linkedin_url,
    verified,
    rating,
    endorsements,
    year,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    new.user_metadata->>'full_name',
    new.user_metadata->>'headline',
    new.user_metadata->>'university',
    new.user_metadata->>'major',
    new.user_metadata->>'profile_photo_url',
    COALESCE((new.user_metadata->>'skills')::text[], '{}'),
    new.user_metadata->>'github_url',
    new.user_metadata->>'behance_url',
    new.user_metadata->>'linkedin_url',
    false,
    0,
    0,
    new.user_metadata->>'year',
    new.user_metadata->>'avatar_url',
    NOW(),
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to call the function when a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
