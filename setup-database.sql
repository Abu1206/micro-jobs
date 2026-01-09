-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR,
  deadline TIMESTAMP,
  tags TEXT[] DEFAULT '{}',
  media_urls TEXT[] DEFAULT '{}',
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id),
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create saved_opportunities table
CREATE TABLE IF NOT EXISTS saved_opportunities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  full_name VARCHAR,
  headline VARCHAR,
  university VARCHAR,
  major VARCHAR,
  profile_photo_url VARCHAR,
  skills TEXT[] DEFAULT '{}',
  github_url VARCHAR,
  behance_url VARCHAR,
  linkedin_url VARCHAR,
  verified BOOLEAN DEFAULT FALSE,
  rating FLOAT DEFAULT 0,
  endorsements INTEGER DEFAULT 0,
  year VARCHAR,
  avatar_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Opportunities policies
CREATE POLICY "Opportunities are viewable by everyone" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Users can insert their own opportunities" ON opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own opportunities" ON opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own opportunities" ON opportunities FOR DELETE USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view their own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Saved opportunities policies
CREATE POLICY "Users can view their own saved" ON saved_opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create saved" ON saved_opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete saved" ON saved_opportunities FOR DELETE USING (auth.uid() = user_id);

-- User profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
