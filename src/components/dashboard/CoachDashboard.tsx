import React, { useState, useEffect } from 'react';
import { Users, Search, TrendingUp, Calendar, MessageSquare, Award, Filter, Eye, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

// Dummy data - replace with real queries later
const dummyTeamStats = {
  totalPlayers: 24,
  activeToday: 18,
  averageScore: 74,
  topPerformer: 'Alex Johnson',
  upcomingAssessments: 5
};

const dummyPlayers = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'AJ',
    position: 'Forward',
    lastActive: '2 hours ago',
    currentScore: 89,
    trend: 'up',
    trendValue: 5,
    assessments: 15,
    nextEvent: 'Sprint Test - Jan 15',
    spi: 750
  },
  {
    id: 2,
    name: 'Sarah Williams',
    avatar: 'SW',
    position: 'Midfielder',
    lastActive: '1 day ago',
    currentScore: 82,
    trend: 'up',
    trendValue: 3,
    assessments: 12,
    nextEvent: 'Agility Test - Jan 16',
    spi: 680
  },
  {
    id: 3,
    name: 'Mike Chen',
    avatar: 'MC',
    position: 'Defender',
    lastActive: '3 hours ago',
    currentScore: 76,
    trend: 'down',
    trendValue: 2,
    assessments: 18,
    nextEvent: 'Strength Test - Jan 17',
    spi: 620
  },
  {
    id: 4,
    name: 'Emma Davis',
    avatar: 'ED',
    position: 'Goalkeeper',
    lastActive: '5 hours ago',
    currentScore: 85,
    trend: 'up',
    trendValue: 7,
    assessments: 14,
    nextEvent: 'Reflex Test - Jan 18',
    spi: 720
  },
  {
    id: 5,
    name: 'James Wilson',
    avatar: 'JW',
    position: 'Forward',
    lastActive: '1 hour ago',
    currentScore: 78,
    trend: 'stable',
    trendValue: 0,
    assessments: 16,
    nextEvent: 'Endurance Test - Jan 19',
    spi: 640
  },
  {
    id: 6,
    name: 'Lisa Brown',
    avatar: 'LB',
    position: 'Midfielder',
    lastActive: '4 hours ago',
    currentScore: 80,
    trend: 'up',
    trendValue: 4,
    assessments: 13,
    nextEvent: 'Speed Test - Jan 20',
    spi: 660
  }
];

const dummyUpcomingEvents = [
  { id: 1, title: 'Team Sprint Assessment', date: '2024-01-15', players: 8, type: 'assessment' },
  { id: 2, title: 'Strength Evaluation', date: '2024-01-17', players: 12, type: 'evaluation' },
  { id: 3, title: 'Weekly Team Meeting', date: '2024-01-19', players: 24, type: 'meeting' }
];

export function CoachDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedView, setSelectedView] = useState('grid');

  const filteredPlayers = dummyPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = selectedPosition === 'all' || player.position === selectedPosition;
    return matchesSearch && matchesPosition;
  });

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') return <span className="text-green-600">↗ +{value}</span>;
    if (trend === 'down') return <span className="text-red-600">↘ -{value}</span>;
    return <span className="text-gray-600">→ {value}</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 65) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Coach Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Coach Dashboard 🏆
              </h1>
              <p className="text-xl text-gray-600">
                Manage and track your team's performance
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button icon={Plus} className="bg-indigo-600 hover:bg-indigo-700">
                Schedule Assessment
              </Button>
            </div>
          </div>
        </div>

        {/* Team Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Players</p>
                <p className="text-3xl font-bold">{dummyTeamStats.totalPlayers}</p>
              </div>
              <Users className="h-10 w-10 text-indigo-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Today</p>
                <p className="text-3xl font-bold">{dummyTeamStats.activeToday}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Team Average</p>
                <p className="text-3xl font-bold">{dummyTeamStats.averageScore}</p>
              </div>
              <Award className="h-10 w-10 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Top Performer</p>
                <p className="text-lg font-bold">{dummyTeamStats.topPerformer}</p>
              </div>
              <Award className="h-10 w-10 text-purple-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Upcoming Tests</p>
                <p className="text-3xl font-bold">{dummyTeamStats.upcomingAssessments}</p>
              </div>
              <Calendar className="h-10 w-10 text-orange-200" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Player Management */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-indigo-600" />
                  Your Team Players
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={selectedView === 'grid' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedView('grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={selectedView === 'list' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedView('list')}
                  >
                    List
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
                <Select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  fullWidth
                  options={[
                    { value: 'all', label: 'All Positions' },
                    { value: 'Forward', label: 'Forward' },
                    { value: 'Midfielder', label: 'Midfielder' },
                    { value: 'Defender', label: 'Defender' },
                    { value: 'Goalkeeper', label: 'Goalkeeper' }
                  ]}
                />
              </div>

              {/* Players Grid/List */}
              {selectedView === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredPlayers.map((player) => (
                    <Card key={player.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-indigo-600">
                            {player.avatar}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{player.name}</h4>
                          <p className="text-sm text-gray-600">{player.position}</p>
                          <span className="text-xs font-semibold text-blue-600">SPI: {player.spi}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreColor(player.currentScore)}`}>
                          {player.currentScore}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trend:</span>
                          {getTrendIcon(player.trend, player.trendValue)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assessments:</span>
                          <span className="font-medium">{player.assessments}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Active:</span>
                          <span className="font-medium">{player.lastActive}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Next: {player.nextEvent}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            icon={Eye}
                            onClick={() => alert(`View ${player.name}'s detailed profile`)}
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            icon={MessageSquare}
                            onClick={() => alert(`Send message to ${player.name}`)}
                          >
                            Contact
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-indigo-600">
                            {player.avatar}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{player.name}</h4>
                          <p className="text-sm text-gray-600">
                            SPI: {player.spi} • {player.assessments} assessments
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Score</p>
                          <p className={`font-bold ${getScoreColor(player.currentScore).split(' ')[0]}`}>
                            {player.currentScore}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">SPI</p>
                          <p className="font-bold text-blue-600">{player.spi}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Trend</p>
                          <span className="text-green-600">↗ +{Math.floor(Math.random() * 10)}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            icon={Eye}
                            onClick={() => alert(`View ${player.name}'s detailed profile`)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            icon={MessageSquare}
                            onClick={() => alert(`Send message to ${player.name}`)}
                          >
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Upcoming Events Sidebar */}
          <div>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-green-600" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {dummyUpcomingEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-indigo-500 pl-4 py-3 bg-indigo-50 rounded-r-lg">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.date}</p>
                    <p className="text-xs text-indigo-600 font-medium">
                      {event.players} players assigned
                    </p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                Manage Schedule
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Create new assessment template')}
                >
                  Create Assessment
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Send message to entire team')}
                >
                  Send Team Message
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Generate team performance report')}
                >
                  Generate Report
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Schedule training session')}
                >
                  Schedule Training
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Team Performance Summary */}
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Team Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-indigo-600">85%</p>
              <p className="text-gray-600">Players Improving</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">92%</p>
              <p className="text-gray-600">Assessment Completion</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">7.2</p>
              <p className="text-gray-600">Avg. Weekly Progress</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}