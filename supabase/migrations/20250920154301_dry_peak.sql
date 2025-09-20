/*
  # Complete Kridacara Database Schema

  1. New Tables
    - `profiles` - User profile information with roles
    - `user_roles` - Role management system
    - `assessments` - Assessment templates and configurations
    - `assessment_results` - User assessment results and scores
    - `posts` - Community posts and achievements
    - `follows` - User follow relationships
    - `achievements` - Achievement definitions
    - `user_achievements` - User earned achievements

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each role
    - Create helper functions for role checking

  3. Functions
    - Role checking functions
    - Profile creation triggers
    - Updated timestamp triggers
*/

-- Create custom types
CREATE TYPE app_role AS ENUM ('player', 'coach', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  height numeric,
  weight numeric,
  bmi numeric,
  role app_role DEFAULT 'player'::app_role NOT NULL,
  location text,
  sport_preferences text[],
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_roles table for role management
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role DEFAULT 'player'::app_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  difficulty text DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  duration_minutes integer DEFAULT 15,
  max_score integer DEFAULT 100,
  instructions jsonb,
  questions jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create assessment_results table
CREATE TABLE IF NOT EXISTS assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL,
  percentile numeric(5,2),
  answers jsonb,
  completed_at timestamptz DEFAULT now() NOT NULL,
  time_taken_seconds integer
);

-- Create posts table for community
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  achievement_id uuid,
  assessment_id uuid REFERENCES assessments(id),
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(follower_id, following_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  category text,
  criteria jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to check user roles
CREATE OR REPLACE FUNCTION has_role(user_id uuid, check_role app_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = $1 AND profiles.role = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS app_role AS $$
DECLARE
  user_role app_role;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE profiles.user_id = $1;
  RETURN COALESCE(user_role, 'player'::app_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (user_id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'player'::app_role)
  );
  
  INSERT INTO user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'player'::app_role)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Assessments policies
CREATE POLICY "Assessments are viewable by everyone" ON assessments FOR SELECT USING (true);
CREATE POLICY "Coaches and admins can create assessments" ON assessments FOR INSERT WITH CHECK (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Coaches and admins can update assessments they created" ON assessments FOR UPDATE USING (created_by = auth.uid() AND (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins can update any assessment" ON assessments FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Assessment results policies
CREATE POLICY "Users can view their own results" ON assessment_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Coaches and admins can view all results" ON assessment_results FOR SELECT USING (has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create their own results" ON assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can create their own follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own follows" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone" ON achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON achievements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- User achievements policies
CREATE POLICY "User achievements are viewable by everyone" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Insert some sample achievements
INSERT INTO achievements (name, description, icon, category, criteria) VALUES
('First Assessment', 'Complete your first talent assessment', '🏆', 'general', '{"assessments_completed": 1}'),
('Speed Demon', 'Achieve excellent rating in sprint tests', '⚡', 'endurance', '{"category": "endurance", "min_score": 80}'),
('Strength Master', 'Achieve excellent rating in strength tests', '💪', 'strength', '{"category": "strength", "min_score": 80}'),
('Agility Expert', 'Achieve excellent rating in agility tests', '🤸', 'agility', '{"category": "agility", "min_score": 80}'),
('Quick Reflexes', 'Achieve excellent rating in reflex tests', '⚡', 'reflexes', '{"category": "reflexes", "min_score": 80}'),
('Community Star', 'Get 50 likes on your posts', '⭐', 'social', '{"total_likes": 50}'),
('Consistent Performer', 'Complete 10 assessments', '📈', 'general', '{"assessments_completed": 10}')
ON CONFLICT DO NOTHING;