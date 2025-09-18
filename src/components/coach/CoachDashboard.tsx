import React, { useState, useEffect } from 'react';
import { Users, Search, Star, TrendingUp, Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface PlayerProfile {
  id: string;
  display_name: string;
  age?: number;
  location?: string;
  sport_preferences?: string[];
  latest_score?: number;
  assessments_count: number;
  avg_score: number;
}

export function CoachDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    if (user?.role === 'coach' || user?.role === 'admin') {
      loadPlayers();
    }
  }, [user, searchTerm, selectedCategory, selectedLocation]);

  const loadPlayers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          display_name,
          age,
          location,
          sport_preferences,
          assessment_results(score, answers)
        `)
        .eq('role', 'player');

      if (searchTerm) {
        query = query.ilike('display_name', `%${searchTerm}%`);
      }

      if (selectedLocation !== 'all') {
        query = query.eq('location', selectedLocation);
      }

      const { data } = await query;

      if (data) {
        const processedPlayers = data.map(player => {
          const assessments = player.assessment_results || [];
          const scores = assessments.map((a: any) => a.score);
          
          return {
            id: player.user_id,
            display_name: player.display_name || 'Anonymous',
            age: player.age,
            location: player.location,
            sport_preferences: player.sport_preferences,
            latest_score: scores.length > 0 ? Math.max(...scores) : undefined,
            assessments_count: assessments.length,
            avg_score: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
          };
        });

        // Filter by category if selected
        let filteredPlayers = processedPlayers;
        if (selectedCategory !== 'all') {
          filteredPlayers = processedPlayers.filter(player => 
            player.sport_preferences?.includes(selectedCategory)
          );
        }

        // Sort by average score descending
        filteredPlayers.sort((a, b) => b.avg_score - a.avg_score);

        setPlayers(filteredPlayers);
      }
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  if (user?.role !== 'coach' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-2">This section is only available for:</p>
          <div className="flex justify-center space-x-4 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Coaches</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Administrators</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">Your current role: <span className="font-semibold capitalize">{user?.role || 'Player'}</span></p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'admin' ? 'Admin Panel' : 'Coach Dashboard'}
          </h1>
          <p className="text-lg text-gray-600">
            {user?.role === 'admin' ? 'Manage users and system settings' : 'Discover and analyze talented athletes'}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              fullWidth
              options={[
                { value: 'all', label: 'All Locations' },
                { value: 'mumbai', label: 'Mumbai' },
                { value: 'delhi', label: 'Delhi' },
                { value: 'bangalore', label: 'Bangalore' },
                { value: 'chennai', label: 'Chennai' },
                { value: 'kolkata', label: 'Kolkata' }
              ]}
            />
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Players</p>
                <p className="text-2xl font-bold text-gray-900">{players.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {players.filter(p => p.avg_score >= 80).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {players.length > 0 
                    ? Math.round(players.reduce((sum, p) => sum + p.avg_score, 0) / players.length)
                    : 0
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(players.length * 0.3)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Players List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Player Profiles</h2>
            <div className="text-sm text-gray-600">
              {players.length} players found
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading players...</p>
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No players found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {player.display_name.charAt(0)}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {player.display_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {player.age && <span>Age: {player.age}</span>}
                          {player.location && <span>📍 {player.location}</span>}
                          <span>{player.assessments_count} assessments</span>
                        </div>
                        {player.sport_preferences && player.sport_preferences.length > 0 && (
                          <div className="flex items-center space-x-2 mt-1">
                            {player.sport_preferences.slice(0, 3).map((sport, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                              >
                                {sport}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(player.avg_score)}`}>
                          {player.avg_score}/100
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {getScoreGrade(player.avg_score)}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Eye}
                          onClick={() => navigate(`/player/${player.id}`)}
                        >
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          icon={MessageSquare}
                          onClick={() => {/* TODO: Implement messaging */}}
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AI Recommendations */}
        <Card className="p-6 mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🤖 AI Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Top Prospects</h4>
              <ul className="space-y-2">
                {players.slice(0, 3).map((player, index) => (
                  <li key={player.id} className="flex items-center justify-between">
                    <span className="text-gray-700">{player.display_name}</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {player.avg_score}/100
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Rising Stars</h4>
              <ul className="space-y-2">
                {players
                  .filter(p => p.avg_score >= 60 && p.avg_score < 80)
                  .slice(0, 3)
                  .map((player) => (
                    <li key={player.id} className="flex items-center justify-between">
                      <span className="text-gray-700">{player.display_name}</span>
                      <span className="text-sm font-semibold text-green-600">
                        Improving
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}