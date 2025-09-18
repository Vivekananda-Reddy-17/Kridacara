import React, { useState } from 'react';
import { Trophy, Target, Clock, Zap, Plus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { calculateAIScore, testCategories } from '../../lib/aiScoring';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const categoryIcons = {
  strength: Trophy,
  endurance: Clock,
  agility: Zap,
  reflexes: Target
};

const categoryColors = {
  strength: 'from-red-50 to-red-100 border-red-200',
  endurance: 'from-blue-50 to-blue-100 border-blue-200',
  agility: 'from-green-50 to-green-100 border-green-200',
  reflexes: 'from-purple-50 to-purple-100 border-purple-200'
};

export function TalentAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCategory || !selectedTest || !result) return;

    setLoading(true);

    try {
      const numericResult = parseFloat(result);
      const testInfo = testCategories[selectedCategory as keyof typeof testCategories]
        .find(t => t.id === selectedTest);

      if (!testInfo) return;

      // Calculate AI score
      const aiAnalysis = calculateAIScore(
        selectedTest,
        numericResult,
        user.age || 25,
        user.gender || 'male'
      );

      // Save assessment
      const { data: assessment } = await supabase
        .from('assessment_results')
        .insert({
          user_id: user.id,
          assessment_id: 'talent-assessment',
          score: aiAnalysis.score,
          percentile: aiAnalysis.percentile,
          answers: {
            category: selectedCategory,
            test_type: selectedTest,
            result: numericResult,
            unit: testInfo.unit,
            grade: aiAnalysis.grade
          }
        })
        .select()
        .single();

      setAssessmentResult({
        ...aiAnalysis,
        result: numericResult,
        unit: testInfo.unit,
        testName: testInfo.name,
        category: selectedCategory
      });

      setShowResult(true);
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setSelectedCategory('');
    setSelectedTest('');
    setResult('');
    setShowResult(false);
    setAssessmentResult(null);
  };

  if (showResult && assessmentResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
          </div>

          <div className="text-center mb-8">
            <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Assessment Complete!
              </h1>
              <p className="text-lg text-gray-600">
                Your talent scorecard is ready
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Score</h2>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {assessmentResult.score}
                </div>
                <div className="text-lg text-gray-600">AI Talent Score</div>
                <div className="text-sm text-gray-500">
                  {assessmentResult.percentile}th percentile
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Test</span>
                  <span className="font-semibold">{assessmentResult.testName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Result</span>
                  <span className="font-semibold">
                    {assessmentResult.result} {assessmentResult.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grade</span>
                  <span className={`font-semibold ${
                    assessmentResult.grade === 'Excellent' ? 'text-green-600' :
                    assessmentResult.grade === 'Good' ? 'text-blue-600' :
                    assessmentResult.grade === 'Average' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {assessmentResult.grade}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold capitalize">{assessmentResult.category}</span>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analysis</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Strengths</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {assessmentResult.score >= 80 && (
                      <li>• Exceptional performance in this category</li>
                    )}
                    {assessmentResult.percentile >= 70 && (
                      <li>• Above average compared to peers</li>
                    )}
                    <li>• Consistent technique and form</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {assessmentResult.score < 60 && (
                      <li>• Focus on building foundational strength</li>
                    )}
                    {assessmentResult.score >= 60 && assessmentResult.score < 80 && (
                      <li>• Increase training intensity gradually</li>
                    )}
                    {assessmentResult.score >= 80 && (
                      <li>• Maintain current training regimen</li>
                    )}
                    <li>• Track progress with regular assessments</li>
                    <li>• Consider specialized coaching</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={resetAssessment} size="lg">
              Take Another Test
            </Button>
            <Button 
              onClick={() => navigate('/leaderboard')}
              variant="outline"
              size="lg"
            >
              View Leaderboard
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              size="lg"
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Talent Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Upload your test results and get AI-powered talent scoring
          </p>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(testCategories).map(([category, tests]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              const colorClass = categoryColors[category as keyof typeof categoryColors];
              
              return (
                <Card 
                  key={category}
                  hover
                  className={`p-8 bg-gradient-to-br ${colorClass} cursor-pointer`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="text-center">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-gray-700" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                      {category}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {tests.length} tests available
                    </p>
                    <div className="text-sm text-gray-500">
                      {tests.slice(0, 2).map(test => test.name).join(', ')}
                      {tests.length > 2 && ` +${tests.length - 2} more`}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                {selectedCategory} Assessment
              </h2>
              <p className="text-gray-600">
                Select a test and enter your result for AI-powered analysis
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Select
                label="Select Test"
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                required
                fullWidth
                options={[
                  { value: '', label: 'Choose a test...' },
                  ...testCategories[selectedCategory as keyof typeof testCategories].map(test => ({
                    value: test.id,
                    label: `${test.name} (${test.unit})`
                  }))
                ]}
              />

              {selectedTest && (
                <Input
                  label={`Result (${testCategories[selectedCategory as keyof typeof testCategories]
                    .find(t => t.id === selectedTest)?.unit})`}
                  type="number"
                  step="0.01"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter your result"
                />
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedCategory('')}
                  fullWidth
                >
                  Back to Categories
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedTest || !result}
                  loading={loading}
                  fullWidth
                  icon={Plus}
                >
                  Analyze Performance
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}