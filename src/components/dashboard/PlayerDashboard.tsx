import React, { useState, useEffect } from 'react';
import { User, Trophy, Calendar, TrendingUp, Target, Clock, Star, Activity, Camera, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';

// Dummy data - replace with real queries later
const dummyStats = {
  totalAssessments: 12,
  averageScore: 78,
  bestCategory: 'Strength',
  currentRank: 45,
  improvementRate: 12,
  spi: 742 // Sports Performance Index out of 1000
};

// SPI breakdown data
const spiBreakdown = [
  { name: 'Physical & Sports', value: 420, max: 600, color: '#3b82f6' },
  { name: 'Mental Fitness', value: 156, max: 200, color: '#10b981' },
  { name: 'Body Metrics', value: 166, max: 200, color: '#f59e0b' }
];

const spiData = [
  { name: 'SPI', value: 742, max: 1000, fill: '#3b82f6' }
];

const dummyPerformanceData = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 72 },
  { month: 'Apr', score: 75 },
  { month: 'May', score: 78 },
  { month: 'Jun', score: 82 }
];

const dummyCategoryData = [
  { category: 'Strength', score: 85 },
  { category: 'Endurance', score: 72 },
  { category: 'Agility', score: 78 },
  { category: 'Reflexes', score: 68 }
];

const dummyUpcomingEvents = [
  { id: 1, title: 'Sprint Assessment', date: '2024-01-15', time: '10:00 AM', type: 'assessment' },
  { id: 2, title: 'Team Training', date: '2024-01-18', time: '3:00 PM', type: 'training' },
  { id: 3, title: 'Fitness Evaluation', date: '2024-01-22', time: '9:00 AM', type: 'evaluation' }
];

const dummyRecentAchievements = [
  { id: 1, name: 'Speed Demon', description: 'Achieved excellent speed in sprint tests', icon: '⚡', earnedAt: '2024-01-10' },
  { id: 2, name: 'Consistent Performer', description: 'Completed 10 assessments', icon: '🏆', earnedAt: '2024-01-08' },
  { id: 3, name: 'Iron Will', description: 'Scored excellent in strength assessments', icon: '💪', earnedAt: '2024-01-05' }
];

export function PlayerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'bg-blue-100 text-blue-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'evaluation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.display_name || 'Athlete'}! 🏃‍♂️
              </h1>
              <p className="text-xl text-gray-600">
                Ready to push your limits today?
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Sports Performance Index</p>
                <p className="text-3xl font-bold text-blue-600">{dummyStats.spi}/1000</p>
                <p className="text-xs text-gray-500">Rank #{dummyStats.currentRank}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SPI Overview Section */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Sports Performance Index (SPI)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SPI Radial Chart */}
            <div className="text-center">
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={spiData}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-900">
                    {dummyStats.spi}
                  </text>
                  <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-600">
                    / 1000
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-900">
                  {dummyStats.spi >= 800 ? 'Elite Athlete' : 
                   dummyStats.spi >= 600 ? 'Advanced' : 
                   dummyStats.spi >= 400 ? 'Intermediate' : 'Beginner'}
                </p>
                <p className="text-sm text-gray-600">Performance Level</p>
              </div>
            </div>

            {/* SPI Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SPI Breakdown</h3>
              <div className="space-y-4">
                {spiBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}/{item.max}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(item.value / item.max) * 100}%`,
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((item.value / item.max) * 100)}% Complete
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Improve Your SPI</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Complete more fitness assessments (+Physical)</li>
                  <li>• Take body metrics analysis (+Body Metrics)</li>
                  <li>• Practice mindfulness exercises (+Mental)</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Assessments</p>
                <p className="text-3xl font-bold">{dummyStats.totalAssessments}</p>
              </div>
              <Trophy className="h-10 w-10 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold">{dummyStats.averageScore}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Best Category</p>
                <p className="text-xl font-bold">{dummyStats.bestCategory}</p>
              </div>
              <Star className="h-10 w-10 text-purple-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Improvement</p>
                <p className="text-3xl font-bold">+{dummyStats.improvementRate}%</p>
              </div>
              <Target className="h-10 w-10 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Body Metrics Analysis Section */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            AI Body Metrics Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Camera className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Upload Your Photo
              </h3>
              <p className="text-gray-600 mb-6">
                Get detailed body composition analysis using AI-powered pose detection. 
                Upload a full-body photo for comprehensive metrics.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/body-metrics')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Start Body Analysis
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Includes:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Shoulder Breadth</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Chest Width</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Waist Width</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Hip Width</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Arm Length</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Leg Proportions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Body Symmetry</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Posture Analysis</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Current Body Metrics Score</h4>
                <div className="flex items-center justify-between">
                  <span className="text-orange-800">Body Composition Index</span>
                  <span className="text-xl font-bold text-orange-900">166/200</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Performance Chart */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="h-6 w-6 mr-2 text-blue-600" />
              Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dummyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Upcoming Events */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-green-600" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {dummyUpcomingEvents.map((event) => (
                <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Events
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Performance */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="h-6 w-6 mr-2 text-purple-600" />
              Category Performance
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dummyCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Achievements */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {dummyRecentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start space-x-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Earned on {achievement.earnedAt}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Achievements
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Ready for Your Next Challenge?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/assessment')}
            >
              Take Assessment
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/profile')}
            >
              View Progress
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/community')}
            >
              Join Community
            </Button>
          </div>
        </Card>
      </div>

      {/* Live AI Analysis Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Live AI Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fitness Assessment */}
            <Card hover className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Basic Fitness Assessment
                </h3>
                <p className="text-gray-600 mb-6">
                  Test your push-up endurance with AI-powered form analysis. 
                  Get real-time counting and technique feedback.
                </p>
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Webcam Required
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/fitness')}
                    className="w-full max-w-xs"
                  >
                    Take Fitness Test
                  </Button>
                </div>
              </div>
            </Card>

            {/* Badminton Assessment */}
            <Card hover className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Badminton Skill Assessment
                </h3>
                <p className="text-gray-600 mb-6">
                  Analyze your smash speed and technique with advanced video processing. 
                  Get detailed performance metrics.
                </p>
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center text-sm text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Video Upload
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/badminton')}
                    className="w-full max-w-xs bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
                  >
                    Analyze Smash Speed
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}