import React, { useState, useEffect } from 'react';
import { User, Activity, Zap, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { Assessment } from '../../types';

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAssessments();
    }
  }, [user]);

  const loadAssessments = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setAssessments(data);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fitnessData = assessments
    .filter(a => a.type === 'fitness')
    .slice(-10)
    .map((a, index) => ({
      session: index + 1,
      pushups: a.result,
      date: new Date(a.created_at).toLocaleDateString()
    }));

  const badmintonData = assessments
    .filter(a => a.type === 'badminton')
    .slice(-10)
    .map((a, index) => ({
      session: index + 1,
      speed: a.result,
      date: new Date(a.created_at).toLocaleDateString()
    }));

  const latestFitness = assessments.find(a => a.type === 'fitness');
  const latestBadminton = assessments.find(a => a.type === 'badminton');

  const bmiScore = user?.bmi ? Math.round((25 - Math.abs(user.bmi - 22)) * 4) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            Your Performance Profile
          </h1>
          <p className="text-lg text-gray-600">
            Track your progress and analyze your performance trends
          </p>
        </div>

        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.email}</h2>
                <p className="text-gray-600">Member since {new Date(user?.created_at || '').toLocaleDateString()}</p>
                {user?.height && user?.weight && (
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Height: {user.height}cm</span>
                    <span>Weight: {user.weight}kg</span>
                    <span>BMI: {user.bmi?.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Fitness Score</p>
                <p className="text-2xl font-bold text-gray-900">{bmiScore}/100</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Best Push-ups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestFitness ? latestFitness.result : '-'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full mr-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Max Speed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestBadminton ? `${latestBadminton.result}km/h` : '-'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Fitness Progress */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Fitness Progress
            </h3>
            {fitnessData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fitnessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Session ${value}`}
                    formatter={(value) => [`${value} push-ups`, 'Push-ups']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pushups" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No fitness assessments yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/fitness')}
                  className="mt-4"
                >
                  Take Fitness Test
                </Button>
              </div>
            )}
          </Card>

          {/* Badminton Progress */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Badminton Performance
            </h3>
            {badmintonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={badmintonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Session ${value}`}
                    formatter={(value) => [`${value} km/h`, 'Speed']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#ea580c" 
                    strokeWidth={3}
                    dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No badminton assessments yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/badminton')}
                  className="mt-4"
                >
                  Analyze Smash Speed
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Assessments */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Assessments
          </h3>
          {assessments.length > 0 ? (
            <div className="space-y-4">
              {assessments.slice(0, 5).map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      assessment.type === 'fitness' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      {assessment.type === 'fitness' ? (
                        <Activity className={`h-5 w-5 ${
                          assessment.type === 'fitness' ? 'text-blue-600' : 'text-orange-600'
                        }`} />
                      ) : (
                        <Zap className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {assessment.type === 'fitness' ? 'Fitness Assessment' : 'Badminton Assessment'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {assessment.type === 'fitness' 
                        ? `${assessment.result} push-ups`
                        : `${assessment.result} km/h`
                      }
                    </p>
                    {assessment.details?.technique && (
                      <p className="text-sm text-gray-600">{assessment.details.technique}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No assessments yet</p>
              <p className="text-sm mb-6">Complete your first assessment to start tracking progress</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/fitness')}>
                  Take Fitness Test
                </Button>
                <Button 
                  onClick={() => navigate('/badminton')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Analyze Badminton
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}