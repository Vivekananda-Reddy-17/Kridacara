import React from 'react';
import { Activity, Zap, User, TrendingUp, Trophy, Users, MessageSquare, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const bmiScore = user?.bmi ? Math.round((25 - Math.abs(user.bmi - 22)) * 4) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back! 🏆
          </h1>
          <p className="text-lg text-gray-600">
            Ready to assess your talent and connect with the sports community?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">BMI Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.bmi?.toFixed(1) || 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Fitness Score</p>
                <p className="text-2xl font-bold text-gray-900">{bmiScore}/100</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full mr-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Assessments</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Talent Assessment */}
          <Card hover className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Talent Assessment
              </h3>
              <p className="text-gray-600 mb-6">
                Upload test results and get AI-powered talent scoring across 
                strength, endurance, agility, and reflexes categories.
              </p>
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  AI-Powered Scoring
                </div>
                <Button 
                  size="lg"
                  onClick={() => navigate('/assessment')}
                  className="w-full max-w-xs bg-green-600 hover:bg-green-700 focus:ring-green-500"
                >
                  Take Assessment
                </Button>
              </div>
            </div>
          </Card>

          {/* Leaderboard */}
          <Card hover className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Global Leaderboard
              </h3>
              <p className="text-gray-600 mb-6">
                Compare your performance with athletes worldwide. 
                Track rankings and see where you stand.
              </p>
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center text-sm text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Global Rankings
                </div>
                <Button 
                  size="lg"
                  onClick={() => navigate('/leaderboard')}
                  className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                >
                  View Rankings
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Community */}
          <Card hover className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Sports Community
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Share achievements and connect with fellow athletes
              </p>
              <Button 
                size="sm"
                onClick={() => navigate('/community')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Join Community
              </Button>
            </div>
          </Card>

          {/* Coach Dashboard */}
          <Card hover className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {user?.role === 'coach' ? 'Coach Dashboard' : 
                 user?.role === 'admin' ? 'Admin Panel' : 'Coach Dashboard'}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {user?.role === 'coach' ? 'Discover and analyze talented athletes' :
                 user?.role === 'admin' ? 'Manage users and system settings' :
                 'View available for coaches and admins'}
              </p>
              {user?.role === 'coach' || user?.role === 'admin' ? (
                <Button 
                  size="sm"
                  onClick={() => navigate('/coach')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {user?.role === 'admin' ? 'Admin Panel' : 'View Players'}
                </Button>
              ) : (
                <Button 
                  size="sm"
                  disabled
                  className="w-full"
                >
                  Coaches Only
                </Button>
              )}
            </div>
          </Card>

          {/* Profile Management */}
          <Card hover className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Your Profile
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                View your performance history and stats
              </p>
              <Button 
                size="sm"
                onClick={() => navigate('/profile')}
                className="w-full"
              >
                View Profile
              </Button>
            </div>
          </Card>
        </div>

        {/* Role-specific sections */}
        {(user?.role === 'admin' || user?.role === 'coach') && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {user?.role === 'admin' ? 'Admin Tools' : 'Coach Tools'}
            </h2>
            <Card hover className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {user?.role === 'admin' ? 'System Administration' : 'Talent Discovery'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {user?.role === 'admin' 
                    ? 'Manage users, assessments, and system settings'
                    : 'Discover and analyze talented athletes'
                  }
                </p>
                <div className="space-y-2">
                  <Button 
                    size="sm"
                    onClick={() => navigate('/coach')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {user?.role === 'admin' ? 'Manage Users' : 'Scout Players'}
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/leaderboard')}
                    variant="outline"
                    className="w-full"
                  >
                    {user?.role === 'admin' ? 'Review Assessments' : 'View Rankings'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}


        {/* Legacy Assessment Modules - Keep for SIH Demo */}
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

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <Card className="p-6">
            <div className="text-center text-gray-500 py-8">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No assessments completed yet</p>
              <p className="text-sm">Complete your first assessment to see results here</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}