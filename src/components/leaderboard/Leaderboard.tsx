import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Filter, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { testCategories } from '../../lib/aiScoring';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  percentile: number;
  answers: any;
  completed_at: string;
  profiles: {
    display_name: string;
    avatar_url?: string;
  };
}

export function Leaderboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTest, setSelectedTest] = useState<string>('all');

  useEffect(() => {
    loadLeaderboard();
  }, [selectedCategory, selectedTest]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('assessment_results')
        .select(`
          id,
          user_id,
          score,
          percentile,
          answers,
          completed_at,
          profiles!inner(display_name, avatar_url)
        `)
        .order('score', { ascending: false })
        .limit(50);

      // Filter by category and test if selected
      if (selectedCategory !== 'all') {
        query = query.eq('answers->>category', selectedCategory);
      }
      if (selectedTest !== 'all') {
        query = query.eq('answers->>test_type', selectedTest);
      }

      const { data } = await query;
      if (data) {
        setEntries(data);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
    return 'bg-white';
  };

  const allTests = Object.values(testCategories).flat();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Global Leaderboard
          </h1>
          <p className="text-lg text-gray-600">
            Compare your performance with athletes worldwide
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedTest('all');
              }}
              fullWidth
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'strength', label: 'Strength' },
                { value: 'endurance', label: 'Endurance' },
                { value: 'agility', label: 'Agility' },
                { value: 'reflexes', label: 'Reflexes' }
              ]}
            />
            <Select
              label="Test"
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              fullWidth
              options={[
                { value: 'all', label: 'All Tests' },
                ...(selectedCategory === 'all' 
                  ? allTests.map(test => ({ value: test.id, label: test.name }))
                  : testCategories[selectedCategory as keyof typeof testCategories]?.map(test => ({
                      value: test.id,
                      label: test.name
                    })) || []
                )
              ]}
            />
          </div>
        </Card>

        {/* Leaderboard */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Top Performers</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No results found</p>
              <p className="text-sm">Be the first to complete an assessment!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.user_id === user?.id;
                
                return (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      getRankBg(rank)
                    } ${isCurrentUser ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(rank)}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">
                              {entry.profiles.display_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {entry.profiles.display_name || 'Anonymous'}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              {entry.answers?.test_type && allTests.find(t => t.id === entry.answers.test_type)?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {entry.score}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.percentile}th percentile
                        </div>
                        {entry.answers?.result && (
                          <div className="text-xs text-gray-500">
                            {entry.answers.result} {entry.answers.unit}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
            <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to Climb the Rankings?
            </h3>
            <p className="text-gray-600 mb-6">
              Take more assessments to improve your scores and compete with athletes worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/assessment')}
                size="lg"
              >
                Take Assessment
              </Button>
              <Button 
                onClick={() => navigate('/fitness')}
                variant="outline"
                size="lg"
              >
                Fitness Test
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}