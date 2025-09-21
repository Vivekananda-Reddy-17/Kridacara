import React, { useState, useEffect } from 'react';
import { User, Trophy, Calendar, TrendingUp, Target, Clock, Star, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Dummy data - replace with real queries later
const dummyStats = {
  totalAssessments: 12,
  averageScore: 78,
  bestCategory: 'Strength',
  currentRank: 45,
  improvementRate: 12
};

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
                <p className="text-sm text-gray-500">Current Rank</p>
                <p className="text-2xl font-bold text-blue-600">#{dummyStats.currentRank}</p>
              </div>
            </div>
          </div>
        </div>

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
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Take Assessment
            </Button>
            <Button size="lg" variant="outline">
              View Progress
            </Button>
            <Button size="lg" variant="outline">
              Join Community
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}