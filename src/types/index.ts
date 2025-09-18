export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  role: 'player' | 'coach' | 'admin';
  created_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  category: 'strength' | 'endurance' | 'agility' | 'reflexes' | 'fitness' | 'badminton';
  test_type: string;
  result: number;
  unit: string;
  ai_score: number;
  percentile: number;
  details?: any;
  verified: boolean;
  created_at: string;
}

export interface Leaderboard {
  id: string;
  category: string;
  test_type: string;
  user_id: string;
  user_name: string;
  result: number;
  ai_score: number;
  rank: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: any;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  achievement_id?: string;
  assessment_id?: string;
  likes: number;
  comments: number;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}
export interface FitnessResult {
  pushUpCount: number;
  duration: number;
  averageForm: number;
}

export interface BadmintonResult {
  smashSpeed: number;
  trajectory: string;
  technique: string;
}